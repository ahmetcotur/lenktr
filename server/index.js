import express from "express";
import accountRoutes from "./account.js";
import { hash, fail, parse, auth } from "./security.js";
import { pool } from "./db.js";
import { startMailWorker } from "./mail.js";
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
function normalize(row) {
  const r = { ...row };
  if (r.theme_settings) r.theme_settings = parse(r.theme_settings);
  for (const key of ["is_archived", "is_published", "is_read"])
    if (key in r) r[key] = Boolean(r[key]);
  if (r.created_at) r.created_at = r.created_at.replace(" ", "T") + "Z";
  return r;
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
    }
    next();
  } catch (e) {
    next(e);
  }
});
app.use("/api", accountRoutes);
const columns = {
  notifications: ["id", "user_id", "type", "content", "is_read", "created_at"],
  links: [
    "id",
    "user_id",
    "original_url",
    "short_slug",
    "title",
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
  links: ["original_url", "short_slug", "title", "is_archived"],
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
  const connection = await pool.getConnection();
  let id;
  try {
    await connection.beginTransaction();
    if (operation === "insert") {
      id = randomUUID();
      if (!record[slugKey] || (table === "links" && !record.original_url))
        throw fail(400, "Gerekli alanları doldurun.");
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
      `SELECT * FROM ${table} WHERE id=? AND ${ref.kind === "link" ? "is_archived=0" : "is_published=1"} FOR UPDATE`,
      [ref.resource_id],
    );
    const row = rows[0];
    if (!row) throw fail(404, "Adres bulunamadı.");
    await connection.execute(
      `UPDATE ${table} SET ${counter}=${counter}+1 WHERE id=?`,
      [row.id],
    );
    const agent = req.get("user-agent") || "";
    await connection.execute(
      "INSERT INTO traffic_logs(id,user_id,link_id,bio_page_id,type,referrer,device,browser) VALUES(?,?,?,?,?,?,?,?)",
      [
        randomUUID(),
        row.user_id,
        ref.kind === "link" ? row.id : null,
        ref.kind === "bio" ? row.id : null,
        ref.kind,
        String(req.body.referrer || "direct").slice(0, 2000),
        /Mobi|Android/i.test(agent) ? "mobile" : "desktop",
        agent.slice(0, 200),
      ],
    );
    await connection.commit();
    const data = normalize(row);
    delete data.user_id;
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
