import Link from "next/link";
import { useState, useContext } from "react";

// I18N
import { useTranslation } from "next-i18next";

// DATA
import { footerItemsData } from "@/_assets/data/footer-items.data";

// CONTEXT
import { GlobalContext } from "@/contexts/global.context";

// REACT HOOK FORM
import { useForm } from "react-hook-form";

export default function FormContactCompnent() {
  const { t } = useTranslation("contact");
  const { restaurantContext } = useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact-form-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
      } else {
        console.error("Réponse du serveur: erreur", response);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="">
    
    </section>
  );
}
