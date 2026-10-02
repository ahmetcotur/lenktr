import { createHash } from "node:crypto";
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const fail = (status, message) =>
  Object.assign(new Error(message), { status });
export const parse = (value) =>
  typeof value === "string" ? JSON.parse(value) : value;
export const userView = (row) => ({
  id: row.id,
  email: row.email,
  user_metadata: parse(row.metadata),
  email_confirmed_at: row.email_verified_at || null,
});
export const auth = (req, res, next) =>
  req.user ? next() : next(fail(401, "Oturum açmanız gerekiyor."));
