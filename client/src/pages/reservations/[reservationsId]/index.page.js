import Head from "next/head";
import ResumeReservationsComponent from "@/components/reservations/resume.reservations.component";

export default function ReservationResumePage() {
  return (
    <>
      <Head>
        <title>Réservation - A l'Assiette</title>
      </Head>

      <ResumeReservationsComponent
        apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
      />
    </>
  );
}