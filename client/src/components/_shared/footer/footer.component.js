import Link from "next/link";
import { useContext } from "react";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

// I18N
import { useTranslation } from "next-i18next";

// DATA
import { footerItemsData } from "@/_assets/data/footer-items.data";
import { navItemsData } from "@/_assets/data/nav-items.data";

export default function FooterComponent() {
  const { t } = useTranslation("");
  const { restaurantContext } = useContext(GlobalContext);

  return (
    <footer className="">
     
    </footer>
  );
}
