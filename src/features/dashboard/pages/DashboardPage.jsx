import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { getBetaTesterStats } from "../services/statsService";
import Button from "../../../components/common/Button";

function StatCard({ label, value, hint }) {
  return (
    <div className="bg-card-bg rounded-2xl min-[2560px]:rounded-3xl shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.06)] p-5 min-[2560px]:p-8 min-[3840px]:p-11 flex-1 min-w-[9.5rem]">
      <p className="text-xs min-[2560px]:text-base min-[3840px]:text-xl font-bold uppercase tracking-[0.03em] text-text/50 mb-2 min-[2560px]:mb-3">
        {label}
      </p>
      <p className="text-3xl min-[2560px]:text-5xl min-[3840px]:text-7xl font-extrabold text-text">
        {value}
      </p>
      {hint ? (
        <p className="text-xs min-[2560px]:text-sm min-[3840px]:text-lg text-text/40 mt-2 min-[2560px]:mt-3">{hint}</p>
      ) : null}
    </div>
  );
}

function CountryBar({ country, count, max }) {
  const width = max > 0 ? Math.max((count / max) * 100, 4) : 0;
  return (
    <div className="flex items-center gap-4 min-[2560px]:gap-6">
      <span className="w-24 min-[2560px]:w-36 min-[3840px]:w-48 shrink-0 text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-semibold text-text truncate">
        {country}
      </span>
      <div className="flex-1 h-3 min-[2560px]:h-4 min-[3840px]:h-6 rounded-full bg-snd-bg overflow-hidden">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--main-color),var(--hover-color))] transition-[width] duration-500"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-12 min-[2560px]:w-16 min-[3840px]:w-20 shrink-0 text-right text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-semibold text-text/70">
        {count}
      </span>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getBetaTesterStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || t("dashboard.error", "No se pudieron cargar las estadísticas."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const byCountry = stats?.byCountry ?? [];
  const top = byCountry.slice(0, 5);
  const restCount = byCountry.slice(5).reduce((sum, c) => sum + c.count, 0);
  const bars = restCount > 0 ? [...top, { country: t("dashboard.other", "Otros"), count: restCount }] : top;
  const maxCount = bars.length ? Math.max(...bars.map((b) => b.count)) : 0;

  return (
    <div className="pt-6 min-[2560px]:pt-10 min-[3840px]:pt-14">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 min-[2560px]:gap-6 mb-6 min-[2560px]:mb-10">
        <div>
          <h1 className="text-2xl min-[2560px]:text-4xl min-[3840px]:text-6xl font-extrabold text-text">
            {t("dashboard.title", "Dashboard de Beta Testing")}
          </h1>
          <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl text-text/60 mt-1">
            {t("dashboard.subtitle", "Inscritos por país")}
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            variant="primary"
            className="!bg-green-600 hover:!bg-green-700 !px-12 min-[2560px]:!px-16"
            onClick={() => navigate("/notificar-expansion")}
          >
            {t("dashboard.sendExpansion", "Enviar Correo Masivo")}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-text/60">{t("dashboard.loading", "Cargando estadísticas...")}</p>
      ) : error ? (
        <p className="text-error">{error}</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 min-[2560px]:gap-6 mb-6 min-[2560px]:mb-10">
            <StatCard label={t("dashboard.totalSubscribers", "Total inscritos")} value={stats.total.toLocaleString("es-CO")} />
            <StatCard label={t("dashboard.activeCountries", "Países activos")} value={stats.activeCountries} />
            <StatCard
              label={t("dashboard.newThisWeek", "Nuevos esta semana")}
              value={stats.newThisWeek.toLocaleString("es-CO")}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-[2560px]:gap-6">
            <div className="lg:col-span-2 bg-card-bg rounded-2xl min-[2560px]:rounded-3xl shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.06)] p-5 min-[2560px]:p-8 min-[3840px]:p-11">
              <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-bold text-text mb-4 min-[2560px]:mb-6">
                {t("dashboard.byCountry", "Inscritos por país")}
              </p>
              {bars.length === 0 ? (
                <p className="text-text/60">{t("dashboard.noSubscribers", "Todavía no hay beta testers inscritos.")}</p>
              ) : (
                <div className="flex flex-col gap-3 min-[2560px]:gap-5">
                  {bars.map((bar) => (
                    <CountryBar key={bar.country} country={bar.country} count={bar.count} max={maxCount} />
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate("/comunidad")}
              className="cursor-pointer text-left bg-card-bg rounded-2xl min-[2560px]:rounded-3xl shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.06)] p-5 min-[2560px]:p-8 min-[3840px]:p-11 hover:shadow-[0_0.25rem_1rem_rgba(0,0,0,0.1)] transition-shadow flex flex-col justify-between"
            >
              <div>
                <p className="text-lg min-[2560px]:text-2xl min-[3840px]:text-3xl font-bold text-text mb-2">
                  {t("dashboard.community", "Comunidad")}
                </p>
                <p className="text-sm min-[2560px]:text-lg min-[3840px]:text-xl text-text/60">
                  {t("dashboard.communityHint", "Ver retos e inscripciones")}
                </p>
              </div>
              <span className="text-main font-semibold mt-4 min-[2560px]:text-xl min-[3840px]:text-2xl">→</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
