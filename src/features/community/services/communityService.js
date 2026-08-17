import { apiClient } from "../../../services/apiClient";

// INICIADO = estado por defecto al inscribirse (backend: SubscriptionChallenge.status
// default = INICIADO). No hay transición automática por fecha ni estado "pendiente/próximo"
// en el backend — EN_PROGRESO lo setea el cliente cuando el usuario arranca de verdad.
// CANCELADO y FALLIDO se agrupan juntos como "Abandonado" porque el mockup del dashboard
// no los distingue.
const STATUS_GROUP = {
  INICIADO: "enrolled",
  EN_PROGRESO: "inProgress",
  FINALIZADO: "completed",
  CANCELADO: "abandoned",
  FALLIDO: "abandoned",
};

// El backend no traduce un mismo reto: /nodos/challenges?lang=xx devuelve una fila
// (con su propio id) por cada idioma, no una fila con nombre traducido. Por eso hay
// que traer los 3 idiomas y agrupar las filas que son "el mismo" reto conceptual.
// No hay ningún id/slug compartido entre esas filas — pero start+end sí son idénticos
// entre variantes de idioma del mismo reto (confirmado contra el backend), así que se
// usan como clave de agrupación.
const LANGUAGES = ["es", "en", "fr"];

function emptyCounts() {
  return { enrolled: 0, inProgress: 0, completed: 0, abandoned: 0, total: 0 };
}

export async function getCommunityStats(locale = "es") {
  const [challengesByLanguage, subscriptions] = await Promise.all([
    Promise.all(LANGUAGES.map((lang) => apiClient.get(`/nodos/challenges?lang=${lang}`, { auth: false }))),
    apiClient.get("/nodos/subscriptionchallenges"),
  ]);

  const groups = new Map();
  LANGUAGES.forEach((lang, i) => {
    (challengesByLanguage[i] || []).forEach((challenge) => {
      const key = `${challenge.start}|${challenge.end}`;
      if (!groups.has(key)) {
        groups.set(key, { start: challenge.start, end: challenge.end, namesByLanguage: {}, ids: new Set() });
      }
      const group = groups.get(key);
      group.namesByLanguage[lang] = challenge.name;
      group.ids.add(challenge.id);
    });
  });

  const groupKeyById = new Map();
  groups.forEach((group, key) => {
    group.ids.forEach((id) => groupKeyById.set(id, key));
  });

  const countsByGroup = {};
  (subscriptions || []).forEach((sub) => {
    const challengeId = sub.challenge?.id;
    if (challengeId == null) return;
    const groupKey = groupKeyById.get(challengeId);
    if (!groupKey) return;
    const statusGroup = STATUS_GROUP[sub.status] || "abandoned";
    if (!countsByGroup[groupKey]) {
      countsByGroup[groupKey] = emptyCounts();
    }
    countsByGroup[groupKey][statusGroup] += 1;
    countsByGroup[groupKey].total += 1;
  });

  return Array.from(groups.entries()).map(([key, group]) => ({
    id: key,
    name: group.namesByLanguage[locale] || group.namesByLanguage.es || Object.values(group.namesByLanguage)[0],
    startDate: group.start,
    endDate: group.end,
    counts: countsByGroup[key] || emptyCounts(),
  }));
}
