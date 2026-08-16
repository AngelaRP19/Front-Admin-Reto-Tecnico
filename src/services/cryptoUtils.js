// Cifra el body de peticiones sensibles (login) con AES-256-GCM antes
// de mandarlo, usando el Web Crypto API nativo del navegador (sin librerías externas).
// El backend usa la misma clave (crypto.secret-key en application.yml) para
// desencriptar. Ver util/CryptoUtil.java del backend.
//
// Nota: esto evita que el body se vea en texto plano al inspeccionar la petición
// (Network tab), pero la clave vive en el bundle del front, así que no reemplaza
// a HTTPS como protección contra alguien que intercepta el tráfico en la red.

const RAW_KEY_BASE64 = import.meta.env.VITE_CRYPTO_SECRET_KEY;

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

async function getKey() {
  if (!RAW_KEY_BASE64) {
    throw new Error("Falta VITE_CRYPTO_SECRET_KEY en el .env del front.");
  }
  const keyBytes = base64ToBytes(RAW_KEY_BASE64);
  return crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["encrypt"]);
}

/**
 * Cifra un objeto JS (se serializa a JSON internamente) y devuelve el body
 * listo para mandar como { data, iv } (ambos base64), tal como lo espera
 * EncryptedRequest en el backend.
 */
export async function encryptPayload(payload) {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes es lo recomendado para GCM

  const plainBytes = new TextEncoder().encode(JSON.stringify(payload));

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plainBytes
  );

  return {
    data: bytesToBase64(new Uint8Array(cipherBuffer)),
    iv: bytesToBase64(iv),
  };
}
