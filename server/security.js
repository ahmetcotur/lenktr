import { createHash } from "node:crypto";
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const fail = (status, message) =>
  Object.assign(new Error(message), { status });
export const parse = (value) =>
  typeof value === "string" ? JSON.parse(value) : value;
export const isAdminEmail = (email) =>
  new Set(
    (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  ).has(String(email || "").trim().toLowerCase());
export const userView = (row) => ({
  id: row.id,
  email: row.email,
  user_metadata: parse(row.metadata),
  app_metadata: { role: isAdminEmail(row.email) ? "admin" : "user" },
  email_confirmed_at: row.email_verified_at || null,
});
export const auth = (req, res, next) =>
  req.user ? next() : next(fail(401, "Oturum açmanız gerekiyor."));
export const admin = (req, res, next) => {
  if (!req.user) return next(fail(401, "Oturum açmanız gerekiyor."));
  if (!isAdminEmail(req.user.email))
    return next(fail(403, "Yönetici erişimi gerekiyor."));
  next();
};
