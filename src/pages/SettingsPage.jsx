import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  User,
  Shield,
  Bell,
  Upload,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { createClient, request } from "../utils/api/client";
import { uploadImage } from "../utils/api/storage";
const api = createClient();
export default function SettingsPage() {
  const { user } = useAuth(),
    { i18n } = useTranslation(),
    english = i18n.language.startsWith("en"),
    [params, setParams] = useSearchParams(),
    avatarInput = useRef(null);
  const active = ["profile", "security", "notifications"].includes(
    params.get("tab"),
  )
    ? params.get("tab")
    : "profile";
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.full_name || "",
    avatar: user?.user_metadata?.avatar_url || "",
  });
  const [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(null),
    [currentPassword, setCurrentPassword] = useState(""),
    [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState(""),
    [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (active === "notifications")
      api
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)
        .then(({ data }) => setNotifications(data || []));
  }, [active]);
  const text = (tr, en) => (english ? en : tr);
  function message(error, success) {
    setNotice({ error: Boolean(error), text: error?.message || success });
  }
  async function saveProfile(event) {
    event.preventDefault();
    setBusy(true);
    const { error } = await api.auth.updateUser({
      data: { full_name: profile.name, avatar_url: profile.avatar },
    });
    message(
      error,
      text("Profiliniz güncellendi.", "Your profile has been updated."),
    );
    setBusy(false);
  }
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const { url, error } = await uploadImage(file);
    if (url) setProfile((p) => ({ ...p, avatar: url }));
    message(
      error,
      text(
        "Görsel yüklendi. Değişikliği kaydetmeyi unutmayın.",
        "Image uploaded. Save your changes to update your profile.",
      ),
    );
    setBusy(false);
    event.target.value = "";
  }
  async function changePassword(event) {
    event.preventDefault();
    if (password !== confirmation) {
      message({
        message: text(
          "Yeni şifreler eşleşmiyor.",
          "New passwords do not match.",
        ),
      });
      return;
    }
    setBusy(true);
    const { error } = await api.auth.updateUser({
      current_password: currentPassword,
      password,
    });
    message(
      error,
      text(
        "Şifreniz güncellendi. Diğer oturumlar kapatıldı.",
        "Password updated. Your other sessions have been signed out.",
      ),
    );
    if (!error) {
      setCurrentPassword("");
      setPassword("");
      setConfirmation("");
    }
    setBusy(false);
  }
  async function verify() {
    setBusy(true);
    const { data, error } = await request("/api/auth/resend-verification", {});
    message(error, data?.message);
    setBusy(false);
  }
  async function markRead(id) {
    const { error } = await api
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
    if (!error)
      setNotifications((all) =>
        all.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    else message(error);
  }
  const input =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50";
  const button =
    "inline-flex gap-2 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-sm font-semibold disabled:opacity-50";
  return (
    <section className="max-w-4xl mx-auto">
      <header className="mb-7">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {text("Hesap ayarları", "Account settings")}
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">
          {text(
            "Profilinizi, güvenliğinizi ve bildirimlerinizi yönetin.",
            "Manage your profile, security and notifications.",
          )}
        </p>
      </header>
      <div className="grid lg:grid-cols-[200px_1fr] gap-6">
        <nav
          aria-label="Ayarlar"
          className="flex lg:flex-col gap-2 overflow-x-auto"
        >
          {[
            { id: "profile", label: text("Profil", "Profile"), icon: User },
            {
              id: "security",
              label: text("Güvenlik", "Security"),
              icon: Shield,
            },
            {
              id: "notifications",
              label: text("Bildirimler", "Notifications"),
              icon: Bell,
            },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              aria-current={active === id ? "page" : undefined}
              onClick={() => {
                setParams({ tab: id });
                setNotice(null);
              }}
              className={`shrink-0 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${active === id ? "bg-blue-500/10 text-blue-400" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="rounded-2xl border border-white/10 bg-[#0D0F14] p-5 sm:p-8 space-y-6">
          {notice && (
            <p
              role={notice.error ? "alert" : "status"}
              className={`rounded-xl p-4 text-sm ${notice.error ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-300"}`}
            >
              {notice.text}
            </p>
          )}
          {active === "profile" && (
            <form onSubmit={saveProfile} className="space-y-6">
              <h2 className="text-lg font-bold">
                {text("Profil bilgileri", "Profile details")}
              </h2>
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 rounded-2xl bg-blue-500/10 text-blue-400 grid place-items-center overflow-hidden text-2xl font-bold shrink-0">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (profile.name || user.email)[0].toUpperCase()
                  )}
                </div>
                <input
                  ref={avatarInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={upload}
                />
                <button
                  type="button"
                  onClick={() => avatarInput.current.click()}
                  disabled={busy}
                  className="flex gap-2 items-center text-sm text-blue-400"
                >
                  <Upload size={17} />
                  {text("Görsel yükle", "Upload photo")}
                </button>
              </div>
              <div className="space-y-2">
                <label htmlFor="profile-name" className="text-sm text-zinc-300">
                  {text("Ad soyad", "Full name")}
                </label>
                <input
                  id="profile-name"
                  autoComplete="name"
                  required
                  maxLength={200}
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, name: e.target.value }))
                  }
                  className={input}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="profile-email"
                  className="text-sm text-zinc-300"
                >
                  {text("E-posta adresi", "Email address")}
                </label>
                <input
                  id="profile-email"
                  type="email"
                  readOnly
                  value={user.email}
                  className={input + " text-zinc-500"}
                />
                {user.email_confirmed_at ? (
                  <p className="flex gap-2 items-center text-green-400 text-xs">
                    <CheckCircle2 size={15} />
                    {text("E-posta doğrulandı", "Email verified")}
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={verify}
                    className="text-xs text-blue-400"
                  >
                    {text(
                      "Doğrulama e-postasını gönder",
                      "Send verification email",
                    )}
                  </button>
                )}
              </div>
              <button type="submit" disabled={busy} className={button}>
                {busy && <Loader2 size={17} className="animate-spin" />}
                {text("Değişiklikleri kaydet", "Save changes")}
              </button>
            </form>
          )}
          {active === "security" && (
            <form onSubmit={changePassword} className="space-y-5">
              <h2 className="text-lg font-bold">
                {text("Şifrenizi değiştirin", "Change your password")}
              </h2>
              <p className="text-zinc-400 text-sm">
                {text(
                  "En az 8 karakter kullanın. Şifre değiştiğinde diğer cihazlardaki oturumlarınız kapatılır.",
                  "Use at least 8 characters. Changing your password signs out your other devices.",
                )}
              </p>
              {[
                {
                  id: "current-password",
                  label: text("Mevcut şifre", "Current password"),
                  value: currentPassword,
                  set: setCurrentPassword,
                  complete: "current-password",
                },
                {
                  id: "new-password",
                  label: text("Yeni şifre", "New password"),
                  value: password,
                  set: setPassword,
                  complete: "new-password",
                },
                {
                  id: "confirm-password",
                  label: text(
                    "Yeni şifreyi tekrar girin",
                    "Confirm new password",
                  ),
                  value: confirmation,
                  set: setConfirmation,
                  complete: "new-password",
                },
              ].map((field) => (
                <div className="space-y-2" key={field.id}>
                  <label htmlFor={field.id} className="text-sm text-zinc-300">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    autoComplete={field.complete}
                    type="password"
                    required
                    minLength={field.complete === "new-password" ? 8 : 1}
                    maxLength={128}
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    className={input}
                  />
                </div>
              ))}
              <button type="submit" disabled={busy} className={button}>
                {busy && <Loader2 size={17} className="animate-spin" />}
                {text("Şifreyi güncelle", "Update password")}
              </button>
            </form>
          )}
          {active === "notifications" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">
                {text("Hesap bildirimleri", "Account notifications")}
              </h2>
              <p className="text-sm text-zinc-400">
                {text(
                  "Şifre ve hesap güvenliği bildirimlerinizi burada görebilirsiniz.",
                  "Review your account and security notifications here.",
                )}
              </p>
              {notifications.length ? (
                notifications.map((n) => (
                  <button
                    onClick={() => markRead(n.id)}
                    key={n.id}
                    className={`block w-full text-left p-4 rounded-xl border ${n.is_read ? "border-white/5 text-zinc-500" : "border-blue-500/20 bg-blue-500/5 text-white"}`}
                  >
                    <p className="text-sm leading-relaxed">{n.content}</p>
                    <span className="block text-xs text-zinc-500 mt-2">
                      {new Date(n.created_at).toLocaleString(
                        english ? "en-GB" : "tr-TR",
                      )}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-zinc-500 py-8 text-center">
                  {text("Henüz bildiriminiz yok.", "No notifications yet.")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
