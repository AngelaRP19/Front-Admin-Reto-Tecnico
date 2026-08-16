import { Link } from "react-router-dom";
import { useLingui } from "@lingui/react";

function NotFoundPage() {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg px-5 text-center">
      <h1 className="text-6xl min-[2560px]:text-8xl font-extrabold text-main mb-4">
        {t("notFound.title", "404")}
      </h1>
      <p className="text-text/70 text-base min-[2560px]:text-2xl mb-6">
        {t("notFound.body", "La página que buscás no existe.")}
      </p>
      <Link to="/" className="text-main font-semibold hover:text-hover transition-colors">
        {t("notFound.backHome", "Volver al dashboard")}
      </Link>
    </div>
  );
}

export default NotFoundPage;
