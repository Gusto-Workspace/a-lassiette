import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { GlobalContext } from "@/contexts/global.context";
import { hasVisibleNews } from "@/_assets/utils/news.utils";

const baseMenuItems = [
  { label: "Accueil", href: "/" },
  { label: "Carte & Menus", href: "/menus" },
  { label: "Réserver", href: "/reservations" },
  { label: "Actualités", href: "/news", visibilityKey: "news" },
  { label: "Contact", href: "/contact" },
];
let hasAssignedInitialNavReveal = false;

export default function NavComponent({
  isVisible = true,
  scrolled = false,
  logoSrc = "/img/logo.png",
}) {
  const { restaurantContext } = useContext(GlobalContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasStartedNewsVisibilityCheck, setHasStartedNewsVisibilityCheck] =
    useState(false);
  const [navReady, setNavReady] = useState(false);
  const [animateOnMount, setAnimateOnMount] = useState(false);
  const [mountReady, setMountReady] = useState(false);
  const [visibilityTransitionsEnabled, setVisibilityTransitionsEnabled] =
    useState(false);
  const restaurantData = restaurantContext?.restaurantData;
  const restaurantDataLoading = restaurantContext?.dataLoading;
  const menuItems = baseMenuItems.filter((item) => {
    if (item.visibilityKey === "news") {
      return hasVisibleNews(restaurantData);
    }

    return true;
  });

  useEffect(() => {
    if (isVisible && !hasAssignedInitialNavReveal) {
      hasAssignedInitialNavReveal = true;
      setAnimateOnMount(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (restaurantDataLoading || restaurantData) {
      setHasStartedNewsVisibilityCheck(true);
    }
  }, [restaurantData, restaurantDataLoading]);

  useEffect(() => {
    if (!hasStartedNewsVisibilityCheck) {
      return;
    }

    if (restaurantDataLoading) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setNavReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [
    hasStartedNewsVisibilityCheck,
    restaurantData,
    restaurantDataLoading,
  ]);

  useEffect(() => {
    if (!navReady) {
      return;
    }

    let firstFrame = null;
    let secondFrame = null;

    if (animateOnMount) {
      setVisibilityTransitionsEnabled(true);
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          setMountReady(true);
        });
      });
    } else {
      setMountReady(true);
      firstFrame = window.requestAnimationFrame(() => {
        setVisibilityTransitionsEnabled(true);
      });
    }

    return () => {
      if (firstFrame) window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [animateOnMount, navReady]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const navIsDisplayed = navReady && mountReady && isVisible;

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 z-[59] bg-black/30 transition-all duration-300 min-[1180px]:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer mobile */}
      <aside
        className={`fixed right-0 top-0 z-[60] flex h-screen w-[92%] max-w-[420px] flex-col bg-[#022401] px-8 pb-10 pt-8 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] min-[1180px]:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-12 flex items-center justify-between">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <div className="relative h-[55px] w-[55px] rounded-full overflow-hidden">
              <Image src={logoSrc} alt="Logo" fill className="object-cover" />
            </div>
          </Link>

          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white"
          >
            <X size={22} strokeWidth={1.6} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-12">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-center gap-4 text-[30px] leading-none text-white transition-opacity duration-300 hover:opacity-60"
            >
              <span className="text-[12px] uppercase tracking-[0.28em] text-white/35">
                0{index + 1}
              </span>
              <span className="yeseva-one-regular">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Navbar */}
      <nav
        className={`fixed left-0 top-0 z-[50] w-full ${
          visibilityTransitionsEnabled
            ? "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            : "transition-none"
        } ${
          navIsDisplayed
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        } ${scrolled ? "bg-white" : "bg-transparent"}`}
      >
        <div className="mx-auto flex h-[92px] w-full max-w-[1600px] items-center justify-between px-6 tablet:px-8 min-[1180px]:px-10 desktop:px-12">
          {/* Logo */}
          <Link href="/" aria-label="Accueil">
            <div className="relative h-[55px] w-[55px] rounded-full overflow-hidden">
              <Image
                src={logoSrc}
                alt="Logo"
                fill
                priority
                className="object-cover"
              />
            </div>
          </Link>

          {/* Liens desktop en haut à droite */}
          <div className="hidden min-[1180px]:flex items-center gap-6 min-[1320px]:gap-10">
            {menuItems
              .filter((item) => item.label !== "Accueil")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`yeseva-one-regular text-[12px] uppercase tracking-[0.18em] transition-opacity duration-300 hover:opacity-60 min-[1320px]:text-sm min-[1320px]:tracking-[0.28em] ${
                    scrolled ? "text-[#111]" : "text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
          </div>

          {/* Hamburger mobile */}
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen(true)}
            className={`flex h-11 w-11 items-center justify-center transition-colors duration-300 min-[1180px]:hidden ${
              scrolled ? "text-[#111]" : "text-white"
            }`}
          >
            <Menu size={30} strokeWidth={1.5} />
          </button>
        </div>
      </nav>
    </>
  );
}
