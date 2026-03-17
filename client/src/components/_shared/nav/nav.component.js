import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const menuItems = [
  { label: "Carte & Menu", href: "/menu" },
  { label: "Réserver", href: "/reservations" },
  { label: "Contact", href: "/contact" },
];

export default function NavComponent({
  isVisible = true,
  scrolled = false,
  logoSrc = "/img/logo.png",
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 z-[59] bg-black/30 transition-all duration-300 tablet:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer mobile */}
      <aside
        className={`fixed right-0 top-0 z-[60] flex h-screen w-[92%] max-w-[420px] flex-col bg-white px-8 pb-10 pt-8 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] tablet:hidden ${
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#111]"
          >
            <X size={22} strokeWidth={1.6} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-7">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-center gap-4 text-[30px] leading-none text-[#111] transition-opacity duration-300 hover:opacity-60"
            >
              <span className="text-[12px] uppercase tracking-[0.28em] text-black/35">
                0{index + 1}
              </span>
              <span className="yeseva-one-regular">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Navbar */}
      <nav
        className={`fixed left-0 top-0 z-[50] w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        } ${scrolled ? "bg-white" : "bg-transparent"}`}
      >
        <div className="flex h-[92px] items-center justify-between px-6 tablet:px-10 desktop:px-12">
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
          <div className="hidden tablet:flex items-center gap-10">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm uppercase tracking-[0.28em] transition-opacity duration-300 hover:opacity-60 ${
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
            className={`flex h-11 w-11 items-center justify-center transition-colors duration-300 tablet:hidden ${
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
