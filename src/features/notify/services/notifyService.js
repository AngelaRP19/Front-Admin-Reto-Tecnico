import { apiClient } from "../../../services/apiClient";

export function notifyBetaTesters(payload) {
  return apiClient.post("/nodos/expansionpacks/notify-beta-testers", payload);
}
