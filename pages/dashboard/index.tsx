import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "../../lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import DashboardLayout from "../../components/DashboardLayout";

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

  if (status === "loading" || loading) return <DashboardLayout><div>Loading dashboard...</div></DashboardLayout>;
  if (!session) return <DashboardLayout><div>Please sign in to view your dashboard.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Children Cards */}
        {children.length === 0 && (
          <div className="col-span-2">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded shadow-sm">
              <p className="text-lg font-semibold text-yellow-800">
                No children found. Please complete onboarding.
              </p>
            </div>
          </div>
        )}
        {children.map((child, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow border border-gray-100">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <span>{child.name}</span>
              <span className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded">{child.year} {child.class}</span>
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-600">Color Tag:</span>
              <span
                style={{
                  display: "inline-block",
                  width: 24,
                  height: 24,
                  background: child.color,
                  borderRadius: 6,
                  border: "1px solid #ccc"
                }}
              />
            </div>
            <div className="space-y-1">
              {child.routine && (
                <>
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
                  {child.routine.cca && child.routine.cca.name && (
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
                          {child.routine.extracurriculars.map((e: any, idx: number) => (
                            <li key={idx}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Preferences Card */}
        {preferences && (
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100 md:col-span-2">
            <h3 className="text-lg font-bold mb-3 text-blue-700">Parent Preferences</h3>
            <div className="space-y-1">
              <div>
                <b>Apps:</b> {preferences.apps?.join(", ") || "None"}
              </div>
              <div>
                <b>Daily Digest:</b>{" "}
                {preferences.dailyDigest ? "✅" : "❌"}
              </div>
              <div>
                <b>Weekly Digest:</b>{" "}
                {preferences.weeklyDigest ? "✅" : "❌"}
              </div>
              <div>
                <b>Tap-to-Confirm:</b>{" "}
                {preferences.tapToConfirm ? "✅" : "❌"}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
