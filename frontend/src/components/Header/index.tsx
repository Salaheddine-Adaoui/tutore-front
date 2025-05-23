"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";

import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

import { deleteHistoryOfStudent } from "../../lib/hooks/history";
import ChangePasswordModal from "../ChangePasswordModal";
import { toast } from "react-hot-toast";

const Header = () => {
  /* états globaux */
  const [navbarOpen, setNavbarOpen]     = useState(false);
  const [sticky, setSticky]             = useState(false);
  const [openIndex, setOpenIndex]       = useState(-1);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);

  const pathname    = usePathname();
  const router      = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Récupération des cookies
  const cookies    = new Cookies();
  const rawId      = cookies.get("id");
  const studentId  = rawId ? Number(rawId) : null;
  const nom        = cookies.get("nom")    ?? "";
  const prenom     = cookies.get("prenom") ?? "";
  const initials   = `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();

  // Debug
  useEffect(() => {
    console.log("🍪 studentId:", studentId, "initials:", initials);
  }, [studentId, initials]);

  /* routes où l’on cache SignIn/SignUp */
  const hideBoth   = ["/", "/historique", "/Recommandation", "/formulaire"];
  const hideSignIn = [...hideBoth, "/signin"].includes(pathname);
  const hideSignUp = [...hideBoth, "/signup"].includes(pathname);

  /* toggles */
  const toggleNavbar   = () => setNavbarOpen(o => !o);
  const toggleSubmenu  = (i: number) => setOpenIndex(i === openIndex ? -1 : i);
  const toggleUserMenu = () => setUserMenuOpen(o => !o);

  /* sticky header */
  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY >= 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* clic hors menu utilisateur */
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  /* supprimer historique */
  const deleteHistoryHandler = async () => {
    if (!studentId) {
      toast.error("Utilisateur non identifié.");
      setUserMenuOpen(false);
      return;
    }
    try {
      const { data } = await deleteHistoryOfStudent(studentId);
      toast.success(data.message ?? "Historique supprimé !");
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? "Erreur inconnue");
    } finally {
      setUserMenuOpen(false);
    }
  };

  /* logout */
  const logoutHandler = () => {
    cookies.remove("id");
    cookies.remove("nom");
    cookies.remove("prenom");
    cookies.remove("email");
    setUserMenuOpen(false);
    router.push("/signin");
  };

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "fixed z-[9999] bg-white bg-opacity-80 shadow-sticky backdrop-blur-sm dark:bg-gray-800"
            : "absolute bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="block w-48">
              <Image
                src="/images/logo/logo_ensakh1.png"
                alt="logo ENSA"
                width={200}
                height={100}
                priority
              />
            </Link>

            {/* Navigation + actions */}
            <div className="flex items-center space-x-60">
              {/* Burger mobile */}
              <button
                onClick={toggleNavbar}
                aria-label="Mobile Menu"
                className="lg:hidden p-2"
              >
                {/* icône burger */}
              </button>

              {/* Menu principal */}
              <nav
                className={`absolute top-full mr-30 z-30 w-64 ml-3 rounded bg-white p-4 shadow-lg dark:bg-gray-800 lg:static lg:block lg:w-auto lg:shadow-none lg:bg-transparent lg:p-0 ${
                  navbarOpen ? "block" : "hidden lg:block"
                }`}
              >
                <ul className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-8">
                  {menuData.map((item, idx) => (
                    <li key={idx} className="relative group">
                      <Link
                        href={item.path}
                        className={`block py-2 text-base ${
                          pathname === item.path
                            ? "text-primary dark:text-white"
                            : "text-gray-700 hover:text-primary dark:text-gray-300"
                        }`}
                        onClick={() => setNavbarOpen(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Sign In */}
              {!hideSignIn && (
                <Link
                  href="/signin"
                  className="hidden px-4 py-2 text-base font-medium text-gray-700 hover:underline md:block"
                >
                  Sign In
                </Link>
              )}

              {/* Sign Up */}
              {!hideSignUp && (
                <Link
                  href="/signup"
                  className="hidden rounded bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-opacity-90 md:block"
                >
                  Sign Up
                </Link>
              )}

              {/* User menu avec initiales */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  aria-label="User menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white focus:ring-2 focus:ring-primary"
                >
                  {initials || "?"}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-200 rounded bg-white shadow-lg dark:divide-gray-700 dark:bg-gray-800">
                    <button
                      onClick={deleteHistoryHandler}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Supprimer l’historique
                    </button>
                    <button
                      onClick={() => {
                        setShowPwdModal(true);
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Modifier le mot de passe
                    </button>
                    <button
                      onClick={logoutHandler}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>

              {/* Theme toggler */}
              <ThemeToggler />
            </div>
          </div>
        </div>
      </header>

      {/* Modal changement de mot de passe */}
      {showPwdModal && studentId != null && (
        <ChangePasswordModal
          userId={studentId}
          onClose={() => setShowPwdModal(false)}
        />
      )}
    </>
  );
};

export default Header;
