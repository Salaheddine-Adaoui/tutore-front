/* ============================================
   Header.tsx
   En-tête avec :
   • navigation responsive
   • thème clair/sombre
   • menu utilisateur : supprimer l’historique,
     changer le mot de passe via un modal,
     déconnexion
   ============================================ */

   "use client";

   import Image                       from "next/image";
   import Link                        from "next/link";
   import { usePathname, useRouter }  from "next/navigation";
   import { useEffect, useRef, useState } from "react";
   
   import ThemeToggler                from "./ThemeToggler";
   import menuData                    from "./menuData";
   
   import { deleteHistoryOfStudent }  from "../../lib/hooks/history";
   import ChangePasswordModal         from "../ChangePasswordModal";   // ← chemin à ajuster si besoin
   import { toast }                   from "react-hot-toast";
   
   /* ───────────────────────  Icône utilisateur  ─────────────────────── */
   const UserIcon = ({ className = "" }: { className?: string }) => (
     <svg className={className} viewBox="0 0 24 24" fill="currentColor">
       <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1c0-3.33-6.67-5-10-5Z" />
     </svg>
   );
   
   /* ────────────────────────────  Header  ──────────────────────────── */
   const Header = () => {
     /* état navigation */
     const [navbarOpen, setNavbarOpen] = useState(false);
     const [sticky, setSticky]         = useState(false);
     const [openIndex, setOpenIndex]   = useState(-1);
     const pathname                    = usePathname();
   
     const toggleNavbar  = () => setNavbarOpen(!navbarOpen);
     const toggleSubmenu = (idx: number) =>
       setOpenIndex(idx === openIndex ? -1 : idx);
   
     /* sticky on scroll */
     useEffect(() => {
       const onScroll = () => setSticky(window.scrollY >= 80);
       window.addEventListener("scroll", onScroll);
       return () => window.removeEventListener("scroll", onScroll);
     }, []);
   
     /* menu utilisateur */
     const [userMenuOpen, setUserMenuOpen] = useState(false);
     const userMenuRef                     = useRef<HTMLDivElement>(null);
     const toggleUserMenu = () => setUserMenuOpen(o => !o);
   
     useEffect(() => {
       if (!userMenuOpen) return;
       const handleClickOutside = (e: MouseEvent) => {
         if (!userMenuRef.current?.contains(e.target as Node)) {
           setUserMenuOpen(false);
         }
       };
       window.addEventListener("mousedown", handleClickOutside);
       return () => window.removeEventListener("mousedown", handleClickOutside);
     }, [userMenuOpen]);
   
     const router = useRouter();
     const DEFAULT_STUDENT_ID = 1;       // ← id fixe pour les tests
   
     /* modal changement de mot de passe */
     const [showPwdModal, setShowPwdModal] = useState(false);
   
     /* ───── handler : supprimer historique ───── */
     const deleteHistoryHandler = async () => {
       try {
         const { data } = await deleteHistoryOfStudent(DEFAULT_STUDENT_ID);
         toast.success(data.message ?? "Historique supprimé !");
       } catch (err: any) {
         toast.error(err.response?.data?.error ?? "Erreur inconnue");
       } finally {
         setUserMenuOpen(false);
       }
     };
   
     /* ───── handler : logout ───── */
     const logoutHandler = () => {
       localStorage.removeItem("currentUser"); // ou retire ton token, etc.
       setUserMenuOpen(false);
       router.push("/signin");
     };
   
     /* ────────────────────────────  Render  ──────────────────────────── */
     return (
       <>
         <header
           className={`header left-0 top-0 z-40 flex w-full items-center ${
             sticky
               ? "fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition dark:bg-gray-dark dark:shadow-sticky-dark"
               : "absolute bg-transparent"
           }`}
         >
           <div className="container">
             <div className="relative -mx-4 flex items-center justify-between">
               {/* ▸ Logo */}
               <div className="w-60 max-w-full px-4 xl:mr-12">
                 <Image
                   src="/images/logo/logo_ensakh1.png"
                   alt="logo ENSA"
                   width={140}
                   height={100}
                   className="w-[200px] h-[100px]"
                   priority
                 />
               </div>
   
               {/* ▸ Navigation + actions */}
               <div className="flex w-full items-center justify-between px-4">
                 {/* Burger + menu */}
                 <div>
                   <button
                     onClick={toggleNavbar}
                     aria-label="Mobile Menu"
                     className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                   >
                     <span
                       className={`block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                         navbarOpen ? "translate-y-[7px] rotate-45" : ""
                       }`}
                     />
                     <span
                       className={`my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                         navbarOpen ? "opacity-0" : ""
                       }`}
                     />
                     <span
                       className={`block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                         navbarOpen ? "-translate-y-[7px] -rotate-45" : ""
                       }`}
                     />
                   </button>
   
                   {/* links */}
                   <nav
                     id="navbarCollapse"
                     className={`navbar absolute right-0 z-30 w-[250px] rounded border border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                       navbarOpen
                         ? "visibility top-full opacity-100"
                         : "invisible top-[120%] opacity-0"
                     }`}
                   >
                     <ul className="block lg:flex lg:space-x-12">
                       {menuData.map((item, idx) => (
                         <li key={idx} className="group relative">
                           {item.path ? (
                             <Link
                               href={item.path}
                               className={`flex py-2 text-base lg:inline-flex lg:px-0 lg:py-6 ${
                                 pathname === item.path
                                   ? "text-primary dark:text-white"
                                   : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                               }`}
                               onClick={() => setNavbarOpen(false)}
                             >
                               {item.title}
                             </Link>
                           ) : (
                             <>
                               <p
                                 onClick={() => setOpenIndex(idx === openIndex ? -1 : idx)}
                                 className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:inline-flex lg:px-0 lg:py-6"
                               >
                                 {item.title}
                                 <span className="pl-3">
                                   <svg width="25" height="24" viewBox="0 0 25 24">
                                     <path
                                       d="M6.293 8.843a.75.75 0 0 1 1.06 0L12 13.49l4.646-4.647a.75.75 0 1 1 1.06 1.061L12.53 15.03a.75.75 0 0 1-1.06 0L6.293 9.904a.75.75 0 0 1 0-1.061z"
                                       fill="currentColor"
                                     />
                                   </svg>
                                 </span>
                               </p>
                               <div
                                 className={`submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 lg:invisible lg:absolute lg:top-[110%] lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full dark:bg-dark ${
                                   openIndex === idx ? "block" : "hidden"
                                 }`}
                               >
                                 {item.submenu?.map((sub, subIdx) => (
                                   <Link
                                     key={subIdx}
                                     href={sub.path}
                                     className="block rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                                     onClick={() => setNavbarOpen(false)}
                                   >
                                     {sub.title}
                                   </Link>
                                 ))}
                               </div>
                             </>
                           )}
                         </li>
                       ))}
                     </ul>
                   </nav>
                 </div>
   
                 {/* actions droite */}
                 <div className="flex items-center gap-3 pr-16 lg:pr-0">
                   <Link
                     href="/signin"
                     className="hidden px-7 py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white md:block"
                   >
                     Sign In
                   </Link>
                   <Link
                     href="/signup"
                     className="hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white shadow-btn transition duration-300 hover:bg-opacity-90 hover:shadow-btn-hover md:block md:px-9 lg:px-6 xl:px-9"
                   >
                     Sign Up
                   </Link>
   
                   {/* user menu */}
                   <div className="relative" ref={userMenuRef}>
                     <button
                       onClick={toggleUserMenu}
                       aria-label="User menu"
                       className="rounded-full p-2 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:hover:bg-gray-700"
                     >
                       <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                     </button>
   
                     {userMenuOpen && (
                       <div className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 dark:divide-gray-700 dark:bg-gray-800">
                         <button
                           onClick={deleteHistoryHandler}
                           className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                         >
                           Supprimer l’historique
                         </button>
   
                         {/* ─── MODIFIER Mot de passe → ouvre le modal ─── */}
                         <button
                           onClick={() => {
                             setShowPwdModal(true);
                             setUserMenuOpen(false);
                           }}
                           className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                         >
                           Modifier le mot de passe
                         </button>
   
                         <button
                           onClick={logoutHandler}
                           className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                         >
                           Déconnexion
                         </button>
                       </div>
                     )}
                   </div>
   
                   {/* switch thème */}
                   <ThemeToggler />
                 </div>
               </div>
             </div>
           </div>
         </header>
   
         {/* ─────────────  Modal changement de mot de passe  ───────────── */}
         {showPwdModal && (
           <ChangePasswordModal
             userId={DEFAULT_STUDENT_ID}            // ← 1 pour tes tests
             onClose={() => setShowPwdModal(false)}
           />
         )}
       </>
     );
   };
   
   export default Header;
   