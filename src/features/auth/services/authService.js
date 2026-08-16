import { apiClient, setToken, clearToken, markLoggedOut } from "../../../services/apiClient";
import { encryptPayload } from "../../../services/cryptoUtils";

/**
 * Login de administrador
 */
export async function login(username, password) {
  const encryptedPayload = await encryptPayload({ username, password });
  const data = await apiClient.post("/auth/login", encryptedPayload, { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

/**
 * Logout
 */
export async function logout() {
  try {
    await apiClient.post("/auth/logout", undefined, { auth: true });
  } catch {
    // Si falla la llamada al backend, igual se limpia la sesión localmente.
  } finally {
    clearToken();
    markLoggedOut();
  }
}

/**
 * Obtener usuario actual
 */
export async function fetchCurrentUser() {
  return apiClient.get("/auth/me");
}
