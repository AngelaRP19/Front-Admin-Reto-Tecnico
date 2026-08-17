import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLingui } from "@lingui/react";
import Button from "../../../components/common/Button";
import FormInput from "../../../components/common/FormInput";
import { login, fetchCurrentUser, logout } from "../services/authService";
import { useAuth } from "../../../context/AuthContext";

const LOGO_URL = "https://res.cloudinary.com/w1jl4sa5/image/upload/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const { setUser } = useAuth();
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!username.trim() || !password) {
      setServerError(t("login.requiredFields", "Ingresá tu usuario y contraseña."));
      return;
    }

    setSubmitting(true);
    try {
      await login(username.trim(), password);
      const me = await fetchCurrentUser();

      if (me?.role !== "ROLE_ADMIN") {
        await logout();
        setServerError(t("login.forbidden", "Acceso restringido a personal autorizado."));
        return;
      }

      setUser(me);
      navigate(location.state?.from ?? "/", { replace: true });
    } catch (err) {
      setServerError(err.message || t("login.genericError", "Ocurrió un error. Intentá de nuevo."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#131a24] px-5 py-10 min-[2560px]:px-12 min-[2560px]:py-16 min-[3840px]:px-20 min-[3840px]:py-24">
      <div className="w-full max-w-[23.75rem] min-[2560px]:max-w-[38rem] min-[3840px]:max-w-[50rem] bg-white rounded-2xl min-[2560px]:rounded-3xl shadow-2xl p-8 min-[2560px]:p-14 min-[3840px]:p-20 flex flex-col items-center text-center">
        <img
          src={LOGO_URL}
          alt="The Sims"
          className="w-24 h-24 min-[2560px]:w-36 min-[2560px]:h-36 min-[3840px]:w-48 min-[3840px]:h-48 object-contain mb-1 min-[2560px]:mb-2"
        />
        <p className="text-xs min-[2560px]:text-base min-[3840px]:text-xl font-bold tracking-[0.08em] uppercase text-[#1d1d1d]/60 mb-7 min-[2560px]:mb-10">
          {t("login.panel", "Panel de administración")}
        </p>

        <form className="w-full flex flex-col text-left" onSubmit={handleSubmit}>
          <label
            className="block text-xs min-[2560px]:text-base min-[3840px]:text-xl font-bold tracking-[0.03125rem] uppercase text-[#1d1d1d] opacity-70 mb-2 min-[2560px]:mb-3"
            htmlFor="admin-username"
          >
            {t("login.username", "Usuario administrador")}
          </label>
          <input
            id="admin-username"
            type="text"
            autoComplete="username"
            placeholder={t("login.usernamePlaceholder", "admin")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 min-[2560px]:px-6 min-[2560px]:py-4.5 min-[3840px]:px-8 min-[3840px]:py-6 mb-4 rounded-[0.625rem] min-[2560px]:rounded-xl min-[3840px]:rounded-2xl border border-[#e5e4e7] bg-[#f7f7f8] text-[#1d1d1d] text-[0.9375rem] min-[2560px]:text-xl min-[3840px]:text-3xl font-nunito placeholder:text-[#1d1d1d]/40 focus:outline-none focus:border-main focus-visible:ring-2 focus-visible:ring-main"
          />

          <label
            className="block text-xs min-[2560px]:text-base min-[3840px]:text-xl font-bold tracking-[0.03125rem] uppercase text-[#1d1d1d] opacity-70 mb-2 min-[2560px]:mb-3"
            htmlFor="admin-password"
          >
            {t("login.password", "Contraseña")}
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 min-[2560px]:px-6 min-[2560px]:py-4.5 min-[3840px]:px-8 min-[3840px]:py-6 mb-6 rounded-[0.625rem] min-[2560px]:rounded-xl min-[3840px]:rounded-2xl border border-[#e5e4e7] bg-[#f7f7f8] text-[#1d1d1d] text-[0.9375rem] min-[2560px]:text-xl min-[3840px]:text-3xl font-nunito placeholder:text-[#1d1d1d]/40 focus:outline-none focus:border-main focus-visible:ring-2 focus-visible:ring-main"
          />

          {serverError ? (
            <p className="text-error text-sm min-[2560px]:text-lg min-[3840px]:text-2xl text-center mb-4">{serverError}</p>
          ) : null}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? t("login.loading", "Ingresando...") : t("login.button", "Iniciar sesión")}
          </Button>
        </form>

        <p className="text-xs min-[2560px]:text-base min-[3840px]:text-xl text-[#1d1d1d]/50">
          {t("login.subtitle", "Acceso restringido a personal autorizado.")}
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
