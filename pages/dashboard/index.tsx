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
                <ul className="ml-6 list-disc">
                  {child.routine.peDays && child.routine.peDays.length > 0 && (
                    <li>PE Days: {child.routine.peDays.join(', ')}</li>
                  )}
                  {child.routine.libraryDay && (
                    <li>Library Day: {child.routine.libraryDay}</li>
                  )}
                  {child.routine.libraryBooks && (
                    <li>Bring Library Books: Yes</li>
                  )}
                  {child.routine.sportDay && (
                    <li>Sport Day: {child.routine.sportDay}</li>
                  )}
                  {child.routine.sportUniform && (
                    <li>Sport Uniform Needed: Yes</li>
                  )}
                  {child.routine.ccaOn && child.routine.cca && child.routine.cca.name && (
                    <li>
                      CCA: {child.routine.cca.name} ({child.routine.cca.day} {child.routine.cca.time}) at {child.routine.cca.location} {child.routine.cca.pickup ? "(Needs Pickup)" : ""}
                    </li>
                  )}
                  {child.routine.afterCareOn && (
                    <li>
                      After School Care: {child.routine.afterSchoolCare && child.routine.afterSchoolCare.length > 0
                        ? child.routine.afterSchoolCare.join(", ")
                        : "Yes"}
                    </li>
                  )}
                  {child.routine.extracurriculars && child.routine.extracurriculars.length > 0 && (
                    <li>
                      Extracurriculars:
                      <ul className="ml-6">
                        {child.routine.extracurriculars.map((x: any, i: number) => (
                          <li key={i}>
                            {x.name} ({x.day}){x.gear ? ` - Gear: ${x.gear}` : ""}
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>
              </div>
            )}
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
