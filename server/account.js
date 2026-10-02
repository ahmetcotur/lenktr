import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import bcrypt from "bcryptjs";
import { randomUUID, randomBytes } from "node:crypto";
import { pool, transaction } from "./db.js";
import { hash, fail, parse, userView, auth } from "./security.js";
import { enqueueMail, siteUrl } from "./mail.js";
const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60000,
  limit: 25,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
async function session(req, res, user) {
  const token = randomBytes(32).toString("hex");
  if (req.cookies.lenk_session)
    await pool.execute("DELETE FROM sessions WHERE token_hash=?", [
      hash(req.cookies.lenk_session),
    ]);
  await pool.execute("DELETE FROM sessions WHERE expires_at<UTC_TIMESTAMP()");
  await pool.execute(
    "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 30 DAY))",
    [hash(token), user.id],
  );
  res.cookie("lenk_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 86400000,
    path: "/",
  });
  res.json({
    data: { session: { user: userView(user) }, user: userView(user) },
  });
}
router.get("/auth/session", (req, res) =>
  res.json({
    data: { session: req.user ? { user: userView(req.user) } : null },
  }),
);
router.post("/auth/register", authLimiter, async (req, res) => {
  const { email, password, options } = req.body;
  const address = String(email || "")
    .trim()
    .toLowerCase();
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) ||
    address.length > 254 ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 128
  )
    throw fail(400, "Geçerli e-posta ve en az 8 karakterli şifre girin.");
  const id = randomUUID();
  const metadata = {
    full_name: String(options?.data?.full_name || "").slice(0, 200),
    role: "Operator",
    email_verification_required: true,
  };
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      "INSERT INTO users(id,email,password_hash,metadata) VALUES(?,?,?,?)",
      [id, address, await bcrypt.hash(password, 12), JSON.stringify(metadata)],
    );
    await connection.execute("INSERT INTO profiles(id,full_name) VALUES(?,?)", [
      id,
      metadata.full_name,
    ]);
    await verificationMail(connection, { id, email: address }, true);
    await connection.execute(
      "INSERT INTO notifications(id,user_id,type,content) VALUES(?,?,?,?)",
      [
        randomUUID(),
        id,
        "system",
        "LENK.TR’ye hoş geldiniz. İlk bağlantınızı veya bio sayfanızı oluşturabilirsiniz.",
      ],
    );
    await connection.commit();
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
  res.status(201).json({
    data: {
      verification_required: true,
      user: { id, email: address, email_confirmed_at: null },
    },
  });
});
async function verificationMail(connection, user, welcome = false) {
  const token = randomBytes(32).toString("hex");
  await connection.execute(
    "DELETE FROM email_verification_tokens WHERE user_id=?",
    [user.id],
  );
  await connection.execute(
    "UPDATE mail_outbox SET status='failed',html_body=NULL,text_body=NULL,last_error='superseded' WHERE user_id=? AND kind='verification' AND status='pending'",
    [user.id],
  );
  await connection.execute(
    "INSERT INTO email_verification_tokens(token_hash,user_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 24 HOUR))",
    [hash(token), user.id],
  );
  await enqueueMail(connection, {
    userId: user.id,
    to: user.email,
    kind: "verification",
    subject: welcome
      ? "LENK.TR’ye hoş geldiniz — e-postanızı doğrulayın"
      : "LENK.TR — E-postanızı doğrulayın",
    expiresAt: new Date(Date.now() + 86400000),
    content: {
      title: welcome ? "Hoş geldiniz" : "E-postanızı doğrulayın",
      intro:
        "Bağlantılarınız ve bio sayfanız için hesabınız hazır. E-posta adresinizi doğrulamak için aşağıdaki bağlantıyı kullanın. Bağlantı 24 saat geçerlidir.",
      button: "E-postamı doğrula",
      url: `${siteUrl}/account/verify#token=${token}`,
    },
  });
}
async function securityMail(user, connection) {
  await enqueueMail(connection, {
    userId: user.id,
    to: user.email,
    kind: "security",
    subject: "LENK.TR — Şifreniz değiştirildi",
    content: {
      title: "Şifreniz değiştirildi",
      intro:
        "Hesabınızın şifresi güncellendi. Bu işlemi siz yapmadıysanız giriş sayfasından şifrenizi sıfırlayın.",
      button: "Hesabımı koru",
      url: `${siteUrl}/forgot-password`,
    },
  });
  await connection.execute(
    "INSERT INTO notifications(id,user_id,type,content) VALUES(?,?,?,?)",
    [randomUUID(), user.id, "alert", "Hesabınızın şifresi güncellendi."],
  );
}
const resetLimiter = rateLimit({
  windowMs: 3600000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
router.post("/auth/forgot-password", resetLimiter, async (req, res) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    throw fail(400, "Geçerli bir e-posta adresi girin.");
  const [users] = await pool.execute(
    "SELECT id,email FROM users WHERE email=?",
    [email],
  );
  if (users[0])
    await transaction(async (connection) => {
      const token = randomBytes(32).toString("hex");
      await connection.execute("SELECT id FROM users WHERE id=? FOR UPDATE", [
        users[0].id,
      ]);
      await connection.execute(
        "DELETE FROM password_setup_tokens WHERE user_id=?",
        [users[0].id],
      );
      await connection.execute(
        "UPDATE mail_outbox SET status='failed',html_body=NULL,text_body=NULL,last_error='superseded' WHERE user_id=? AND kind='password_reset' AND status='pending'",
        [users[0].id],
      );
      await connection.execute(
        "INSERT INTO password_setup_tokens(token_hash,user_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 45 MINUTE))",
        [hash(token), users[0].id],
      );
      await enqueueMail(connection, {
        userId: users[0].id,
        to: email,
        kind: "password_reset",
        subject: "LENK.TR — Şifrenizi sıfırlayın",
        expiresAt: new Date(Date.now() + 45 * 60000),
        content: {
          title: "Yeni bir şifre belirleyin",
          intro:
            "Şifrenizi sıfırlamak için aşağıdaki bağlantıyı kullanın. Bağlantı 45 dakika geçerlidir ve yalnızca bir kez kullanılabilir. Bu isteği siz yapmadıysanız mesajı yok sayabilirsiniz.",
          button: "Şifremi sıfırla",
          url: `${siteUrl}/account/password#token=${token}`,
        },
      });
    });
  res.json({
    data: {
      message:
        "Bu adresle kayıtlı bir hesap varsa şifre sıfırlama bağlantısı gönderilecektir.",
    },
  });
});
router.post("/auth/resend-verification", resetLimiter, async (req, res) => {
  let user = req.user;
  if (!user) {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
      throw fail(400, "Geçerli bir e-posta adresi girin.");
    const [rows] = await pool.execute("SELECT * FROM users WHERE email=?", [email]);
    user = rows[0];
  }
  if (user && !user.email_verified_at)
    await transaction(async (connection) => {
      await connection.execute("SELECT id FROM users WHERE id=? FOR UPDATE", [user.id]);
      await verificationMail(connection, user);
    });
  res.json({
    data: { message: "Hesap varsa doğrulama bağlantısı e-posta adresine gönderildi." },
  });
});
router.post("/auth/verify-email", authLimiter, async (req, res) => {
  const { token } = req.body;
  if (typeof token !== "string" || token.length !== 64)
    throw fail(400, "Geçersiz doğrulama bağlantısı.");
  const user = await transaction(async (connection) => {
    const [tokens] = await connection.execute(
      "SELECT user_id FROM email_verification_tokens WHERE token_hash=? AND expires_at>UTC_TIMESTAMP() FOR UPDATE",
      [hash(token)],
    );
    if (!tokens[0])
      throw fail(
        400,
        "Bağlantı geçersiz veya süresi dolmuş. Ayarlar sayfasından yenisini isteyebilirsiniz.",
      );
    await connection.execute(
      "UPDATE users SET email_verified_at=UTC_TIMESTAMP() WHERE id=?",
      [tokens[0].user_id],
    );
    await connection.execute(
      "DELETE FROM email_verification_tokens WHERE user_id=?",
      [tokens[0].user_id],
    );
    const [rows] = await connection.execute("SELECT * FROM users WHERE id=?", [
      tokens[0].user_id,
    ]);
    return rows[0];
  });
  // A confirmation link does not sign in the recipient or replace another account's session.
  res.json({
    data: {
      message: "E-posta adresiniz doğrulandı.",
      ...(req.user?.id === user.id ? { user: userView(user) } : {}),
    },
  });
});
const contactLimiter = rateLimit({
  windowMs: 3600000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
router.post("/contact", contactLimiter, async (req, res) => {
  const { name, email, subject, message, website } = req.body;
  if (website) return res.json({ data: { message: "Mesajınız alındı." } });
  if (
    [name, email, subject, message].some(
      (v) => typeof v !== "string" || !v.trim(),
    ) ||
    name.length > 200 ||
    subject.length > 200 ||
    message.length > 5000 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )
    throw fail(400, "Lütfen tüm alanları geçerli bilgilerle doldurun.");
  await transaction(async (connection) => {
    await connection.execute(
      "INSERT INTO contact_messages(id,name,email,subject,message) VALUES(?,?,?,?,?)",
      [
        randomUUID(),
        name.trim(),
        email.trim().toLowerCase(),
        subject.trim(),
        message.trim(),
      ],
    );
    if (process.env.SUPPORT_EMAIL)
      await enqueueMail(connection, {
        to: process.env.SUPPORT_EMAIL,
        replyTo: email.trim(),
        kind: "contact",
        subject: `LENK.TR iletişim: ${subject.trim()}`,
        content: {
          title: "Yeni iletişim talebi",
          intro: `${name.trim()} (${email.trim()})`,
          details: message.trim(),
        },
      });
  });
  res.json({
    data: { message: "Mesajınız alındı. En kısa sürede dönüş yapacağız." },
  });
});

router.post("/auth/login", authLimiter, async (req, res) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email=?", [
    String(req.body.email || "")
      .trim()
      .toLowerCase(),
  ]);
  if (
    typeof req.body.password !== "string" ||
    req.body.password.length > 128 ||
    !rows[0] ||
    !(await bcrypt.compare(req.body.password, rows[0].password_hash))
  )
    throw fail(401, "E-posta veya şifre hatalı.");
  if (rows[0].access_disabled)
    throw fail(403, "Bu hesabın erişimi yönetici tarafından kısıtlandı.");
  if (!rows[0].email_verified_at && parse(rows[0].metadata)?.email_verification_required)
    throw fail(403, "Giriş yapmadan önce e-posta adresinizi doğrulayın. Yeni doğrulama bağlantısı isteyebilirsiniz.");
  await session(req, res, rows[0]);
});
router.post("/auth/logout", async (req, res) => {
  if (req.cookies.lenk_session)
    await pool.execute("DELETE FROM sessions WHERE token_hash=?", [
      hash(req.cookies.lenk_session),
    ]);
  res.clearCookie("lenk_session", { path: "/" });
  res.json({ data: {} });
});
router.post("/auth/setup-password", authLimiter, async (req, res) => {
  const { token, password } = req.body;
  if (
    typeof token !== "string" ||
    token.length !== 64 ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 128
  )
    throw fail(400, "Geçerli bağlantı ve en az 8 karakterli şifre gerekiyor.");
  const passwordHash = await bcrypt.hash(password, 12);
  const connection = await pool.getConnection();
  let user;
  try {
    await connection.beginTransaction();
    const [tokens] = await connection.execute(
      "SELECT user_id FROM password_setup_tokens WHERE token_hash=? AND expires_at>UTC_TIMESTAMP() FOR UPDATE",
      [hash(token)],
    );
    if (!tokens[0]) throw fail(400, "Bağlantı geçersiz veya süresi dolmuş.");
    const id = tokens[0].user_id;
    await connection.execute("UPDATE users SET password_hash=? WHERE id=?", [
      passwordHash,
      id,
    ]);
    await connection.execute(
      "DELETE FROM password_setup_tokens WHERE user_id=?",
      [id],
    );
    await connection.execute("DELETE FROM sessions WHERE user_id=?", [id]);
    const [rows] = await connection.execute("SELECT * FROM users WHERE id=?", [
      id,
    ]);
    user = rows[0];
    await securityMail(user, connection);
    await connection.commit();
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
  await session(req, res, user);
});
router.post("/auth/user", auth, async (req, res) => {
  const user = await transaction(async (connection) => {
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE id=? FOR UPDATE",
      [req.user.id],
    );
    if (!rows[0]) throw fail(401, "Oturumunuz sona erdi.");
    const current = rows[0],
      metadata = { ...parse(current.metadata) };
    for (const key of ["full_name", "avatar_url"])
      if (req.body.data?.[key] !== undefined)
        metadata[key] = String(req.body.data[key]).slice(
          0,
          key === "full_name" ? 200 : 2000,
        );
    if (req.body.password) {
      if (
        typeof req.body.password !== "string" ||
        req.body.password.length < 8 ||
        req.body.password.length > 128 ||
        !(await bcrypt.compare(
          String(req.body.current_password || ""),
          current.password_hash,
        ))
      )
        throw fail(
          400,
          "Mevcut şifreyi ve en az 8 karakterli yeni şifreyi girin.",
        );
      await connection.execute("UPDATE users SET password_hash=? WHERE id=?", [
        await bcrypt.hash(req.body.password, 12),
        current.id,
      ]);
      await connection.execute(
        "DELETE FROM sessions WHERE user_id=? AND token_hash<>?",
        [current.id, hash(req.cookies.lenk_session)],
      );
      await connection.execute(
        "DELETE FROM password_setup_tokens WHERE user_id=?",
        [current.id],
      );
      await securityMail(current, connection);
    }
    await connection.execute("UPDATE users SET metadata=? WHERE id=?", [
      JSON.stringify(metadata),
      current.id,
    ]);
    await connection.execute(
      "UPDATE profiles SET full_name=?,avatar_url=?,updated_at=UTC_TIMESTAMP() WHERE id=?",
      [metadata.full_name || "", metadata.avatar_url || null, current.id],
    );
    return { ...current, metadata };
  });
  res.json({ data: { user: userView(user) } });
});

export default router;
