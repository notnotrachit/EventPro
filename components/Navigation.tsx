"use client";

import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter, usePathname } from "next/navigation";

export function Navigation() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="bg-blue-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          EventPro
        </Link>
        <div className="space-x-4">
          <Link
            href="/events"
            className={`hover:text-blue-300 ${
              pathname === "/events" ? "text-blue-300" : ""
            }`}
          >
            Events
          </Link>
          {session ? (
            <>
              <Link
                href="/create-event"
                className={`hover:text-blue-300 ${
                  pathname === "/create-event" ? "text-blue-300" : ""
                }`}
              >
                Create Event
              </Link>
              <Link
                href="/my-registrations"
                className={`hover:text-blue-300 ${
                  pathname === "/my-registrations" ? "text-blue-300" : ""
                }`}
              >
                My Registrations
              </Link>
              <button onClick={handleSignOut} className="hover:text-blue-300">
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className={`hover:text-blue-300 ${
                pathname === "/auth" ? "text-blue-300" : ""
              }`}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
