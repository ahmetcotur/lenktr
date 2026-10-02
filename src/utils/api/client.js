const listeners = new Set();
export async function request(url, body, method = "POST") {
  try {
    const response = await fetch(url, {
      method,
      credentials: "same-origin",
      headers:
        body instanceof FormData ? {} : { "Content-Type": "application/json" },
      ...(body === undefined
        ? {}
        : { body: body instanceof FormData ? body : JSON.stringify(body) }),
    });
    const result = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : {
          error: {
            message:
              response.status === 429
                ? "Çok fazla istek gönderdiniz. Bir süre sonra tekrar deneyin."
                : "İşlem tamamlanamadı.",
          },
        };
    if (response.status === 401 && !url.includes("/api/auth/login") && !result.password_required)
      emit("SIGNED_OUT", null);
    if (!response.ok)
      return {
        data: null,
        error: result.error || { message: "İşlem tamamlanamadı." },
        password_required: Boolean(result.password_required),
      };
    return { ...result, error: null };
  } catch {
    return {
      data: null,
      error: { message: "Sunucuya bağlanılamadı. Lütfen tekrar deneyin." },
    };
  }
}
function emit(event, session) {
  listeners.forEach((callback) => callback(event, session));
}
async function authRequest(url, body, event) {
  const result = await request(url, body);
  if (!result.error)
    emit(
      event,
      result.data.session ||
        (result.data.user ? { user: result.data.user } : null),
    );
  return result;
}
class Query {
  constructor(table) {
    this.query = { table, operation: "select", filters: [] };
  }
  select(selection = "*") {
    this.query.selection = selection;
    return this;
  }
  eq(column, value) {
    this.query.filters.push({ column, value });
    return this;
  }
  order(column, options = {}) {
    this.query.order = { column, ascending: options.ascending !== false };
    return this;
  }
  limit(limit) {
    this.query.limit = limit;
    return this;
  }
  single() {
    this.query.single = true;
    return this;
  }
  insert(values) {
    Object.assign(this.query, { operation: "insert", values });
    return this;
  }
  update(values) {
    Object.assign(this.query, { operation: "update", values });
    return this;
  }
  delete() {
    this.query.operation = "delete";
    return this;
  }
  then(resolve, reject) {
    return request("/api/query", this.query).then(resolve, reject);
  }
}
const client = {
  from: (table) => new Query(table),
  auth: {
    getSession: () => request("/api/auth/session", undefined, "GET"),
    onAuthStateChange: (callback) => {
      listeners.add(callback);
      return {
        data: {
          subscription: { unsubscribe: () => listeners.delete(callback) },
        },
      };
    },
    signUp: (body) => request("/api/auth/register", body),
    signInWithPassword: (body) =>
      authRequest("/api/auth/login", body, "SIGNED_IN"),
    signOut: () => authRequest("/api/auth/logout", {}, "SIGNED_OUT"),
    updateUser: (body) => authRequest("/api/auth/user", body, "USER_UPDATED"),
  },
};
export const createClient = () => client;
