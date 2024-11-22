import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

export default async function MyRegistrationsPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  const { data: registrations } = await supabase
    .from("registrations")
    .select(
      `
      *,
      events (
        id,
        title,
        date
      )
    `
    )
    .eq("user_id", session.user.id)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Registrations</h1>
        <div className="space-y-6">
          {registrations?.map((registration) => (
            <div
              key={registration.id}
              className="bg-blue-800 bg-opacity-50 p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-2">
                {registration.events.title}
              </h2>
              <p className="text-blue-300 mb-2">
                Date: {new Date(registration.events.date).toLocaleString()}
              </p>
              <p className="text-blue-200 mb-4">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    registration.status === "approved"
                      ? "bg-green-500"
                      : registration.status === "declined"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {registration.status.charAt(0).toUpperCase() +
                    registration.status.slice(1)}
                </span>
              </p>
              <Link
                href={`/events/${registration.events.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
              >
                View Event
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
