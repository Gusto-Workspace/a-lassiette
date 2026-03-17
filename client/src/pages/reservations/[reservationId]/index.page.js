import Head from "next/head";
import ResumeReservationsComponent from "@/components/reservations/resume.reservations.component";

export default function ReservationResumePage({ reservationId }) {
  return (
    <>
      <Head>
        <title>Réservation - A l'Assiette</title>
      </Head>

      <ResumeReservationsComponent
        reservationId={reservationId}
        apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const { reservationId } = context.params;

  return {
    props: {
      reservationId: reservationId || null,
    },
  };
}
