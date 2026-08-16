import { apiClient } from "../../../services/apiClient";

export async function getBetaTesterStats() {
  const users = await apiClient.get("/nodos/users");
  const betaTesters = (users || []).filter((u) => u.betaTester);

  const countryCounts = {};
  betaTesters.forEach((u) => {
    const country = u.country?.trim() || "—";
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  const byCountry = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = betaTesters.filter((u) => {
    const createdAt = u.createdAt ? new Date(u.createdAt).getTime() : NaN;
    return !Number.isNaN(createdAt) && createdAt >= oneWeekAgo;
  }).length;

  return {
    total: betaTesters.length,
    activeCountries: byCountry.length,
    byCountry,
    newThisWeek,
  };
}
