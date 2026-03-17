import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

// I18N
import { useTranslation } from "next-i18next";

// DATA
import { navItemsData } from "@/_assets/data/_index.data";

export default function NavComponent({ isVisible = true }) {
  const { t } = useTranslation("common");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  function isActive(itemHref) {
    if (router.pathname === "/") {
      return true;
    }
    return router.pathname.startsWith(itemHref) && router.pathname !== "/";
  }

  return (
    <>
      <div
        className={`fixed w-full h-full inset-0 flex justify-center items-center ${
          menuOpen
            ? "bg-black bg-opacity-20 backdrop-blur-sm"
            : "pointer-events-none"
        } transition-bg duration-200 ease-in-out z-20`}
        onClick={() => setMenuOpen(false)}
      />

      <nav
        className={`z-20 fixed top-0 flex justify-between items-center w-full bg-extraWhite drop-shadow-md py-4 desktop:px-12 transition-all duration-250 ${
          isVisible ? "transform translate-y-0" : "transform -translate-y-full"
        }`}
      ></nav>
    </>
  );
}
