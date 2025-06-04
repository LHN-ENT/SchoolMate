import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// Uncomment and adjust these if you use Firebase for data
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebaseClient";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function getTodayName() {
  return WEEKDAYS[(new Date().getDay() + 6) % 7] || "Mon"; // JS: Sun=0, want Mon=0
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // Replace with your real user/child data fetching logic
  const [userDoc, setUserDoc] = useState<any>(null);

  // DEMO DATA: Replace this with your real data fetch!
  useEffect(() => {
    // Simulate loading and some fake data
    if (status === "loading") return;
    if (!session?.user) {
      router.replace("/auth/signin");
      return;
    }
    setTimeout(() => {
      setUserDoc({
        childProfile: {
          children: [
            {
              name: "Reilly",
              year: "3",
              class: "3S",
              color: "#155244",
              routine: {
                pe: { days: ["Mon", "Wed", "Fri"], bring: "Sports shoes" },
                music: { days: ["Tue", "Thu"], bring: "" },
                library: { days: ["Mon"], bring: "Books" },
                art: { days: [], bring: "" },
                sports: { days: [], bring: "" }
              },
              afterSchoolCare: { days: ["Mon", "Wed", "Fri"], closingTime: "6pm" },
              extracurriculars: [
                { name: "Rugby", days: ["Wed"], start: "3:30", finish: "4:30" }
              ]
            }
          ]
        },
        preferences: {
          dailyDigest: true,
          weeklyDigest: true,
          tapToConfirm: true,
          assignToBoth: false,
          linkedApps: ["Toddle"]
        }
      });
      setLoading(false);
    }, 600);
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-400 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  if (!userDoc?.childProfile?.children?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-blue-700 mb-4">Welcome to SchoolMate</h1>
          <p className="mb-6 text-gray-600">Let's get started by adding your child.</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            onClick={() => router.push("/onboarding")}
          >
            Add Child
          </button>
        </div>
      </div>
    );
  }

  const children = userDoc.childProfile.children;
  const preferences = userDoc.preferences || {};
  const today = getTodayName();

  function renderTodaysAgenda(child: any) {
    const routine = child.routine || {};
    const agenda: string[] = [];
    ["pe", "music", "library", "art", "sports"].forEach((key) => {
      if (routine[key]?.days?.includes(today)) {
        agenda.push(
          `${key.charAt(0).toUpperCase() + key.slice(1)}${routine[key].bring ? ` (Bring: ${routine[key].bring})` : ""}`
        );
      }
    });
    if (child.afterSchoolCare?.days?.includes(today)) {
      agenda.push(`After School Care until ${child.afterSchoolCare.closingTime || "?"}`);
    }
    (child.extracurriculars || []).forEach((ex: any) => {
      if (ex.days?.includes(today)) {
        agenda.push(`${ex.name} (${ex.start}-${ex.finish})`);
      }
    });
    if (agenda.length === 0) {
      return <span className="text-gray-400">Nothing scheduled for today.</span>;
    }
    return (
      <ul className="list-disc ml-5">
        {agenda.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }

  function renderPreferences() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 mt-3">
        <div>Daily Digest: <span className="font-semibold">{preferences.dailyDigest ? "Yes" : "No"}</span></div>
        <div>Weekly Digest: <span className="font-semibold">{preferences.weeklyDigest ? "Yes" : "No"}</span></div>
        <div>Tap to Confirm: <span className="font-semibold">{preferences.tapToConfirm ? "Yes" : "No"}</span></div>
        <div>Assign To Both: <span className="font-semibold">{preferences.assignToBoth ? "Yes" : "No"}</span></div>
        <div className="col-span-2">Linked Apps: <span className="font-semibold">{preferences.linkedApps?.join(", ") || "None"}</span></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2">
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-700 tracking-tight">Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="mt-3 sm:mt-0 bg-gray-200 hover:bg-gray-300 text-blue-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            Log Out
          </button>
        </header>
        <div className="space-y-8">
          {children.map((child: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <div className="flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center border-4"
                  style={{
                    background: child.color,
                    borderColor: "#E0E7FF"
                  }}
                >
                  <span className="text-white text-xl font-bold">{child.name.charAt(0)}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-semibold text-blue-900">{child.name}</span>
                  <span className="text-gray-500">{child.year} {child.class}</span>
                  <span
                    className="inline-block w-4 h-4 rounded border ml-1"
                    style={{ background: child.color }}
                    title="Color Tag"
                  ></span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-blue-700">Today’s Agenda ({today}):</span>
                  <div className="ml-1">{renderTodaysAgenda(child)}</div>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <button
                    onClick={() => router.push(`/onboarding?edit=${idx}`)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => router.push("/calendar")}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded font-medium transition"
                  >
                    View Calendar
                  </button>
                  {/* Add more actions here as needed */}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-10 mb-4">
          <button
            onClick={() => router.push("/onboarding")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Edit Children
          </button>
          <button
            onClick={() => router.push("/onboarding?add=1")}
            className="bg-gray-100 hover:bg-gray-200 text-blue-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            Add Child
          </button>
        </div>
        <section className="bg-white rounded-xl shadow p-6 mt-4">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Preferences</h2>
          {renderPreferences()}
        </section>
      </div>
    </div>
  );
}
