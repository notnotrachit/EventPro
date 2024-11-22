"use client";

import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface Registration {
  id: number;
  user_id: string;
  status: string;
  users: {
    name: string;
    email: string;
  };
  responses: {
    question_id: number;
    response_text: string;
    questions: {
      question_text: string;
    };
  }[];
}

export function RegistrationList({ eventId }: { eventId: number }) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("* , responses(*, questions(*))" )
      .eq("event_id", eventId)

    if (error) {
      console.error("Error fetching registrations:", error);
    } else {
      setRegistrations(data || []);
    }
  };

  const updateRegistrationStatus = async (
    registrationId: number,
    newStatus: string
  ) => {
    const { error } = await supabase
      .from("registrations")
      .update({ status: newStatus })
      .eq("id", registrationId);

    if (error) {
      console.error("Error updating registration status:", error);
    } else {
      fetchRegistrations();
    }
  };

  return (
    <div className="space-y-6">
      {registrations.map((registration) => (
        <div
          key={registration.id}
          className="bg-blue-800 bg-opacity-50 p-6 rounded-lg shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              {/* <h3 className="text-xl font-semibold">
                {registration.users.name}
              </h3>
              <p className="text-blue-300">{registration.users.email}</p> */}
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded text-sm ${
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
              {registration.status !== "approved" && (
                <button
                  onClick={() =>
                    updateRegistrationStatus(registration.id, "approved")
                  }
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                  Approve
                </button>
              )}
              {registration.status !== "declined" && (
                <button
                  onClick={() =>
                    updateRegistrationStatus(registration.id, "declined")
                  }
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                  Decline
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {registration.responses.map((response) => (
              <div
                key={response.question_id}
                className="bg-blue-900 bg-opacity-50 p-3 rounded"
              >
                <p className="font-semibold">
                  {response.questions.question_text}
                </p>
                <p className="text-blue-200">{response.response_text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
