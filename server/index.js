import express from "express";
import accountRoutes from "./account.js";
import { hash, fail, parse, auth, admin, isAdminEmail } from "./security.js";
import { pool, transaction } from "./db.js";
import { startMailWorker } from "./mail.js";
import bcrypt from "bcryptjs";
export { pool };
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { readFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadRoot = process.env.UPLOAD_DIR || path.join(root, "data/uploads");

const reserved = new Set([
  "api",
  "uploads",
  "login",
  "register",
  "dashboard",
  "links",
  "bio",
  "analytics",
  "settings",
  "pricing",
  "upgrade",
  "about",
  "contact",
  "terms",
  "privacy",
  "security",
  "account",
  "admin",
  "forgot-password",
]);
function slugCheck(value) {
  if (
    typeof value !== "string" ||
    !/^[a-z0-9][a-z0-9-]{0,99}$/.test(value) ||
    reserved.has(value)
  )
    throw fail(400, "Geçerli ve kullanılabilir bir kısa adres girin.");
}
function urlCheck(value) {
  let u;
  try {
    u = new URL(value);
  } catch {
    throw fail(400, "Geçerli bir URL girin.");
  }
  if (!["http:", "https:"].includes(u.protocol))
    throw fail(400, "URL http veya https ile başlamalı.");
}
function classifySource(referrer, userAgent = "") {
  const agent = userAgent.toLowerCase();
  const host = (() => {
    const value = String(referrer || "").trim();
    if (!value || value.toLowerCase() === "direct") return "";
    try {
      return new URL(value.startsWith("//") ? `https:${value}` : value.includes("://") ? value : `https://${value}`).hostname.toLowerCase().replace(/^www\./, "");
    } catch { return ""; }
  })();
  const aiAgent = [
    [/chatgpt-user|openai-user/, "ChatGPT"],
    [/claude-user|anthropic-user/, "Claude"],
    [/perplexity-user/, "Perplexity"],
  ].find(([pattern]) => pattern.test(agent));
  if (aiAgent) return { type: "ai", name: aiAgent[1] };
  const bots = [
    [/googlebot|google-inspectiontool/, "Googlebot"], [/bingbot|msnbot/, "Bingbot"],
    [/duckduckbot/, "DuckDuckBot"], [/yandexbot/, "YandexBot"], [/baiduspider/, "Baiduspider"],
    [/gptbot|oai-searchbot|openai-searchbot/, "OpenAI crawler"], [/claudebot|anthropic-ai/, "Anthropic crawler"],
    [/perplexitybot/, "Perplexity crawler"], [/applebot/, "Applebot"], [/bytespider/, "ByteDance crawler"],
    [/facebookexternalhit|facebookcatalog/, "Meta preview bot"], [/twitterbot/, "X preview bot"], [/pinterestbot/, "Pinterest preview bot"],
    [/linkedinbot/, "LinkedIn preview bot"], [/discordbot/, "Discord preview bot"], [/slackbot/, "Slack preview bot"],
    [/telegrambot/, "Telegram preview bot"], [/whatsapp/, "WhatsApp preview bot"],
    [/bot|crawler|spider|crawl|scrapy|headlesschrome|preview/, "Other bot"],
  ].find(([pattern]) => pattern.test(agent));
  if (bots) return { type: "bot", name: bots[1] };
  if (!host) return { type: "direct", name: "Direct" };
  const platforms = [
    ["ai", "ChatGPT", ["chatgpt.com", "chat.openai.com"]], ["ai", "Claude", ["claude.ai"]],
    ["ai", "Gemini", ["gemini.google.com"]], ["ai", "Copilot", ["copilot.microsoft.com"]],
    ["ai", "Perplexity", ["perplexity.ai"]], ["ai", "Poe", ["poe.com"]],
    ["ai", "You.com", ["you.com"]], ["ai", "Phind", ["phind.com"]],
    ["ai", "DeepSeek", ["deepseek.com"]], ["ai", "Mistral", ["mistral.ai"]],
    ["social", "Instagram", ["instagram.com"]], ["social", "TikTok", ["tiktok.com"]],
    ["social", "Facebook", ["facebook.com", "fb.com"]], ["social", "X", ["x.com", "twitter.com"]],
    ["social", "LinkedIn", ["linkedin.com"]], ["social", "Pinterest", ["pinterest.com"]],
    ["social", "Reddit", ["reddit.com"]], ["social", "YouTube", ["youtube.com", "youtu.be"]],
    ["social", "Threads", ["threads.net"]], ["social", "Snapchat", ["snapchat.com"]],
    ["social", "Discord", ["discord.com", "discord.gg"]], ["social", "WhatsApp", ["whatsapp.com"]],
    ["social", "Telegram", ["t.me", "telegram.org"]], ["social", "Twitch", ["twitch.tv"]],
    ["search", "Bing", ["bing.com"]],
    ["search", "Yahoo", ["search.yahoo.com"]], ["search", "DuckDuckGo", ["duckduckgo.com"]],
    ["search", "Yandex", ["yandex.com", "yandex.ru"]], ["search", "Baidu", ["baidu.com"]],
    ["search", "Brave Search", ["search.brave.com"]],
  ];
  if (/^(?:www\.)?google\.(?:com(?:\.[a-z]{2})?|[a-z]{2,3})$/.test(host)) return { type: "search", name: "Google" };
  for (const [type, name, domains] of platforms)
    if (domains.some((domain) => host === domain || host.endsWith(`.${domain}`))) return { type, name };
  return { type: "referral", name: host };
}
function countryFromRequest(req) {
  const country = String(req.get("cf-ipcountry") || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(country) && country !== "XX" ? country : "Unknown";
}
function deviceFromAgent(agent) {
  if (/iPad|Tablet|Kindle|Silk|PlayBook/i.test(agent) || (/Android/i.test(agent) && !/Mobile/i.test(agent))) return "tablet";
  if (/Mobi|iPhone|iPod|Android/i.test(agent)) return "mobile";
  return agent ? "desktop" : "other";
}
function normalize(row) {
  const r = { ...row };
  if (r.theme_settings) r.theme_settings = parse(r.theme_settings);
  if (r.settings) r.settings = parse(r.settings);
  if ("password_hash" in r) r.has_password = Boolean(r.password_hash);
  delete r.password_hash;
  for (const key of ["is_archived", "is_published", "is_read"])
    if (key in r) r[key] = Boolean(r[key]);
  if (r.created_at) r.created_at = r.created_at.replace(" ", "T") + "Z";
  return r;
}
const linkChannels = new Set(["default", "facebook", "twitter", "pinterest", "slack", "whatsapp", "telegram", "linkedin"]);
function validateLinkSettings(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || JSON.stringify(value).length > 12000)
    throw fail(400, "Link ayarları geçersiz.");
  const settings = {};
  if (value.utm && typeof value.utm === "object" && !Array.isArray(value.utm)) {
    settings.utm = {};
    for (const key of ["source", "medium", "campaign", "term", "content"]) {
      const entry = String(value.utm[key] || "").trim().slice(0, 200);
      if (entry) settings.utm[key] = entry;
    }
  }
  if (value.pixels && typeof value.pixels === "object" && !Array.isArray(value.pixels)) {
    const pixels = {};
    for (const key of ["meta", "google", "tiktok"]) {
      const id = String(value.pixels[key] || "").trim();
      if (!id) continue;
      if (id.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(id)) throw fail(400, "Piksel kimliği geçersiz.");
      if (key === "meta" && !/^\d{5,20}$/.test(id)) throw fail(400, "Meta Pixel kimliği yalnızca 5–20 rakam içermeli.");
      if (key === "google" && !/^(G-[A-Z0-9]+|AW-\d+|GT-[A-Z0-9]+)$/i.test(id)) throw fail(400, "Google kimliği G-, AW- veya GT- biçiminde olmalı.");
      pixels[key] = id;
    }
    settings.pixels = pixels;
  }
  if (Array.isArray(value.routingRules)) {
    if (value.routingRules.length > 20) throw fail(400, "En fazla 20 yönlendirme kuralı ekleyebilirsiniz.");
    settings.routingRules = value.routingRules.map((rule) => {
      if (!rule || typeof rule !== "object") throw fail(400, "Yönlendirme kuralı geçersiz.");
      const country = String(rule.country || "").toUpperCase();
      const os = String(rule.os || "");
      const browser = String(rule.browser || "");
      const url = String(rule.url || "").trim();
      if (country && !/^[A-Z]{2}$/.test(country)) throw fail(400, "Ülke kodu geçersiz.");
      if (os && !["ios", "android", "windows", "macos"].includes(os)) throw fail(400, "İşletim sistemi geçersiz.");
      if (browser && !["chrome", "safari", "firefox", "edge"].includes(browser)) throw fail(400, "Tarayıcı geçersiz.");
      if (!url) throw fail(400, "Yönlendirme hedefi gerekli.");
      urlCheck(url);
      return { country, os, browser, url };
    });
  }
  if (value.schedule && typeof value.schedule === "object") {
    const schedule = {};
    for (const key of ["startsAt", "expiresAt"]) {
      const date = value.schedule[key] ? new Date(value.schedule[key]) : null;
      if (date && !Number.isFinite(date.getTime())) throw fail(400, "Yayın tarihi geçersiz.");
      if (date) schedule[key] = date.toISOString();
    }
    if (schedule.startsAt && schedule.expiresAt && schedule.startsAt >= schedule.expiresAt)
      throw fail(400, "Bitiş tarihi başlangıçtan sonra olmalı.");
    settings.schedule = schedule;
  }
  if (value.socialPreview && typeof value.socialPreview === "object" && !Array.isArray(value.socialPreview)) {
    settings.socialPreview = {};
    for (const [channel, preview] of Object.entries(value.socialPreview)) {
      if (!linkChannels.has(channel) || !preview || typeof preview !== "object") continue;
      const item = {};
      for (const key of ["title", "description", "image"]) {
        const field = String(preview[key] || "").trim().slice(0, key === "description" ? 500 : 300);
        if (field) item[key] = field;
      }
      if (item.image) urlCheck(item.image);
      settings.socialPreview[channel] = item;
    }
  }
  if (value.interstitial && typeof value.interstitial === "object") {
    settings.interstitial = {
      enabled: Boolean(value.interstitial.enabled),
      title: String(value.interstitial.title || "").trim().slice(0, 160),
      message: String(value.interstitial.message || "").trim().slice(0, 500),
      buttonText: String(value.interstitial.buttonText || "").trim().slice(0, 50),
    };
  }
  if (value.qr && typeof value.qr === "object") {
    const qr = value.qr;
    const foreground = String(qr.foreground || "#111827");
    const background = String(qr.background || "#ffffff");
    if (!/^#[0-9a-f]{6}$/i.test(foreground) || !/^#[0-9a-f]{6}$/i.test(background)) throw fail(400, "QR renkleri geçersiz.");
    settings.qr = {
      size: [256, 512, 1024].includes(Number(qr.size)) ? Number(qr.size) : 512,
      foreground, background,
      moduleStyle: ["square", "rounded", "dots"].includes(qr.moduleStyle) ? qr.moduleStyle : "square",
      eyeStyle: ["square", "rounded", "circle"].includes(qr.eyeStyle) ? qr.eyeStyle : "square",
    };
  }
  return settings;
}
function linkAvailable(settings) {
  const now = Date.now();
  const starts = Date.parse(settings?.schedule?.startsAt || "");
  const expires = Date.parse(settings?.schedule?.expiresAt || "");
  if (Number.isFinite(starts) && starts > now) throw fail(404, "Bu kısa bağlantı henüz yayında değil.");
  if (Number.isFinite(expires) && expires <= now) throw fail(410, "Bu kısa bağlantının yayın süresi doldu.");
}
function platformFromAgent(agent) {
  const ua = String(agent || "");
  const os = /iPhone|iPad|iPod/i.test(ua) ? "ios" : /Android/i.test(ua) ? "android" : /Windows/i.test(ua) ? "windows" : /Macintosh|Mac OS/i.test(ua) ? "macos" : "";
  const browser = /Edg\//i.test(ua) ? "edge" : /Firefox\//i.test(ua) ? "firefox" : /Chrome\//i.test(ua) && !/Edg\//i.test(ua) ? "chrome" : /Safari\//i.test(ua) && !/Chrome\//i.test(ua) ? "safari" : "";
  return { os, browser };
}
function redirectUrl(original, settings, req) {
  const agent = req.get("user-agent") || "";
  const country = String(req.get("cf-ipcountry") || "").toUpperCase();
  const platform = platformFromAgent(agent);
  const match = settings?.routingRules?.find((rule) =>
    (!rule.country || rule.country === country) && (!rule.os || rule.os === platform.os) && (!rule.browser || rule.browser === platform.browser),
  );
  const target = new URL(match?.url || original);
  for (const [key, value] of Object.entries(settings?.utm || {}))
    target.searchParams.set(`utm_${key}`, value);
  return target.toString();
}
export const app = express();
app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cookieParser());
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    req.headers.origin &&
    req.headers.origin !== `${req.protocol}://${req.get("host")}`
  )
    return res
      .status(403)
      .json({ error: { message: "Geçersiz istek kaynağı." } });
  next();
});
app.use(
  "/api",
  rateLimit({
    windowMs: 60000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use("/api", async (req, res, next) => {
  try {
    const token = req.cookies.lenk_session;
    if (token) {
      const [rows] = await pool.execute(
        "SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>UTC_TIMESTAMP()",
        [hash(token)],
      );
      req.user = rows[0];
      if (req.user?.access_disabled) {
        await pool.execute("DELETE FROM sessions WHERE token_hash=?", [hash(token)]);
        res.clearCookie("lenk_session", { path: "/" });
        req.user = null;
        if (req.path !== "/auth/session" && req.path !== "/auth/logout")
          return res.status(403).json({ error: { message: "Bu hesabın erişimi yönetici tarafından kısıtlandı." } });
      }
      if (req.user && !req.user.email_verified_at && parse(req.user.metadata)?.email_verification_required) {
        const verificationPaths = new Set([
          "/auth/session", "/auth/logout", "/auth/login", "/auth/register",
          "/auth/verify-email", "/auth/resend-verification",
        ]);
        if (!verificationPaths.has(req.path)) {
          await pool.execute("DELETE FROM sessions WHERE token_hash=?", [hash(token)]);
          res.clearCookie("lenk_session", { path: "/" });
          req.user = null;
          if (req.path !== "/auth/session")
            return res.status(403).json({ error: { message: "Hesabınıza erişmek için e-posta adresinizi doğrulayın." } });
        } else if (["/auth/session", "/auth/logout", "/auth/login", "/auth/register"].includes(req.path)) {
          await pool.execute("DELETE FROM sessions WHERE token_hash=?", [hash(token)]);
          res.clearCookie("lenk_session", { path: "/" });
          req.user = null;
        }
      }
    }
    next();
  } catch (e) {
    next(e);
  }
});
app.use("/api", accountRoutes);
app.get("/api/analytics", auth, async (req, res) => {
  const range = String(req.query.range || "7d");
  const ranges = {
    "12h": { amount: 12, unit: "hour", format: "%Y-%m-%d %H:00:00" },
    "24h": { amount: 24, unit: "hour", format: "%Y-%m-%d %H:00:00" },
    "7d": { amount: 7, unit: "day", format: "%Y-%m-%d 00:00:00" },
    "30d": { amount: 30, unit: "day", format: "%Y-%m-%d 00:00:00" },
  };
  const selected = ranges[range];
  if (!selected) throw fail(400, "Geçersiz analitik tarih aralığı.");
  const start = new Date(Date.now() - selected.amount * (selected.unit === "hour" ? 3600000 : 86400000))
    .toISOString().slice(0, 23).replace("T", " ");
  const userId = req.user.id;
  const [totalsRows, seriesRows, sourceRows, deviceRows, countryRows, itemRows, itemSeriesRows] = await Promise.all([
    pool.execute(
      "SELECT COUNT(*) AS events, COALESCE(SUM(type='link'),0) AS clicks, COALESCE(SUM(type='bio'),0) AS views FROM traffic_logs WHERE user_id=? AND created_at>=?",
      [userId, start],
    ),
    pool.execute(
      `SELECT DATE_FORMAT(created_at, ?) AS bucket,COUNT(*) AS events,COALESCE(SUM(type='link'),0) AS clicks,COALESCE(SUM(type='bio'),0) AS views FROM traffic_logs WHERE user_id=? AND created_at>=? GROUP BY bucket ORDER BY bucket`,
      [selected.format, userId, start],
    ),
    pool.execute(
      "SELECT type,link_id,bio_page_id,referrer,browser,COUNT(*) AS events FROM traffic_logs WHERE user_id=? AND created_at>=? GROUP BY type,link_id,bio_page_id,referrer,browser",
      [userId, start],
    ),
    pool.execute(
      "SELECT CASE WHEN browser='' THEN 'other' WHEN browser REGEXP 'iPad|Tablet|Kindle|Silk|PlayBook' OR (browser LIKE '%Android%' AND browser NOT LIKE '%Mobile%') THEN 'tablet' WHEN browser REGEXP 'Mobi|iPhone|iPod|Android' THEN 'mobile' ELSE 'desktop' END AS device_kind,COUNT(*) AS events FROM traffic_logs WHERE user_id=? AND created_at>=? GROUP BY 1",
      [userId, start],
    ),
    pool.execute(
      "SELECT type,link_id,bio_page_id,country,COUNT(*) AS events FROM traffic_logs WHERE user_id=? AND created_at>=? GROUP BY type,link_id,bio_page_id,country",
      [userId, start],
    ),
    pool.execute(
      `SELECT 'link' AS type,l.id,COALESCE(l.title,l.short_slug) AS name,l.short_slug AS slug,l.original_url AS destination,COALESCE(t.events,0) AS events,l.is_archived,l.settings,NULL AS is_published FROM links l LEFT JOIN (SELECT link_id,COUNT(*) AS events FROM traffic_logs WHERE user_id=? AND created_at>=? AND type='link' GROUP BY link_id) t ON t.link_id=l.id WHERE l.user_id=? UNION ALL SELECT 'bio' AS type,b.id,COALESCE(b.profile_title,b.slug) AS name,b.slug,NULL AS destination,COALESCE(t.events,0) AS events,NULL AS is_archived,NULL AS settings,b.is_published FROM bio_pages b LEFT JOIN (SELECT bio_page_id,COUNT(*) AS events FROM traffic_logs WHERE user_id=? AND created_at>=? AND type='bio' GROUP BY bio_page_id) t ON t.bio_page_id=b.id WHERE b.user_id=? ORDER BY events DESC,name`,
      [userId, start, userId, userId, start, userId],
    ),
    pool.execute(
      `SELECT link_id,DATE_FORMAT(created_at, ?) AS bucket,COUNT(*) AS events FROM traffic_logs WHERE user_id=? AND created_at>=? AND type='link' GROUP BY link_id,bucket`,
      [selected.format, userId, start],
    ),
  ]);
  const totals = totalsRows[0][0];
  const eventCount = Number(totals.events);
  const sourceMap = new Map();
  const itemSourceMaps = new Map();
  for (const row of sourceRows[0]) {
    const source = classifySource(row.referrer, row.browser);
    const amount = Number(row.events);
    const key = `${source.type}:${source.name}`;
    const aggregate = sourceMap.get(key) || { ...source, traffic: 0 };
    aggregate.traffic += amount;
    sourceMap.set(key, aggregate);
    const itemKey = row.type === "link" ? `link:${row.link_id}` : `bio:${row.bio_page_id}`;
    if (row.link_id || row.bio_page_id) {
      if (!itemSourceMaps.has(itemKey)) itemSourceMaps.set(itemKey, new Map());
      const itemSources = itemSourceMaps.get(itemKey);
      const itemSource = itemSources.get(key) || { ...source, traffic: 0 };
      itemSource.traffic += amount;
      itemSources.set(key, itemSource);
    }
  }
  const countriesByItem = new Map();
  const seriesByItem = new Map();
  for (const row of itemSeriesRows[0]) {
    if (!seriesByItem.has(row.link_id)) seriesByItem.set(row.link_id, []);
    seriesByItem.get(row.link_id).push({ bucket: row.bucket, events: Number(row.events) });
  }
  const allCountries = new Map();
  for (const row of countryRows[0]) {
    const code = String(row.country || "").trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) continue;
    const amount = Number(row.events);
    allCountries.set(code, (allCountries.get(code) || 0) + amount);
    const itemKey = row.type === "link" ? `link:${row.link_id}` : `bio:${row.bio_page_id}`;
    if (row.link_id || row.bio_page_id) {
      if (!countriesByItem.has(itemKey)) countriesByItem.set(itemKey, new Map());
      const itemCountries = countriesByItem.get(itemKey);
      itemCountries.set(code, (itemCountries.get(code) || 0) + amount);
    }
  }
  const formatSources = (map, denominator) => [...map.values()]
    .map((source) => ({ ...source, percent: denominator ? Math.round(source.traffic / denominator * 100) : 0 }))
    .sort((a, b) => b.traffic - a.traffic || a.name.localeCompare(b.name));
  const formatCountries = (map, denominator) => [...map].map(([code, count]) => ({
    code, count, percent: denominator ? Math.round(count / denominator * 100) : 0,
  })).sort((a, b) => b.count - a.count);
  const devices = deviceRows[0].map((row) => ({ device: row.device_kind || "other", count: Number(row.events) }));
  res.json({ data: {
    range, start_at: `${start.replace(" ", "T")}Z`, totals: {
      events: eventCount, clicks: Number(totals.clicks), views: Number(totals.views),
    },
    series: seriesRows[0].map((row) => ({ ...row, events: Number(row.events), clicks: Number(row.clicks), views: Number(row.views) })),
    sources: formatSources(sourceMap, eventCount),
    countries: formatCountries(allCountries, eventCount),
    devices,
    items: itemRows[0].map((row) => {
      const itemKey = `${row.type}:${row.id}`;
      const count = Number(row.events);
      const itemSettings = row.type === "link" ? parse(row.settings || "{}") : {};
      const startsAt = Date.parse(itemSettings.schedule?.startsAt || "");
      const expiresAt = Date.parse(itemSettings.schedule?.expiresAt || "");
      return {
        type: row.type, id: row.id, name: row.name, slug: row.slug, destination: row.destination, val: count,
        status: row.type === "link" ? (row.is_archived ? "archived" : Number.isFinite(startsAt) && startsAt > Date.now() ? "scheduled" : Number.isFinite(expiresAt) && expiresAt <= Date.now() ? "expired" : "active") : (row.is_published ? "published" : "draft"),
        sources: formatSources(itemSourceMaps.get(itemKey) || new Map(), count),
        countries: formatCountries(countriesByItem.get(itemKey) || new Map(), count),
        series: row.type === "link" ? seriesByItem.get(row.id) || [] : [],
      };
    }),
  } });
});
app.get("/api/admin/session", admin, (req, res) => {
  res.json({ data: { user: { id: req.user.id, email: req.user.email } } });
});
app.get("/api/admin/overview", admin, async (req, res) => {
  const [[stats]] = await pool.query(
    "SELECT (SELECT COUNT(*) FROM users) AS users,(SELECT COUNT(*) FROM links) AS links,(SELECT COUNT(*) FROM bio_pages) AS bio_pages,(SELECT COALESCE(SUM(clicks),0) FROM links) AS clicks,(SELECT COALESCE(SUM(views),0) FROM bio_pages) AS views",
  );
  res.json({ data: Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, Number(value)])) });
});
app.get("/api/admin/users", admin, async (req, res) => {
  const page = Math.max(1, Math.min(100000, Number(req.query.page) || 1));
  const pageSize = Math.max(1, Math.min(50, Number(req.query.pageSize) || 20));
  const search = String(req.query.search || "").trim().slice(0, 120);
  const where = search ? "WHERE u.email LIKE ? OR p.full_name LIKE ?" : "";
  const term = `%${search.replace(/[\\%_]/g, "\\$&")}%`;
  const filters = search ? [term, term] : [];
  const [[counts], [users]] = await Promise.all([
    pool.execute(
      `SELECT COUNT(*) AS total FROM users u LEFT JOIN profiles p ON p.id=u.id ${where}`,
      filters,
    ),
    pool.execute(
      `SELECT u.id,u.email,p.full_name,u.created_at,u.access_disabled,(SELECT COUNT(*) FROM links l WHERE l.user_id=u.id) AS links_count,(SELECT COUNT(*) FROM bio_pages b WHERE b.user_id=u.id) AS bio_pages_count FROM users u LEFT JOIN profiles p ON p.id=u.id ${where} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
      [...filters, pageSize, (page - 1) * pageSize],
    ),
  ]);
  res.json({
    data: {
      users: users.map((user) => ({ ...user, links_count: Number(user.links_count), bio_pages_count: Number(user.bio_pages_count) })),
      total: Number(counts[0].total),
      page,
      pageSize,
    },
  });
});
app.get("/api/admin/users/:id", admin, async (req, res) => {
  if (!/^[a-f0-9-]{36}$/i.test(req.params.id))
    throw fail(400, "Geçersiz kullanıcı kimliği.");
  const [users] = await pool.execute(
    "SELECT u.id,u.email,p.full_name,p.avatar_url,u.created_at,u.access_disabled,u.access_disabled_reason,u.access_disabled_at FROM users u LEFT JOIN profiles p ON p.id=u.id WHERE u.id=? LIMIT 1",
    [req.params.id],
  );
  if (!users[0]) throw fail(404, "Kullanıcı bulunamadı.");
  const [[links], [bioPages]] = await Promise.all([
    pool.execute("SELECT id,title,short_slug,original_url,clicks,is_archived,created_at FROM links WHERE user_id=? ORDER BY created_at DESC LIMIT 200", [req.params.id]),
    pool.execute("SELECT id,slug,profile_title,profile_bio,is_published,views,created_at FROM bio_pages WHERE user_id=? ORDER BY created_at DESC LIMIT 100", [req.params.id]),
  ]);
  res.json({ data: { user: { ...users[0], is_admin: isAdminEmail(users[0].email) }, links, bio_pages: bioPages } });
});
app.patch("/api/admin/users/:id/access", admin, async (req, res) => {
  if (!/^[a-f0-9-]{36}$/i.test(req.params.id))
    throw fail(400, "Geçersiz kullanıcı kimliği.");
  if (req.params.id === req.user.id)
    throw fail(400, "Kendi hesabınızın erişimini buradan değiştiremezsiniz.");
  const [target] = await pool.execute("SELECT email FROM users WHERE id=? LIMIT 1", [req.params.id]);
  if (target[0] && isAdminEmail(target[0].email))
    throw fail(403, "Yönetici hesabının erişimi bu panelden değiştirilemez.");
  if (typeof req.body?.disabled !== "boolean")
    throw fail(400, "Erişim durumu geçersiz.");
  const reason = String(req.body.reason || "").trim().slice(0, 500) || null;
  const [result] = await pool.execute(
    "UPDATE users SET access_disabled=?,access_disabled_reason=?,access_disabled_at=IF(?,UTC_TIMESTAMP(3),NULL) WHERE id=?",
    [req.body.disabled, req.body.disabled ? reason : null, req.body.disabled, req.params.id],
  );
  if (!result.affectedRows) throw fail(404, "Kullanıcı bulunamadı.");
  if (req.body.disabled)
    await pool.execute("DELETE FROM sessions WHERE user_id=?", [req.params.id]);
  res.json({ data: { id: req.params.id, access_disabled: req.body.disabled } });
});
app.patch("/api/admin/users/:id/profile", admin, async (req, res) => {
  const { id } = req.params;
  if (!/^[a-f0-9-]{36}$/i.test(id)) throw fail(400, "Geçersiz kullanıcı kimliği.");
  const fullName = String(req.body?.full_name ?? "").trim();
  const avatarUrl = String(req.body?.avatar_url ?? "").trim();
  if (fullName.length > 200 || avatarUrl.length > 2000)
    throw fail(400, "Profil alanları izin verilen uzunluğu aşıyor.");
  if (avatarUrl) {
    try {
      const url = new URL(avatarUrl, "https://lenk.tr");
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch { throw fail(400, "Geçerli bir profil görseli adresi girin."); }
  }
  const result = await transaction(async (connection) => {
    const [rows] = await connection.execute("SELECT metadata FROM users WHERE id=? FOR UPDATE", [id]);
    if (!rows[0]) throw fail(404, "Kullanıcı bulunamadı.");
    const metadata = { ...parse(rows[0].metadata), full_name: fullName, avatar_url: avatarUrl };
    await connection.execute("UPDATE users SET metadata=? WHERE id=?", [JSON.stringify(metadata), id]);
    await connection.execute("UPDATE profiles SET full_name=?,avatar_url=?,updated_at=UTC_TIMESTAMP() WHERE id=?", [fullName, avatarUrl || null, id]);
    return { full_name: fullName, avatar_url: avatarUrl || null };
  });
  res.json({ data: result });
});
app.patch("/api/admin/users/:id/links/:linkId", admin, async (req, res) => {
  const { id, linkId } = req.params;
  if (![id, linkId].every((value) => /^[a-f0-9-]{36}$/i.test(value))) throw fail(400, "Geçersiz kayıt kimliği.");
  const values = req.body || {};
  const title = String(values.title ?? "").trim().slice(0, 500);
  const originalUrl = String(values.original_url ?? "").trim();
  const slug = values.short_slug;
  urlCheck(originalUrl);
  if (typeof slug !== "string") throw fail(400, "Kısa adres gerekli.");
  slugCheck(slug);
  const archived = values.is_archived === true;
  await transaction(async (connection) => {
    const [rows] = await connection.execute("SELECT id FROM links WHERE id=? AND user_id=? FOR UPDATE", [linkId, id]);
    if (!rows[0]) throw fail(404, "Kısa bağlantı bulunamadı.");
    await connection.execute("UPDATE slugs SET slug=? WHERE resource_id=?", [slug, linkId]);
    await connection.execute("UPDATE links SET title=?,original_url=?,short_slug=?,is_archived=? WHERE id=? AND user_id=?", [title || null, originalUrl, slug, archived, linkId, id]);
  });
  res.json({ data: { id: linkId } });
});
app.patch("/api/admin/users/:id/bio-pages/:bioId", admin, async (req, res) => {
  const { id, bioId } = req.params;
  if (![id, bioId].every((value) => /^[a-f0-9-]{36}$/i.test(value))) throw fail(400, "Geçersiz kayıt kimliği.");
  const values = req.body || {};
  const title = String(values.profile_title ?? "").trim().slice(0, 500);
  const bio = String(values.profile_bio ?? "").trim().slice(0, 5000);
  if (typeof values.slug !== "string") throw fail(400, "Bio sayfa adresi gerekli.");
  slugCheck(values.slug);
  await transaction(async (connection) => {
    const [rows] = await connection.execute("SELECT id FROM bio_pages WHERE id=? AND user_id=? FOR UPDATE", [bioId, id]);
    if (!rows[0]) throw fail(404, "Bio sayfası bulunamadı.");
    await connection.execute("UPDATE slugs SET slug=? WHERE resource_id=?", [values.slug, bioId]);
    await connection.execute("UPDATE bio_pages SET profile_title=?,profile_bio=?,slug=?,is_published=? WHERE id=? AND user_id=?", [title || null, bio || null, values.slug, values.is_published === true, bioId, id]);
  });
  res.json({ data: { id: bioId } });
});
app.delete("/api/admin/users/:id/links/:linkId", admin, async (req, res) => {
  const { id, linkId } = req.params;
  if (![id, linkId].every((value) => /^[a-f0-9-]{36}$/i.test(value))) throw fail(400, "Geçersiz kayıt kimliği.");
  await transaction(async (connection) => {
    const [rows] = await connection.execute("SELECT id FROM links WHERE id=? AND user_id=? FOR UPDATE", [linkId, id]);
    if (!rows[0]) throw fail(404, "Kısa bağlantı bulunamadı.");
    await connection.execute("DELETE FROM slugs WHERE resource_id=?", [linkId]);
    await connection.execute("DELETE FROM links WHERE id=? AND user_id=?", [linkId, id]);
  });
  res.json({ data: { id: linkId } });
});
app.delete("/api/admin/users/:id/bio-pages/:bioId", admin, async (req, res) => {
  const { id, bioId } = req.params;
  if (![id, bioId].every((value) => /^[a-f0-9-]{36}$/i.test(value))) throw fail(400, "Geçersiz kayıt kimliği.");
  await transaction(async (connection) => {
    const [rows] = await connection.execute("SELECT id FROM bio_pages WHERE id=? AND user_id=? FOR UPDATE", [bioId, id]);
    if (!rows[0]) throw fail(404, "Bio sayfası bulunamadı.");
    await connection.execute("DELETE FROM slugs WHERE resource_id=?", [bioId]);
    await connection.execute("DELETE FROM bio_pages WHERE id=? AND user_id=?", [bioId, id]);
  });
  res.json({ data: { id: bioId } });
});
app.delete("/api/admin/users/:id", admin, async (req, res) => {
  const { id } = req.params;
  if (!/^[a-f0-9-]{36}$/i.test(id)) throw fail(400, "Geçersiz kullanıcı kimliği.");
  if (id === req.user.id) throw fail(400, "Kendi yönetici hesabınızı buradan silemezsiniz.");
  await transaction(async (connection) => {
    const [rows] = await connection.execute("SELECT id,email FROM users WHERE id=? FOR UPDATE", [id]);
    if (!rows[0]) throw fail(404, "Kullanıcı bulunamadı.");
    if (isAdminEmail(rows[0].email)) throw fail(403, "Yönetici hesabı kullanıcı panelinden silinemez.");
    await connection.execute("DELETE s FROM slugs s JOIN links l ON l.id=s.resource_id WHERE l.user_id=?", [id]);
    await connection.execute("DELETE s FROM slugs s JOIN bio_pages b ON b.id=s.resource_id WHERE b.user_id=?", [id]);
    await connection.execute("DELETE FROM users WHERE id=?", [id]);
  });
  res.json({ data: { id, deleted: true } });
});
app.post(
  "/api/admin/notifications",
  admin,
  rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false }),
  async (req, res) => {
    const type = req.body?.type;
    const content = String(req.body?.content || "").trim();
    if (!["system", "alert"].includes(type)) throw fail(400, "Bildirim türü geçersiz.");
    if (!content || content.length > 1000) throw fail(400, "Bildirim metni 1–1000 karakter arasında olmalı.");
    let result;
    if (req.body?.audience === "all") {
      [result] = await pool.execute(
        "INSERT INTO notifications(id,user_id,type,content) SELECT UUID(),id,?,? FROM users WHERE access_disabled=0",
        [type, content],
      );
    } else if (req.body?.audience === "user" && /^[a-f0-9-]{36}$/i.test(String(req.body.user_id || ""))) {
      [result] = await pool.execute(
        "INSERT INTO notifications(id,user_id,type,content) SELECT UUID(),id,?,? FROM users WHERE id=? AND access_disabled=0",
        [type, content, req.body.user_id],
      );
      if (!result.affectedRows) throw fail(404, "Aktif kullanıcı bulunamadı.");
    } else {
      throw fail(400, "Bildirim alıcısı geçersiz.");
    }
    res.status(201).json({ data: { sent: Number(result.affectedRows), type } });
  },
);
const columns = {
  notifications: ["id", "user_id", "type", "content", "is_read", "created_at"],
  links: [
    "id",
    "user_id",
    "original_url",
    "short_slug",
    "title",
    "settings",
    "password_hash",
    "clicks",
    "is_archived",
    "created_at",
  ],
  bio_pages: [
    "id",
    "user_id",
    "slug",
    "profile_title",
    "profile_bio",
    "theme_settings",
    "is_published",
    "views",
    "created_at",
  ],
  profiles: ["id", "full_name", "avatar_url", "role", "updated_at"],
  traffic_logs: [
    "id",
    "user_id",
    "link_id",
    "bio_page_id",
    "type",
    "referrer",
    "country",
    "device",
    "browser",
    "created_at",
  ],
};
const writable = {
  notifications: ["is_read"],
  links: ["original_url", "short_slug", "title", "is_archived", "settings"],
  bio_pages: [
    "slug",
    "profile_title",
    "profile_bio",
    "theme_settings",
    "is_published",
  ],
  profiles: ["full_name", "avatar_url"],
};
app.post("/api/query", auth, async (req, res) => {
  const {
    table,
    operation = "select",
    filters = [],
    order,
    limit,
    single,
    values,
    selection = "*",
  } = req.body;
  if (
    !Object.hasOwn(columns, table) ||
    !["select", "insert", "update", "delete"].includes(operation) ||
    !Array.isArray(filters) ||
    filters.length > 10
  )
    throw fail(400, "Geçersiz sorgu.");
  const where = [`${table === "profiles" ? "id" : "user_id"}=?`];
  const params = [req.user.id];
  for (const f of filters) {
    if (
      !columns[table].includes(f.column) ||
      f.value === undefined ||
      f.value === null ||
      typeof f.value === "object"
    )
      throw fail(400, "Geçersiz filtre.");
    where.push(`\`${f.column}\`=?`);
    params.push(f.value);
  }
  const clause = where.join(" AND ");
  if (operation === "select") {
    const fields =
      selection === "*"
        ? columns[table]
        : String(selection)
            .split(",")
            .map((x) => x.trim());
    if (fields.some((x) => !columns[table].includes(x)))
      throw fail(400, "Geçersiz alan.");
    if (order && !columns[table].includes(order.column))
      throw fail(400, "Geçersiz sıralama.");
    const [rows] = await pool.execute(
      `SELECT ${fields.map((x) => "`" + x + "`").join(",")} FROM \`${table}\` WHERE ${clause}${order ? ` ORDER BY \`${order.column}\` ${order.ascending ? "ASC" : "DESC"}` : ""} LIMIT ${Math.max(1, Math.min(Number(limit) || 10000, 10000))}`,
      params,
    );
    if (single && rows.length !== 1) throw fail(404, "Kayıt bulunamadı.");
    return res.json({
      data: single ? normalize(rows[0]) : rows.map(normalize),
    });
  }
  if (
    !writable[table] ||
    (["profiles", "notifications"].includes(table) && operation !== "update")
  )
    throw fail(403, "Bu işlem desteklenmiyor.");
  if (operation !== "insert" && !filters.some((f) => f.column === "id"))
    throw fail(400, "Kayıt kimliği gerekiyor.");
  const source = Array.isArray(values) ? values[0] : values || {};
  if (Array.isArray(values) && values.length !== 1)
    throw fail(400, "Tek kayıt gönderin.");
  const record = {};
  for (const key of writable[table])
    if (source[key] !== undefined) record[key] = source[key];
  const password = source.password === undefined ? undefined : String(source.password);
  const removePassword = source.remove_password === true;
  if (table === "links" && password !== undefined && password.length > 0 && (password.length < 6 || password.length > 200))
    throw fail(400, "Link parolası 6 ile 200 karakter arasında olmalı.");
  if (record.original_url !== undefined) urlCheck(record.original_url);
  const slugKey = table === "links" ? "short_slug" : "slug";
  if (record[slugKey] !== undefined) slugCheck(record[slugKey]);
  for (const key of ["is_archived", "is_published", "is_read"])
    if (key in record && typeof record[key] !== "boolean")
      throw fail(400, "Geçersiz durum.");
  for (const key of ["title", "profile_title", "full_name"])
    if (
      key in record &&
      (typeof record[key] !== "string" || record[key].length > 500)
    )
      throw fail(400, "Başlık çok uzun.");
  if ("theme_settings" in record) {
    if (
      !record.theme_settings ||
      typeof record.theme_settings !== "object" ||
      Array.isArray(record.theme_settings)
    )
      throw fail(400, "Geçersiz tema.");
    record.theme_settings = JSON.stringify(record.theme_settings);
  }
  if ("settings" in record) record.settings = JSON.stringify(validateLinkSettings(record.settings));
  const connection = await pool.getConnection();
  let id;
  try {
    await connection.beginTransaction();
    if (operation === "insert") {
      id = randomUUID();
      if (!record[slugKey] || (table === "links" && !record.original_url))
        throw fail(400, "Gerekli alanları doldurun.");
      if (table === "links" && password) record.password_hash = await bcrypt.hash(password, 10);
      await connection.execute(
        "INSERT INTO slugs(slug,resource_id,kind) VALUES(?,?,?)",
        [record[slugKey], id, table === "links" ? "link" : "bio"],
      );
      Object.assign(record, { id, user_id: req.user.id });
      if (table === "bio_pages" && !record.theme_settings)
        record.theme_settings = "{}";
      const keys = Object.keys(record);
      await connection.execute(
        `INSERT INTO \`${table}\` (${keys.map((x) => "`" + x + "`").join(",")}) VALUES(${keys.map(() => "?").join(",")})`,
        Object.values(record),
      );
    } else {
      const [rows] = await connection.execute(
        `SELECT id FROM \`${table}\` WHERE ${clause} FOR UPDATE`,
        params,
      );
      if (!rows.length) throw fail(404, "Kayıt bulunamadı.");
      id = rows[0].id;
      if (operation === "delete") {
        await connection.execute(
          `DELETE FROM \`${table}\` WHERE ${clause}`,
          params,
        );
        await connection.execute("DELETE FROM slugs WHERE resource_id=?", [id]);
      } else {
        if (table === "links" && password !== undefined && password.length > 0)
          await connection.execute("UPDATE links SET password_hash=? WHERE id=?", [await bcrypt.hash(password, 10), id]);
        else if (table === "links" && removePassword)
          await connection.execute("UPDATE links SET password_hash=NULL WHERE id=?", [id]);
        const keys = Object.keys(record);
        if (!keys.length) throw fail(400, "Güncellenecek alan yok.");
        if (record[slugKey])
          await connection.execute(
            "UPDATE slugs SET slug=? WHERE resource_id=?",
            [record[slugKey], id],
          );
        await connection.execute(
          `UPDATE \`${table}\` SET ${keys.map((x) => "`" + x + "`=?").join(",")} WHERE ${clause}`,
          [...Object.values(record), ...params],
        );
      }
    }
    await connection.commit();
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
  const [rows] =
    operation === "delete"
      ? [[]]
      : await pool.execute(`SELECT * FROM \`${table}\` WHERE id=?`, [id]);
  res.json({ data: single ? normalize(rows[0]) : rows.map(normalize) });
});
app.post("/api/resolve/:slug", async (req, res) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [refs] = await connection.execute(
      "SELECT * FROM slugs WHERE slug=? FOR UPDATE",
      [req.params.slug],
    );
    const ref = refs[0];
    if (!ref) throw fail(404, "Adres bulunamadı.");
    const table = ref.kind === "link" ? "links" : "bio_pages",
      counter = ref.kind === "link" ? "clicks" : "views";
    const [rows] = await connection.execute(
      `SELECT resource.* FROM ${table} resource JOIN users owner ON owner.id=resource.user_id WHERE resource.id=? AND ${ref.kind === "link" ? "resource.is_archived=0" : "resource.is_published=1"} AND owner.access_disabled=0 FOR UPDATE`,
      [ref.resource_id],
    );
    const row = rows[0];
    if (!row) throw fail(404, "Adres bulunamadı.");
    const settings = ref.kind === "link" ? parse(row.settings || "{}") : {};
    if (ref.kind === "link") {
      linkAvailable(settings);
      if (row.password_hash && !(await bcrypt.compare(String(body.password || ""), row.password_hash))) {
        await connection.rollback();
        return res.status(401).json({ error: { message: "Bu bağlantı parola korumalı." }, password_required: true });
      }
    }
    const agent = req.get("user-agent") || "";
    const trackedByServer = req.cookies.lenk_bot_visit === req.params.slug && ["bot", "ai"].includes(classifySource("", agent).type);
    if (trackedByServer) res.clearCookie("lenk_bot_visit", { path: "/" });
    else {
      await connection.execute(
        `UPDATE ${table} SET ${counter}=${counter}+1 WHERE id=?`,
        [row.id],
      );
      await connection.execute(
        "INSERT INTO traffic_logs(id,user_id,link_id,bio_page_id,type,referrer,country,device,browser) VALUES(?,?,?,?,?,?,?,?,?)",
        [
          randomUUID(), row.user_id,
          ref.kind === "link" ? row.id : null,
          ref.kind === "bio" ? row.id : null,
          ref.kind,
          String(body.referrer || "direct").slice(0, 2000),
          countryFromRequest(req), deviceFromAgent(agent), agent.slice(0, 200),
        ],
      );
    }
    await connection.commit();
    const data = normalize(row);
    delete data.user_id;
    if (ref.kind === "link") {
      data.has_password = Boolean(row.password_hash);
      res.json({ data: { type: ref.kind, page: data, redirect_url: redirectUrl(row.original_url, settings, req) } });
      return;
    }
    res.json({ data: { type: ref.kind, page: data } });
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
});
await mkdir(uploadRoot, { recursive: true });
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});
app.post("/api/uploads", auth, upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) throw fail(400, "Görsel seçin.");
  const b = file.buffer;
  let ext;
  if (b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    ext = "png";
  else if (b[0] === 255 && b[1] === 216 && b[2] === 255) ext = "jpg";
  else if (
    b.subarray(0, 4).toString() === "RIFF" &&
    b.subarray(8, 12).toString() === "WEBP"
  )
    ext = "webp";
  else if (["GIF87a", "GIF89a"].includes(b.subarray(0, 6).toString()))
    ext = "gif";
  else throw fail(400, "PNG, JPEG, WebP veya GIF yükleyin.");
  const dir = path.join(uploadRoot, req.user.id);
  await mkdir(dir, { recursive: true });
  const name = randomUUID() + "." + ext;
  const { writeFile } = await import("node:fs/promises");
  await writeFile(path.join(dir, name), b);
  res.json({ data: { url: `/uploads/${req.user.id}/${name}` } });
});
app.delete("/api/uploads", auth, async (req, res) => {
  const url = String(req.body.url || "");
  if (
    !new RegExp(
      `^/uploads/${req.user.id}/[a-f0-9-]+\\.(png|jpg|webp|gif)$`,
    ).test(url)
  )
    throw fail(403, "Bu dosyayı silemezsiniz.");
  await unlink(path.join(uploadRoot, req.user.id, path.basename(url))).catch(
    (e) => {
      if (e.code !== "ENOENT") throw e;
    },
  );
  res.json({ data: { success: true } });
});
app.use(
  "/uploads",
  express.static(uploadRoot, { maxAge: "30d", dotfiles: "deny" }),
);
app.get("/api/health", async (req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok", database: "mariadb" });
});
app.use("/api", (req, res) =>
  res.status(404).json({ error: { message: "API bulunamadı." } }),
);
app.use(express.static(path.join(root, "dist")));
const htmlEscape = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const previewChannel = (visitor) => visitor.name.includes("Meta") ? "facebook" : visitor.name.includes("X preview") ? "twitter" : visitor.name.includes("Pinterest") ? "pinterest" : visitor.name.includes("LinkedIn") ? "linkedin" : visitor.name.includes("Slack") ? "slack" : visitor.name.includes("Telegram") ? "telegram" : visitor.name.includes("WhatsApp") ? "whatsapp" : "default";
app.get("/:slug", async (req, res, next) => {
  const agent = req.get("user-agent") || "";
  const visitor = classifySource(req.get("referer"), agent);
  if (visitor.type !== "bot" && visitor.type !== "ai") return next();
  const hit = await transaction(async (connection) => {
    const [refs] = await connection.execute(
      "SELECT * FROM slugs WHERE slug=? FOR UPDATE",
      [req.params.slug],
    );
    const ref = refs[0];
    if (!ref) return null;
    const table = ref.kind === "link" ? "links" : "bio_pages";
    const counter = ref.kind === "link" ? "clicks" : "views";
    const [rows] = await connection.execute(
      `SELECT resource.* FROM ${table} resource JOIN users owner ON owner.id=resource.user_id WHERE resource.id=? AND ${ref.kind === "link" ? "resource.is_archived=0" : "resource.is_published=1"} AND owner.access_disabled=0 FOR UPDATE`,
      [ref.resource_id],
    );
    const row = rows[0];
    if (!row) return null;
    if (ref.kind === "link") linkAvailable(parse(row.settings || "{}"));
    await connection.execute(`UPDATE ${table} SET ${counter}=${counter}+1 WHERE id=?`, [row.id]);
    await connection.execute(
      "INSERT INTO traffic_logs(id,user_id,link_id,bio_page_id,type,referrer,country,device,browser) VALUES(?,?,?,?,?,?,?,?,?)",
      [
        randomUUID(), row.user_id,
        ref.kind === "link" ? row.id : null,
        ref.kind === "bio" ? row.id : null,
        ref.kind,
        String(req.get("referer") || "direct").slice(0, 2000),
        countryFromRequest(req), deviceFromAgent(agent), agent.slice(0, 200),
      ],
    );
      return { kind: ref.kind, page: normalize(row), isProtected: Boolean(row.password_hash) };
  });
  if (!hit) return next();
  if (hit.kind === "link") {
    if (hit.isProtected) return res.sendFile(path.join(root, "dist/index.html"), { dotfiles: "allow" });
    const settings = parse(hit.page.settings || "{}");
    const socialCrawler = /Meta preview|X preview|Pinterest preview|LinkedIn preview|Discord preview|Slack preview|Telegram preview|WhatsApp preview/.test(visitor.name);
    if (!socialCrawler) return res.redirect(302, redirectUrl(hit.page.original_url, settings, req));
    const preview = settings.socialPreview?.[previewChannel(visitor)] || settings.socialPreview?.default || {};
    const title = htmlEscape(preview.title || hit.page.title || hit.page.short_slug);
    const description = htmlEscape(preview.description || "Kısa bağlantı ile paylaşıldı.");
    const image = preview.image ? `<meta property="og:image" content="${htmlEscape(preview.image)}"><meta name="twitter:image" content="${htmlEscape(preview.image)}">` : "";
    return res.type("html").send(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><meta name="description" content="${description}"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="https://lenk.tr/${htmlEscape(hit.page.short_slug)}"><meta name="twitter:card" content="${preview.image ? "summary_large_image" : "summary"}"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}">${image}</head><body><a href="${htmlEscape(hit.page.original_url)}">${title}</a></body></html>`);
  }
  res.cookie("lenk_bot_visit", req.params.slug, {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 60000, path: "/",
  });
  return res.sendFile(path.join(root, "dist/index.html"), { dotfiles: "allow" });
});
app.get("/{*path}", (req, res) =>
  res.sendFile(path.join(root, "dist/index.html"), { dotfiles: "allow" }),
);
app.use((err, req, res, _next) => {
  if (err.code === "ER_DUP_ENTRY")
    return res
      .status(409)
      .json({
        error: { message: "E-posta veya kısa adres zaten kullanılıyor." },
      });
  const status = err.status || (err.code === "LIMIT_FILE_SIZE" ? 413 : 500);
  if (status >= 500) console.error(err.message);
  res
    .status(status)
    .json({
      error: {
        message: status >= 500 ? "Sunucu işlemi tamamlayamadı." : err.message,
      },
    });
});
export async function initialize() {
  const sql = await readFile(path.join(root, "server/schema.sql"), "utf8");
  for (const statement of sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean))
    await pool.query(statement);
  await pool.query(
    "UPDATE users SET email_verified_at=created_at WHERE email_verified_at IS NULL AND JSON_UNQUOTE(JSON_EXTRACT(metadata,'$.email_verified'))='true'",
  );
}
if (process.env.LENK_TEST !== "1") {
  await initialize();
  const stopMail = startMailWorker();
  const server = app.listen(Number(process.env.PORT || 80), "0.0.0.0", () =>
    console.log("LENK server ready"),
  );
  process.once("SIGTERM", () => {
    stopMail();
    server.close(() => pool.end().then(() => process.exit(0)));
  });
}
