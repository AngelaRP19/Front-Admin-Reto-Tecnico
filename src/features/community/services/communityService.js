import { apiClient } from "../../../services/apiClient";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatChallengeDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  const monthName = MONTHS[Number(month) - 1] || month;
  return `${Number(day)} ${monthName} ${year}`;
}

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

function emptyCounts() {
  return { enrolled: 0, inProgress: 0, completed: 0, abandoned: 0, total: 0 };
}

export async function getCommunityStats() {
  const [challenges, subscriptions] = await Promise.all([
    apiClient.get("/nodos/challenges", { auth: false }),
    apiClient.get("/nodos/subscriptionchallenges"),
  ]);

  const countsByChallenge = {};
  (subscriptions || []).forEach((sub) => {
    const challengeId = sub.challenge?.id;
    if (challengeId == null) return;
    const group = STATUS_GROUP[sub.status] || "abandoned";
    if (!countsByChallenge[challengeId]) {
      countsByChallenge[challengeId] = emptyCounts();
    }
    countsByChallenge[challengeId][group] += 1;
    countsByChallenge[challengeId].total += 1;
  });

  return (challenges || []).map((challenge) => ({
    id: challenge.id,
    name: challenge.name,
    startDate: formatChallengeDate(challenge.start),
    endDate: formatChallengeDate(challenge.end),
    counts: countsByChallenge[challenge.id] || emptyCounts(),
  }));
}
