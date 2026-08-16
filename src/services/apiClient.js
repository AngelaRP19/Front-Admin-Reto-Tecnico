// VITE_API_URL vacío ("") es intencional en desarrollo: hace que las peticiones salgan
// como rutas relativas al propio origen del front, que Vite reenvía al backend real vía
// el proxy configurado en vite.config.js (ver ese archivo) — evita el bloqueo de CORS del
// backend, que hoy solo permite http://localhost:5173. Si la variable no está definida en
// absoluto, se usa el backend directo como fallback.
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";
const TOKEN_KEY = "authToken";
const LOGGED_OUT_KEY = "authLoggedOut";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    // Una sesión nueva de verdad siempre cancela cualquier marca de "cerré sesión" anterior.
    localStorage.removeItem(LOGGED_OUT_KEY);
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function markLoggedOut() {
  localStorage.setItem(LOGGED_OUT_KEY, "1");
}

export function clearLoggedOutMark() {
  localStorage.removeItem(LOGGED_OUT_KEY);
}

export function isLoggedOut() {
  return localStorage.getItem(LOGGED_OUT_KEY) === "1";
}

async function request(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  const token = auth ? getToken() : null;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Intentá de nuevo.");
  }

  // Sin token o token inválido/vencido en un endpoint protegido, el backend redirige
  // a una página HTML de login en vez de responder 401 — sin este chequeo, ese HTML
  // terminaría tratado como si fuera una respuesta válida.
  if (response.redirected) {
    clearToken();
    const err = new Error("Tu sesión expiró o no es válida. Iniciá sesión de nuevo.");
    err.sessionExpired = true;
    throw err;
  }

  const rawText = await response.text().catch(() => "");
  let data = null;
  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      // El backend a veces responde texto plano sin comillas (ej. "Credenciales inválidas"),
      // lo cual no es JSON válido — se usa el texto crudo tal cual.
      data = rawText;
    }
  }

  if (!response.ok) {
    const err = new Error(extractErrorMessage(data, response.status));
    err.data = data;
    throw err;
  }

  return data;
}

function extractErrorMessage(data, status) {
  if (typeof data === "string" && data.trim()) return data;

  if (data && typeof data === "object") {
    if (typeof data.message === "string") return data.message;
    if (typeof data.error === "string") return data.error;

    const fieldErrors = Object.values(data).filter((value) => typeof value === "string");
    if (fieldErrors.length > 0) return fieldErrors.join(" ");
  }

  console.error(`Respuesta de error sin mensaje utilizable (status ${status}):`, data);
  return "Ocurrió un problema al procesar la solicitud. Intentá de nuevo.";
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  del: (path, options) => request(path, { ...options, method: "DELETE" }),
};
