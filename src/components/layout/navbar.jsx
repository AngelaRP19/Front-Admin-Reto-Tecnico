import { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../features/auth/services/authService";
import LanguageSelector from "../common/LanguageSelector";
import useClickOutside from "../../hooks/useClickOutside";

const LOGO_URL = "https://res.cloudinary.com/w1jl4sa5/image/upload/v1784825556/Logo_of_The_Sims_4.svg_jagzsl.webp";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef(null);
  const mobileUserMenuRef = useRef(null);
  const mobileNavWrapperRef = useRef(null);
  useClickOutside([userMenuRef, mobileUserMenuRef], () => setShowUserMenu(false), showUserMenu);
  useClickOutside(mobileNavWrapperRef, () => setMenuOpen(false), menuOpen);

  const { theme, toggleTheme } = useTheme();
  const { user, clearUser } = useAuth();
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  const displayName = user?.firstName || user?.username || "";
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "A";

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearUser();
      setShowUserMenu(false);
      setMenuOpen(false);
      navigate("/login");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `no-underline text-lg min-[2560px]:text-[2rem] min-[3840px]:text-[2.7rem] font-semibold transition-colors duration-300 hover:text-main ${
      isActive ? "text-main" : "text-text"
    }`;

  const userMenu = (
    <>
      <p className="font-bold text-base min-[2560px]:text-2xl min-[3840px]:text-3xl mb-1 min-[2560px]:mb-2">
        {displayName || t("navbar.admin", "Administrador")}
      </p>
      {user?.email && (
        <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-2xl opacity-70 mb-3 min-[2560px]:mb-5 break-all">{user.email}</p>
      )}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full mt-2 min-[2560px]:mt-3 text-sm min-[2560px]:text-xl min-[3840px]:text-2xl font-bold text-main hover:text-hover transition-colors text-left cursor-pointer"
      >
        {t("navbar.logout", "Cerrar sesión")}
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-[1000] flex flex-col md:flex-row justify-between items-center w-full h-auto md:h-20 min-[2560px]:md:h-[6.5rem] min-[3840px]:md:h-[8rem] min-[2560px]:text-[1.15rem] min-[3840px]:text-[1.45rem] p-5 md:px-10 lg:px-[4.375rem] lg:py-0 min-[2560px]:px-16 min-[2560px]:py-3 min-[3840px]:px-24 min-[3840px]:py-5 gap-5 md:gap-0 min-[2560px]:gap-6 bg-bg shadow-[0_0.125rem_0.625rem_rgba(0,0,0,0.08)] mb-[1.875rem] min-[2560px]:mb-8 ml-auto transition-colors duration-[400ms]">
      <div className="contents" ref={mobileNavWrapperRef}>
        {/* Fila superior mobile/tablet: hamburguesa+idioma+tema | logo | perfil, siempre visible */}
        <div className="flex lg:hidden items-center justify-between w-full gap-2 min-[2560px]:gap-4">
          <div className="flex items-center gap-2 min-[2560px]:gap-4">
            <button
              type="button"
              className="text-[2rem] min-[2560px]:text-[2.3rem] min-[3840px]:text-[2.9rem] cursor-pointer text-text leading-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t("navbar.openMenu", "Abrir menú")}
              aria-expanded={menuOpen}
            >
              ☰
            </button>
            <LanguageSelector />
            <button
              type="button"
              onClick={toggleTheme}
              className="text-accent min-[2560px]:scale-95 min-[3840px]:scale-105 hover:rotate-12 transition cursor-pointer"
              aria-label={t("navbar.changeTheme", "Cambiar tema")}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          <Link to="/" className="flex items-center justify-center shrink-0">
            <img
              src={LOGO_URL}
              alt="The Sims"
              className="w-16 h-16 min-[2560px]:w-[5.5rem] min-[2560px]:h-[5.5rem] min-[3840px]:w-[7rem] min-[3840px]:h-[7rem] object-contain"
            />
          </Link>

          <div className="relative" ref={mobileUserMenuRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="w-9 h-9 min-[2560px]:w-10 min-[2560px]:h-10 min-[3840px]:w-11 min-[3840px]:h-11 rounded-full bg-main text-bg font-bold flex items-center justify-center hover:bg-hover transition-colors shadow-md text-sm min-[2560px]:text-[0.9rem] min-[3840px]:text-[1rem] cursor-pointer"
              aria-label={t("navbar.profileMenu", "Menú de perfil")}
            >
              {initial}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 min-[2560px]:mt-3 w-64 min-[2560px]:w-96 min-[3840px]:w-[30rem] max-w-[90vw] bg-card-bg text-text rounded-xl min-[2560px]:rounded-2xl shadow-lg p-4 min-[2560px]:p-6 min-[3840px]:p-8 z-[1300] transition-colors duration-300">
                {userMenu}
              </div>
            )}
          </div>
        </div>

        {/* Logo exclusivo de escritorio */}
        <div className="hidden lg:flex items-center gap-[0.9375rem] min-[2560px]:gap-6 justify-start">
          <Link to="/">
            <img
              src={LOGO_URL}
              alt="The Sims"
              className="w-[7.5rem] h-[7.5rem] min-[2560px]:w-[9rem] min-[2560px]:h-[9rem] min-[3840px]:w-[12rem] min-[3840px]:h-[12rem] m-4 object-contain"
            />
          </Link>
        </div>

        <nav
          className={`absolute lg:static top-20 left-0 w-full lg:w-auto bg-snd-bg lg:bg-transparent shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.25)] lg:shadow-none overflow-hidden lg:overflow-visible transition-[max-height,opacity] duration-[400ms] ease-in-out lg:flex lg:items-center lg:gap-10 lg:grow lg:max-h-none lg:opacity-100 lg:pointer-events-auto lg:py-0 lg:transition-none z-[1100] ${
            menuOpen
              ? "max-h-[25rem] opacity-100 pointer-events-auto py-[1.875rem]"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <ul className="flex flex-col items-center gap-[0.9375rem] md:gap-5 min-[2560px]:gap-6 lg:flex-row lg:gap-[1.875rem] min-[2560px]:lg:gap-8 lg:mr-auto list-none">
            <li>
              <NavLink to="/" end onClick={() => setMenuOpen(false)} className={navLinkClass}>
                {t("navbar.dashboard", "Dashboard")}
              </NavLink>
            </li>
            <li>
              <NavLink to="/comunidad" onClick={() => setMenuOpen(false)} className={navLinkClass}>
                {t("navbar.community", "Comunidad")}
              </NavLink>
            </li>
          </ul>

          {/* Perfil, idioma y tema: solo escritorio (en mobile viven en la fila superior) */}
          <div className="hidden lg:flex lg:items-center lg:gap-[1.875rem] min-[2560px]:lg:gap-8 min-[3840px]:lg:gap-10">
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="w-10 h-10 min-[2560px]:w-10 min-[2560px]:h-10 min-[3840px]:w-11 min-[3840px]:h-11 rounded-full bg-main text-bg font-bold flex items-center justify-center hover:bg-hover transition-colors shadow-md min-[2560px]:text-[0.8rem] min-[3840px]:text-[0.95rem] cursor-pointer"
                aria-label={t("navbar.profileMenu", "Menú de perfil")}
              >
                {initial}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 min-[2560px]:mt-3 w-64 min-[2560px]:w-96 min-[3840px]:w-[30rem] bg-card-bg text-text rounded-xl min-[2560px]:rounded-2xl shadow-lg p-4 min-[2560px]:p-6 min-[3840px]:p-8 z-50 transition-colors duration-300">
                  {userMenu}
                </div>
              )}
            </div>

            <LanguageSelector />

            <button
              type="button"
              onClick={toggleTheme}
              className="self-center text-accent min-[2560px]:scale-95 min-[3840px]:scale-105 hover:rotate-12 transition cursor-pointer"
              aria-label={t("navbar.changeTheme", "Cambiar tema")}
            >
              {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
