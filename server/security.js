import { createHash } from "node:crypto";
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const fail = (status, message) =>
  Object.assign(new Error(message), { status });
export const parse = (value) =>
  typeof value === "string" ? JSON.parse(value) : value;
const DEFAULT_ADMIN_EMAILS = new Set(["ahmet@ahmetcotur.com", "admin@lenk.tr"]);

export const isAdminEmail = (email) => {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) return false;
  if (DEFAULT_ADMIN_EMAILS.has(normalized)) return true;
  const configured = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return new Set(configured).has(normalized);
};

export const isUserAdmin = (user) => {
  if (!user) return false;
  if (isAdminEmail(user.email)) return true;
  const meta = parse(user.metadata);
  if (meta && (meta.role === "admin" || meta.is_admin === true)) return true;
  if (user.role === "admin" || user.profile_role === "admin") return true;
  return false;
};

export const userView = (row) => ({
  id: row.id,
  email: row.email,
  user_metadata: parse(row.metadata),
  app_metadata: { role: isUserAdmin(row) ? "admin" : "user" },
  email_confirmed_at: row.email_verified_at || null,
});
export const auth = (req, res, next) =>
  req.user ? next() : next(fail(401, "Oturum açmanız gerekiyor."));
export const admin = (req, res, next) => {
  if (!req.user) return next(fail(401, "Oturum açmanız gerekiyor."));
  if (!isUserAdmin(req.user))
    return next(fail(403, "Yönetici erişimi gerekiyor."));
  next();
};
