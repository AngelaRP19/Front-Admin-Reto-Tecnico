import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { getCommunityStats } from "../services/communityService";

const BADGE_STYLES = {
  enrolled: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  inProgress: "bg-green-500/10 text-green-600 dark:text-green-400",
  completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  abandoned: "bg-gray-500/10 text-gray-500 dark:text-gray-400",
};

function ChallengeRow({ challenge, t }) {
  const badges = [
    { key: "enrolled", label: t("community.statusEnrolled", "Inscrito"), count: challenge.counts.enrolled },
    { key: "inProgress", label: t("community.statusInProgress", "En curso"), count: challenge.counts.inProgress },
    { key: "completed", label: t("community.statusCompleted", "Completado"), count: challenge.counts.completed },
    { key: "abandoned", label: t("community.statusAbandoned", "Abandonado"), count: challenge.counts.abandoned },
  ].filter((badge) => badge.count > 0);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 py-4 min-[2560px]:py-6 border-b border-snd-bg last:border-b-0">
      <div className="min-w-0">
        <p className="font-bold text-base min-[2560px]:text-2xl min-[3840px]:text-3xl text-text truncate">{challenge.name}</p>
        <p className="text-xs min-[2560px]:text-lg min-[3840px]:text-xl text-text/50 mt-0.5">
          {challenge.startDate} · {challenge.endDate}
        </p>
      </div>

      <div className="flex items-center gap-4 min-[2560px]:gap-6 flex-wrap shrink-0">
        <div className="text-right">
          <p className="text-lg min-[2560px]:text-2xl min-[3840px]:text-3xl font-extrabold text-text leading-none">
            {challenge.counts.total}
          </p>
          <p className="text-[0.65rem] min-[2560px]:text-sm min-[3840px]:text-base text-text/50 uppercase tracking-wide">
            {t("community.subscribers", "inscritos")}
          </p>
        </div>

        <div className="flex items-center gap-2 min-[2560px]:gap-3 flex-wrap">
          {badges.map((badge) => (
            <span
              key={badge.key}
              className={`rounded-full px-3 py-1 min-[2560px]:px-4 min-[2560px]:py-1.5 text-xs min-[2560px]:text-base min-[3840px]:text-lg font-semibold whitespace-nowrap ${BADGE_STYLES[badge.key]}`}
            >
              {badge.label} · {badge.count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommunityPage() {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getCommunityStats()
      .then((data) => {
        if (!cancelled) setChallenges(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || t("community.error", "No se pudieron cargar los retos."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-6 min-[2560px]:pt-10 min-[3840px]:pt-14">
      <h1 className="text-2xl min-[2560px]:text-4xl min-[3840px]:text-6xl font-extrabold text-text mb-1">
        {t("community.title", "Retos de la comunidad")}
      </h1>
      <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl text-text/60 mb-6 min-[2560px]:mb-10">
        {t("community.subtitle", "Inscritos y estado por reto")}
      </p>

      {loading ? (
        <p className="text-text/60">{t("community.loading", "Cargando retos...")}</p>
      ) : error ? (
        <p className="text-error">{error}</p>
      ) : challenges.length === 0 ? (
        <p className="text-text/60">{t("community.empty", "Todavía no hay retos creados.")}</p>
      ) : (
        <div className="bg-card-bg rounded-2xl min-[2560px]:rounded-3xl shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.06)] px-5 min-[2560px]:px-8 min-[3840px]:px-11">
          {challenges.map((challenge) => (
            <ChallengeRow key={challenge.id} challenge={challenge} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommunityPage;
