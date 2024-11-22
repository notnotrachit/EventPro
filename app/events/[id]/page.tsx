import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { RegistrationForm } from "@/components/RegistrationForm";


type Params = Promise<{ id: string }>;

export default async function EventPage({ params }: { params: Params }) {
  const supabase = createServerComponentClient({ cookies });
  const pageparams = await params;


  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", pageparams.id)
    .single();

  if (!event) {
    notFound();
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("event_id", event.id);

  const isCreator = session && session.user.id === event.creator_id;

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="text-blue-300 mb-4">
          Date: {new Date(event.date).toLocaleString()}
        </p>
        {/* <p className="text-blue-200 mb-4">Organized by: {event.users.name}</p> */}
        <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Event Description</h2>
          <p>{event.description}</p>
        </div>
        {isCreator && (
          <Link
            href={`/events/${event.id}/manage`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block mb-8"
          >
            Manage Registrations
          </Link>
        )}
        <RegistrationForm
          eventId={event.id}
          questions={questions || []}
          requiresApproval={event.requires_approval}
        />
      </main>
    </div>
  );
}
