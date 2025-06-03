import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "../../lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [children, setChildren] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (session?.user?.id) {
        const userRef = doc(db, "users", session.user.id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setChildren(data.children || []);
          setPreferences(data.preferences || null);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [session]);

  if (status === "loading" || loading) return <div>Loading dashboard...</div>;
  if (!session) return <div>Please sign in to view your dashboard.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
      {children.length === 0 && (
        <div>No children found. Please complete onboarding.</div>
      )}
      {children.map((child, i) => (
        <div key={i} className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">
            {child.name} ({child.year} {child.class})
          </h2>
          <div>
            Color Tag:{" "}
            <span
              style={{
                display: "inline-block",
                width: 16,
                height: 16,
                background: child.color,
                borderRadius: 4,
                marginLeft: 4,
                verticalAlign: "middle",
              }}
            />
          </div>
          {child.routine && (
            <div className="mt-2">
              <div>
                <b>PE Days:</b> {child.routine.peDays?.join(", ") || "None"}
              </div>
              <div>
                <b>Library Day:</b> {child.routine.libraryDay || "None"}{" "}
                {child.routine.libraryBooks && "📚"}
              </div>
              <div>
                <b>Sport Day:</b> {child.routine.sportDay || "None"}{" "}
                {child.routine.sportUniform && "🏅"}
              </div>
              {child.routine.cca && (
                <div>
                  <b>CCA:</b> {child.routine.cca.name} ({child.routine.cca.day}{" "}
                  {child.routine.cca.time}) at {child.routine.cca.location}{" "}
                  {child.routine.cca.pickup && "🚗"}
                </div>
              )}
              {child.routine.afterSchoolCare &&
                child.routine.afterSchoolCare.length > 0 && (
                  <div>
                    <b>After School Care:</b>{" "}
                    {child.routine.afterSchoolCare.join(", ")}
                  </div>
                )}
              {child.routine.extracurriculars &&
                child.routine.extracurriculars.length > 0 && (
                  <div>
                    <b>Extracurriculars:</b>
                    <ul className="list-disc list-inside">
                      {child.routine.extracurriculars.map(
                        (act: any, idx: number) => (
                          <li key={idx}>
                            {act.name} ({act.day}
                            {act.gear ? `, needs: ${act.gear}` : ""})
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </div>
      ))}
      {preferences && (
        <div className="mt-8 p-4 bg-blue-50 rounded">
          <h2 className="font-semibold mb-2">Parent Preferences</h2>
          <div>
            <b>Apps:</b> {(preferences.apps || []).join(", ") || "None"}
          </div>
          <div>
            <b>Daily Digest:</b>{" "}
            {preferences.preferences?.dailyDigest ? "✅" : "❌"}
          </div>
          <div>
            <b>Weekly Digest:</b>{" "}
            {preferences.preferences?.weeklyDigest ? "✅" : "❌"}
          </div>
          <div>
            <b>Tap-to-Confirm:</b>{" "}
            {preferences.preferences?.tapToConfirm ? "✅" : "❌"}
          </div>
          {children.length > 1 && (
            <div>
              <b>Assign to Both:</b>{" "}
              {preferences.preferences?.assignToBoth ? "✅" : "❌"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
