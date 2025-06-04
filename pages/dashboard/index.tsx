import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.replace("/auth/signin");
      return;
    }
    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", session.user.id);
        const snap = await getDoc(userRef);
        setUserDoc(snap.exists() ? snap.data() : null);
      } catch (err) {
        setUserDoc(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECECEC]">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }
  if (!userDoc || !userDoc.childProfile || !userDoc.childProfile.children) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#ECECEC]">
        <div className="bg-white p-8 shadow rounded text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#004225]">No Profile Found</h2>
          <p className="mb-4">Please complete onboarding to view your dashboard.</p>
          <button
            className="btn-primary"
            onClick={() => router.replace("/onboarding")}
          >
            Go to Onboarding
          </button>
        </div>
      </div>
    );
  }

  const children = userDoc.childProfile.children || [];
  const preferences = userDoc.preferences || {};

  // Helper to render routine activities
  function renderRoutine(routine: any) {
    const activities = ["pe", "music", "library", "art", "sports"];
    return (
      <ul className="list-disc ml-6">
        {activities.map(act => (
          routine[act]?.days?.length > 0 && (
            <li key={act} className="mb-1">
              <span className="font-medium capitalize">{act}:</span> {routine[act].days.join(", ")}
              {routine[act].bring && <> — <span className="italic text-gray-600">{routine[act].bring}</span></>}
            </li>
          )
        ))}
        {routine.afterSchoolCare?.days?.length > 0 && (
          <li>
            <span className="font-medium">After School Care:</span> {routine.afterSchoolCare.days.join(", ")}
            {routine.afterSchoolCare.closingTime && <> until {routine.afterSchoolCare.closingTime}</>}
          </li>
        )}
        {routine.extracurriculars?.length > 0 && (
          <li>
            <span className="font-medium">Extracurriculars:</span>
            <ul className="ml-3">
              {routine.extracurriculars.map((ex: any, i: number) => (
                <li key={i}>
                  {ex.name} ({ex.days.join(", ")}) {ex.start}-{ex.finish}
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow rounded p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#004225]">Dashboard</h1>
      {children.length === 0 ? (
        <div>No children found. <a href="/onboarding" className="underline text-blue-600">Add your child</a>.</div>
      ) : (
        children.map((child: any, idx: number) => (
          <div key={idx} className="mb-8 p-4 border-b last:border-b-0">
            <div className="mb-2 flex items-center">
              <span className="font-semibold text-lg">{child.name}</span>
              <span className="ml-2 text-sm text-gray-500">({child.year} {child.class})</span>
              <span
                className="ml-2"
                style={{
                  background: child.color,
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  borderRadius: 4
                }}
                title="Color Tag"
              ></span>
            </div>
            {child.routine && (
              <div className="mb-2">
                <div className="font-medium">Routine:</div>
                {renderRoutine(child.routine)}
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex gap-3 mt-3">
              <button className="btn-primary" disabled>
                Sign In
              </button>
              <button className="btn-primary" disabled>
                Sign Out
              </button>
              <button className="btn-secondary" disabled>
                View Calendar
              </button>
            </div>
          </div>
        ))
      )}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Preferences</h2>
        <ul className="list-disc ml-6">
          <li>Daily Digest: <span className="font-medium">{preferences.dailyDigest ? "Yes" : "No"}</span></li>
          <li>Weekly Digest: <span className="font-medium">{preferences.weeklyDigest ? "Yes" : "No"}</span></li>
          <li>Tap to Confirm: <span className="font-medium">{preferences.tapToConfirm ? "Yes" : "No"}</span></li>
          <li>Assign To Both: <span className="font-medium">{preferences.assignToBoth ? "Yes" : "No"}</span></li>
          <li>Linked Apps:
            <span className="font-medium ml-1">
              {preferences.linkedApps && preferences.linkedApps.length > 0
                ? preferences.linkedApps.join(', ')
                : 'None'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
