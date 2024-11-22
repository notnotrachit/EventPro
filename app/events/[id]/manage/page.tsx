import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { RegistrationList } from "@/components/RegistrationList";

type Params = Promise<{ id: string }>;


export default async function ManageEventPage({ params }: { params: Params }) {
  const supabase = createServerComponentClient({ cookies });
  const pageparams = await params;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", pageparams.id)
    .single();

  if (!event) {
    notFound();
  }

  if (event.creator_id !== session.user.id) {
    redirect("/events");
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">
          Manage Registrations: {event.title}
        </h1>
        <RegistrationList eventId={event.id} />
      </main>
    </div>
  );
}
