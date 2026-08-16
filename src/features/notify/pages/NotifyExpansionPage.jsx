import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import { getBetaTesterStats } from "../../dashboard/services/statsService";
import { notifyBetaTesters } from "../services/notifyService";

const PLATFORM_OPTIONS = [
  { key: "Windows", labelId: "notify.platformWindows", fallback: "Windows" },
  { key: "Mac", labelId: "notify.platformMac", fallback: "Mac" },
  { key: "Steam", labelId: "notify.platformSteam", fallback: "Steam" },
  { key: "Móvil", labelId: "notify.platformMobile", fallback: "Móvil" },
];

function NotifyExpansionPage() {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  const [activeCount, setActiveCount] = useState(null);

  const [name, setName] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [description, setDescription] = useState("");
  const [os, setOs] = useState("");
  const [processor, setProcessor] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [platforms, setPlatforms] = useState({});

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getBetaTesterStats()
      .then((stats) => setActiveCount(stats.total))
      .catch(() => setActiveCount(null));
  }, []);

  const togglePlatform = (key) => {
    setPlatforms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validate = () => {
    const nextErrors = {};
    const required = t("notify.required", "Este campo es obligatorio.");
    if (!name.trim()) nextErrors.name = required;
    if (!publicationDate) nextErrors.publicationDate = required;
    if (!description.trim()) nextErrors.description = required;
    if (!Object.values(platforms).some(Boolean)) {
      nextErrors.platforms = t("notify.selectPlatform", "Seleccioná al menos una plataforma.");
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess(false);
    if (!validate()) return;

    const minimumRequirements = [];
    if (os.trim()) minimumRequirements.push(`SO: ${os.trim()}`);
    if (processor.trim()) minimumRequirements.push(`Procesador: ${processor.trim()}`);
    if (ram.trim()) minimumRequirements.push(`Memoria: ${ram.trim()}`);
    if (storage.trim()) minimumRequirements.push(`Almacenamiento: ${storage.trim()}`);

    const payload = {
      name: name.trim(),
      publicationDate,
      description: description.trim(),
      platforms: PLATFORM_OPTIONS.filter((opt) => platforms[opt.key]).map((opt) => opt.key).join(" / "),
      minimumRequirements,
    };

    setSubmitting(true);
    try {
      await notifyBetaTesters(payload);
      setSuccess(true);
      setName("");
      setPublicationDate("");
      setDescription("");
      setOs("");
      setProcessor("");
      setRam("");
      setStorage("");
      setPlatforms({});
    } catch (err) {
      setServerError(err.message || t("notify.backendMissing", "Esta acción todavía no está disponible en el backend."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-6 min-[2560px]:pt-10 min-[3840px]:pt-14 max-w-3xl min-[2560px]:max-w-5xl min-[3840px]:max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center gap-3 min-[2560px]:gap-5 mb-6 min-[2560px]:mb-10">
        <h1 className="text-2xl min-[2560px]:text-4xl min-[3840px]:text-6xl font-extrabold text-text">
          {t("notify.title", "Notificar nuevo paquete a Beta Testers")}
        </h1>
        {activeCount != null && (
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 text-accent-text px-3 py-1.5 min-[2560px]:px-4 min-[2560px]:py-2 text-xs min-[2560px]:text-base min-[3840px]:text-lg font-bold">
            <span className="w-2 h-2 rounded-full bg-accent" />
            {activeCount.toLocaleString("es-CO")} {t("notify.activeBadge", "Beta Testers activos")}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-card-bg rounded-2xl min-[2560px]:rounded-3xl shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.06)] p-5 min-[2560px]:p-9 min-[3840px]:p-12 flex flex-col gap-4 min-[2560px]:gap-6">
        <FormInput
          id="notify-name"
          label={t("notify.packageName", "Nombre del paquete")}
          placeholder={t("notify.packageNamePlaceholder", "Ej. Vida Urbana")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <FormInput
          id="notify-date"
          type="date"
          label={t("notify.releaseDate", "Fecha de lanzamiento")}
          value={publicationDate}
          onChange={(e) => setPublicationDate(e.target.value)}
          error={errors.publicationDate}
        />

        <div className="w-full">
          <label
            className="block text-xs min-[2560px]:text-base min-[3840px]:text-xl font-bold tracking-[0.03125rem] uppercase text-text opacity-70 mb-2 min-[2560px]:mb-3"
            htmlFor="notify-description"
          >
            {t("notify.description", "Descripción")}
          </label>
          <textarea
            id="notify-description"
            rows={4}
            placeholder={t("notify.descriptionPlaceholder", "Describe el contenido y novedades del paquete...")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-4 py-3 min-[2560px]:px-6 min-[2560px]:py-4.5 min-[3840px]:px-8 min-[3840px]:py-6 rounded-[0.625rem] min-[2560px]:rounded-xl min-[3840px]:rounded-2xl border bg-snd-bg text-text text-[0.9375rem] min-[2560px]:text-xl min-[3840px]:text-3xl font-nunito placeholder:text-text/40 placeholder:italic resize-y focus:outline-none focus:border-main focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
              errors.description ? "border-error" : "border-snd-bg"
            }`}
          />
          {errors.description && <p className="text-error text-xs min-[2560px]:text-sm min-[3840px]:text-xl mt-1">{errors.description}</p>}
        </div>

        <div>
          <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-bold text-text mb-3 min-[2560px]:mb-4">
            {t("notify.requirementsTitle", "Requisitos del sistema")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-[2560px]:gap-6">
            <FormInput
              id="notify-os"
              label={t("notify.os", "Sistema operativo")}
              placeholder={t("notify.osPlaceholder", "Ej. Windows 11 · 64 bits")}
              value={os}
              onChange={(e) => setOs(e.target.value)}
            />
            <FormInput
              id="notify-processor"
              label={t("notify.processor", "Procesador")}
              placeholder={t("notify.processorPlaceholder", "Ej. Intel Core i5")}
              value={processor}
              onChange={(e) => setProcessor(e.target.value)}
            />
            <FormInput
              id="notify-ram"
              label={t("notify.ram", "Memoria RAM")}
              placeholder={t("notify.ramPlaceholder", "Ej. 8 GB")}
              value={ram}
              onChange={(e) => setRam(e.target.value)}
            />
            <FormInput
              id="notify-storage"
              label={t("notify.storage", "Almacenamiento")}
              placeholder={t("notify.storagePlaceholder", "Ej. 8 GB disponibles (SSD)")}
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
            />
          </div>
        </div>

        <div>
          <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-bold text-text mb-3 min-[2560px]:mb-4">
            {t("notify.platforms", "Plataformas disponibles")}
          </p>
          <div className="flex flex-wrap gap-3 min-[2560px]:gap-4">
            {PLATFORM_OPTIONS.map((opt) => (
              <label
                key={opt.key}
                className={`flex items-center gap-2 min-[2560px]:gap-3 rounded-full border px-4 py-2 min-[2560px]:px-6 min-[2560px]:py-3 text-sm min-[2560px]:text-lg min-[3840px]:text-xl font-semibold cursor-pointer transition-colors ${
                  platforms[opt.key] ? "border-main bg-main/10 text-main" : "border-snd-bg text-text hover:border-main/50"
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-main w-4 h-4 min-[2560px]:w-5 min-[2560px]:h-5 cursor-pointer"
                  checked={Boolean(platforms[opt.key])}
                  onChange={() => togglePlatform(opt.key)}
                />
                {t(opt.labelId, opt.fallback)}
              </label>
            ))}
          </div>
          {errors.platforms && <p className="text-error text-xs min-[2560px]:text-sm min-[3840px]:text-xl mt-2">{errors.platforms}</p>}
        </div>

        {serverError ? <p className="text-error text-sm min-[2560px]:text-lg min-[3840px]:text-2xl">{serverError}</p> : null}
        {success ? (
          <p className="text-price text-sm min-[2560px]:text-lg min-[3840px]:text-2xl font-semibold">
            {t("notify.success", "¡Notificación enviada a los beta testers!")}
          </p>
        ) : null}

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting
            ? t("notify.submitting", "Enviando...")
            : i18n._({
                id: "notify.submit",
                message: "Enviar a {count} Beta Testers",
                values: { count: activeCount != null ? activeCount.toLocaleString("es-CO") : "…" },
              })}
        </Button>
      </form>
    </div>
  );
}

export default NotifyExpansionPage;
