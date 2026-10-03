import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID, randomBytes, createHash } from "node:crypto";
process.env.LENK_TEST = "1";
process.env.MAIL_FROM_ADDRESS = "no-reply@example.com";
process.env.SUPPORT_EMAIL = "support@example.com";
const { deliverMailBatch, renderMail } = await import("../server/mail.js");
const { app, pool, initialize } = await import("../server/index.js");
await initialize();
const server = app.listen(0, "127.0.0.1");
await new Promise((resolve) => server.once("listening", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let cookieA = "",
  cookieB = "";
const ids = [];
async function api(endpoint, body, cookie = "", extraHeaders = {}) {
  const r = await fetch(base + endpoint, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie, ...extraHeaders },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return {
    status: r.status,
    body: await r.json(),
    cookie: r.headers.get("set-cookie")?.split(";")[0],
  };
}
test("MariaDB auth, ownership, public counters, email verification, password recovery and delivery retries", async () => {
  try {
    assert.equal((await api("/api/health")).body.database, "mariadb");
    assert.equal((await api("/api/query", { table: "links" })).status, 401);
    const emailA = `qa-${randomUUID()}@example.com`,
      emailB = `qa-${randomUUID()}@example.com`;
    const a = await api("/api/auth/register", {
      email: emailA,
      password: "TestingStrong123!",
      options: { data: { full_name: "QA User" } },
    });
    assert.equal(a.status, 201);
    assert.equal(a.cookie, undefined);
    ids.push(a.body.data.user.id);
    const b = await api("/api/auth/register", {
      email: emailB,
      password: "TestingStrong123!",
    });
    assert.equal(b.status, 201);
    assert.equal(b.cookie, undefined);
    ids.push(b.body.data.user.id);
    assert.equal(
      (await api("/api/auth/login", { email: emailA, password: "wrong" }))
        .status,
      401,
    );
    assert.equal(
      (await api("/api/auth/login", { email: emailA, password: "TestingStrong123!" })).status,
      403,
    );
    for (const [email, key] of [[emailA, "a"], [emailB, "b"]]) {
      const [verification] = await pool.execute(
        "SELECT text_body FROM mail_outbox WHERE user_id=? AND kind='verification' AND status='pending' ORDER BY created_at DESC LIMIT 1",
        [key === "a" ? ids[0] : ids[1]],
      );
      const verifyToken = verification[0].text_body.match(/#token=([a-f0-9]{64})/)[1];
      assert.equal((await api("/api/auth/verify-email", { token: verifyToken })).status, 200);
      const login = await api("/api/auth/login", { email, password: "TestingStrong123!" });
      assert.equal(login.status, 200);
      if (key === "a") cookieA = login.cookie;
      else cookieB = login.cookie;
    }
    assert.equal(
      (await api("/api/auth/session", undefined, cookieA)).body.data.session
        .user.id,
      ids[0],
    );
    const slug = "qa-" + randomUUID();
    const made = await api(
      "/api/query",
      {
        table: "links",
        operation: "insert",
        single: true,
        values: {
          user_id: ids[1],
          short_slug: slug,
          original_url: "https://example.com",
          title: "QA",
          settings: {
            utm: { source: "qa", campaign: "links" },
            pixels: { meta: "123456789012345" },
            routingRules: [{ country: "TR", url: "https://tr.example/path" }],
            socialPreview: { facebook: { title: "QA social title", description: "Preview from the link" } },
            qr: { size: 512, foreground: "#111827", background: "#ffffff", moduleStyle: "dots", eyeStyle: "rounded" },
          },
        },
      },
      cookieA,
    );
    assert.equal(made.status, 200);
    assert.equal(made.body.data.user_id, ids[0]);
    const link = made.body.data;
    assert.equal(link.settings.utm.source, "qa");
    assert.equal(link.settings.qr.moduleStyle, "dots");
    assert.equal(link.has_password, false);
    assert.equal(
      (
        await api(
          "/api/query",
          { table: "links", filters: [{ column: "id", value: link.id }] },
          cookieB,
        )
      ).body.data.length,
      0,
    );
    assert.equal(
      (
        await api(
          "/api/query",
          {
            table: "links",
            operation: "update",
            filters: [{ column: "id", value: link.id }],
            values: { original_url: "https://hijack.example" },
          },
          cookieB,
        )
      ).status,
      404,
    );
    assert.equal(
      (
        await api(
          "/api/query",
          {
            table: "bio_pages",
            operation: "insert",
            values: { slug, theme_settings: {} },
          },
          cookieB,
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await api(
          "/api/query",
          {
            table: "links",
            operation: "insert",
            values: {
              short_slug: "dashboard",
              original_url: "https://example.com",
            },
          },
          cookieA,
        )
      ).status,
      400,
    );
    const resolved = await api("/api/resolve/" + slug, { referrer: "direct" });
    assert.equal(resolved.body.data.redirect_url, "https://example.com/?utm_source=qa&utm_campaign=links");
    const routed = await api("/api/resolve/" + slug, { referrer: "direct" }, "", { "CF-IPCountry": "TR", "User-Agent": "Mozilla/5.0" });
    assert.equal(routed.body.data.redirect_url, "https://tr.example/path?utm_source=qa&utm_campaign=links");
    assert.equal(
      (
        await api(
          "/api/query",
          {
            table: "links",
            operation: "update",
            filters: [{ column: "id", value: link.id }],
            values: { original_url: "javascript:alert(1)" },
          },
          cookieA,
        )
      ).status,
      400,
    );
    await Promise.all([
      ...Array.from({ length: 6 }, () => api("/api/resolve/" + slug, { referrer: "https://example.org" })),
      api("/api/resolve/" + slug, { referrer: "https://l.instagram.com/" }, "", { "User-Agent": "Mozilla/5.0" }),
      api("/api/resolve/" + slug, { referrer: "direct" }, "", { "User-Agent": "GPTBot/1.0", "CF-IPCountry": "TR" }),
    ]);
    const botVisit = await fetch(`${base}/${slug}`, {
      redirect: "manual",
      headers: { "User-Agent": "GPTBot/1.0", "CF-IPCountry": "TR" },
    });
    assert.equal(botVisit.status, 302);
    assert.equal(botVisit.headers.get("location"), "https://tr.example/path?utm_source=qa&utm_campaign=links");
    const socialPreview = await fetch(`${base}/${slug}`, {
      headers: { "User-Agent": "facebookexternalhit/1.1", "CF-IPCountry": "US" },
    });
    assert.equal(socialPreview.status, 200);
    assert.match(await socialPreview.text(), /QA social title/);
    const counted = await api(
      "/api/query",
      {
        table: "links",
        single: true,
        filters: [{ column: "id", value: link.id }],
      },
      cookieA,
    );
    assert.equal(counted.body.data.clicks, 12);
    const traffic = await api("/api/query", { table: "traffic_logs" }, cookieA);
    assert.equal(traffic.body.data.length, 12);
    const analytics = await api("/api/analytics?range=7d", undefined, cookieA);
    assert.equal(analytics.status, 200);
    assert.equal(analytics.body.data.totals.clicks, 12);
    assert.equal(analytics.body.data.totals.events, 12);
    const analyticsLink = analytics.body.data.items.find((item) => item.slug === slug);
    assert.equal(analyticsLink.val, 12);
    assert.equal(analyticsLink.series.reduce((sum, row) => sum + row.events, 0), 12);
    assert.equal(analyticsLink.sources.find((source) => source.name === "Instagram").traffic, 1);
    assert.equal(analyticsLink.sources.find((source) => source.name === "OpenAI crawler").traffic, 2);
    assert.equal(analyticsLink.sources.find((source) => source.name === "OpenAI crawler").type, "bot");
    assert.equal(analyticsLink.countries.find((country) => country.code === "TR").count, 2);
    assert.equal((await api("/api/analytics?range=7d", undefined, cookieB)).body.data.totals.events, 0);
    const protectedSlug = "qa-lock-" + randomUUID();
    const protectedLink = await api("/api/query", {
      table: "links", operation: "insert", single: true,
      values: { short_slug: protectedSlug, original_url: "https://protected.example", password: "SecretPass123!", settings: {} },
    }, cookieB);
    assert.equal(protectedLink.status, 200);
    assert.equal(protectedLink.body.data.has_password, true);
    assert.equal(protectedLink.body.data.password_hash, undefined);
    const locked = await api("/api/resolve/" + protectedSlug, {});
    assert.equal(locked.status, 401);
    assert.equal(locked.body.password_required, true);
    assert.equal((await api("/api/resolve/" + protectedSlug, { password: "wrong" })).status, 401);
    assert.equal((await api("/api/resolve/" + protectedSlug, { password: "SecretPass123!" })).status, 200);
    const protectedCount = await api("/api/query", { table: "links", single: true, filters: [{ column: "id", value: protectedLink.body.data.id }] }, cookieB);
    assert.equal(protectedCount.body.data.clicks, 1);
    for (const [label, schedule, expected] of [
      ["future", { startsAt: new Date(Date.now() + 3600000).toISOString() }, 404],
      ["expired", { expiresAt: new Date(Date.now() - 3600000).toISOString() }, 410],
    ]) {
      const scheduledSlug = `qa-${label}-${randomUUID()}`;
      const created = await api("/api/query", {
        table: "links", operation: "insert", single: true,
        values: { short_slug: scheduledSlug, original_url: "https://schedule.example", settings: { schedule } },
      }, cookieB);
      assert.equal(created.status, 200);
      assert.equal((await api("/api/resolve/" + scheduledSlug, {})).status, expected);
    }
    const bioSlug = "qa-" + randomUUID();
    const bio = await api(
      "/api/query",
      {
        table: "bio_pages",
        operation: "insert",
        single: true,
        values: {
          slug: bioSlug,
          theme_settings: { displayName: "QA" },
          is_published: false,
        },
      },
      cookieA,
    );
    assert.equal(bio.status, 200);
    assert.equal((await api("/api/resolve/" + bioSlug, {})).status, 404);
    assert.equal(
      (
        await api(
          "/api/query",
          {
            table: "bio_pages",
            operation: "update",
            filters: [{ column: "id", value: bio.body.data.id }],
            values: { is_published: true },
          },
          cookieA,
        )
      ).status,
      200,
    );
    const published = await api("/api/resolve/" + bioSlug, {});
    assert.equal(published.body.data.page.theme_settings.displayName, "QA");
    assert.equal(published.body.data.page.user_id, undefined);
    assert.equal((await api("/api/resolve/" + bioSlug, null)).status, 200);
    assert.equal(
      (
        await api(
          "/api/query",
          {
            table: "links",
            operation: "update",
            filters: [{ column: "id", value: link.id }],
            values: { is_archived: true },
          },
          cookieA,
        )
      ).status,
      200,
    );
    assert.equal((await api("/api/resolve/" + slug, {})).status, 404);
    const form = new FormData();
    form.append(
      "file",
      new Blob([Buffer.from("89504e470d0a1a0a00000000", "hex")], {
        type: "image/png",
      }),
      "test.png",
    );
    const upload = await fetch(base + "/api/uploads", {
      method: "POST",
      headers: { Cookie: cookieA },
      body: form,
    });
    assert.equal(upload.status, 200);
    const image = await upload.json();
    assert.equal((await fetch(base + image.data.url)).status, 200);
    const bad = new FormData();
    bad.append(
      "file",
      new Blob(["<svg/>"], { type: "image/svg+xml" }),
      "bad.svg",
    );
    assert.equal(
      (
        await fetch(base + "/api/uploads", {
          method: "POST",
          headers: { Cookie: cookieA },
          body: bad,
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await api(
          "/api/auth/user",
          { password: "NewTestingStrong123!", current_password: "wrong" },
          cookieA,
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await api(
          "/api/auth/user",
          {
            password: "NewTestingStrong123!",
            current_password: "TestingStrong123!",
            data: { full_name: "Changed" },
          },
          cookieA,
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await api("/api/auth/login", {
          email: emailA,
          password: "NewTestingStrong123!",
        })
      ).status,
      200,
    );
    const emailC = `qa-${randomUUID()}@example.com`;
    const c = await api("/api/auth/register", {
      email: emailC,
      password: "TestingStrong123!",
    });
    assert.equal(c.status, 201);
    assert.equal(c.cookie, undefined);
    ids.push(c.body.data.user.id);
    assert.equal((await api("/api/auth/login", { email: emailC, password: "TestingStrong123!" })).status, 403);
    assert.equal((await api("/api/auth/resend-verification", { email: emailC })).status, 200);
    const [verification] = await pool.execute(
      "SELECT text_body FROM mail_outbox WHERE user_id=? AND kind='verification' AND status='pending' ORDER BY created_at DESC LIMIT 1",
      [ids.at(-1)],
    );
    const verifyToken = verification[0].text_body.match(/#token=([a-f0-9]{64})/)[1];
    assert.equal((await api("/api/auth/verify-email", { token: verifyToken })).status, 200);
    assert.equal((await api("/api/auth/verify-email", { token: verifyToken })).status, 400);
    assert.equal((await api("/api/auth/login", { email: emailC, password: "TestingStrong123!" })).status, 200);
    assert(
      (await api("/api/auth/session", undefined, cookieA)).body.data.session
        .user.email_confirmed_at,
    );
    const unknown = await api("/api/auth/forgot-password", {
      email: "missing-" + randomUUID() + "@example.com",
    });
    const reset = await api("/api/auth/forgot-password", { email: emailA });
    assert.equal(reset.status, 200);
    assert.deepEqual(reset.body, unknown.body);
    const [resetMail] = await pool.execute(
      "SELECT text_body FROM mail_outbox WHERE user_id=? AND kind='password_reset' AND status='pending'",
      [ids[0]],
    );
    const resetToken = resetMail[0].text_body.match(/#token=([a-f0-9]{64})/)[1];
    assert.equal(
      (
        await api("/api/auth/setup-password", {
          token: resetToken,
          password: "ResetTesting123!",
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await api("/api/auth/setup-password", {
          token: resetToken,
          password: "ResetTesting456!",
        })
      ).status,
      400,
    );
    assert.equal(
      (await api("/api/auth/session", undefined, cookieA)).body.data.session,
      null,
    );
    assert.equal(
      (
        await api("/api/auth/login", {
          email: emailA,
          password: "ResetTesting123!",
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await api("/api/contact", {
          name: "QA Contact",
          email: emailA,
          subject: "QA support",
          message: "Test message",
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await api("/api/contact", {
          name: "QA",
          email: emailA,
          subject: "X",
          message: "x".repeat(5001),
        })
      ).status,
      400,
    );
    assert(
      !renderMail({
        title: "<script>alert(1)</script>",
        intro: "<img onerror=alert(1)>",
        details: "<b>test</b>",
      }).html.includes("<script>"),
    );
    const sent = [];
    const broken = {
      sendMail: async () => {
        throw Object.assign(new Error("Temporary failure"), {
          code: "ECONNECTION",
        });
      },
    };
    assert.equal(await deliverMailBatch(broken, 1), 0);
    const [retry] = await pool.query(
      "SELECT attempts,last_error FROM mail_outbox WHERE last_error='ECONNECTION'",
    );
    assert.equal(retry[0].attempts, 1);
    await pool.query(
      "UPDATE mail_outbox SET next_attempt_at=UTC_TIMESTAMP() WHERE last_error='ECONNECTION'",
    );
    const fakeTransport = {
      sendMail: async (mail) => {
        sent.push(mail);
        await new Promise((resolve) => setTimeout(resolve, 10));
        return { accepted: [mail.to], rejected: [] };
      },
    };
    await Promise.all([
      deliverMailBatch(fakeTransport, 20),
      deliverMailBatch(fakeTransport, 20),
    ]);
    assert.equal(new Set(sent.map((mail) => mail.messageId)).size, sent.length);
    assert(sent.some((mail) => mail.subject.includes("iletişim")));
    const [bodies] = await pool.query(
      "SELECT COUNT(*) n FROM mail_outbox WHERE status='sent' AND (html_body IS NOT NULL OR text_body IS NOT NULL)",
    );
    assert.equal(bodies[0].n, 0);
    const [mailCount] = await pool.query(
      "SELECT COUNT(*) n FROM mail_outbox WHERE status='sent'",
    );
    assert(mailCount[0].n >= 5);
    const [expiredQueue] = await pool.execute(
      "INSERT INTO mail_outbox(id,user_id,recipient,kind,subject,html_body,text_body,expires_at) VALUES(?,?,?,'password_reset','Expired','expired','expired',DATE_SUB(UTC_TIMESTAMP(),INTERVAL 1 SECOND))",
      [randomUUID(), ids[0], emailA],
    );
    assert(expiredQueue.affectedRows === 1);
    await deliverMailBatch(fakeTransport, 1);
    const [expired] = await pool.query(
      "SELECT status,html_body FROM mail_outbox WHERE subject='Expired'",
    );
    assert.equal(expired[0].status, "failed");
    assert.equal(expired[0].html_body, null);
    const setupToken = randomBytes(32).toString("hex");
    await pool.execute(
      "INSERT INTO password_setup_tokens(token_hash,user_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 1 DAY))",
      [createHash("sha256").update(setupToken).digest("hex"), ids[1]],
    );
    assert.equal(
      (
        await api("/api/auth/setup-password", {
          token: setupToken,
          password: "FreshTesting123!",
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await api("/api/auth/setup-password", {
          token: setupToken,
          password: "FreshTesting456!",
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await api("/api/auth/login", {
          email: emailB,
          password: "FreshTesting123!",
        })
      ).status,
      200,
    );
    await api("/api/auth/logout", {}, cookieB);
    assert.equal(
      (await api("/api/auth/session", undefined, cookieB)).body.data.session,
      null,
    );
  } finally {
    for (const id of ids) {
      await pool.execute(
        "DELETE FROM slugs WHERE resource_id IN (SELECT id FROM links WHERE user_id=? UNION SELECT id FROM bio_pages WHERE user_id=?)",
        [id, id],
      );
      await pool.execute("DELETE FROM users WHERE id=?", [id]);
    }
    await pool.query("DELETE FROM contact_messages WHERE name='QA Contact'");
    await pool.query(
      "DELETE FROM mail_outbox WHERE recipient='support@example.com'",
    );
    await new Promise((resolve) => server.close(resolve));
    await pool.end();
  }
});
