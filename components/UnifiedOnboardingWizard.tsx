import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

// ----- Types -----
type Routine = {
  peDays: string[];
  libraryDay: string;
  libraryBooks: boolean;
  sportDay: string;
  sportUniform: boolean;
  ccaOn: boolean;
  cca: { name: string; day: string; time: string; location: string; pickup: boolean };
  afterCareOn: boolean;
  afterSchoolCare: string[];
  extracurriculars: { name: string; day: string; gear: string }[];
};

type ChildProfile = {
  name: string;
  year: string;
  class: string;
  color: string;
  routine: Routine;
};

type ParentPreferences = {
  dailyDigest: boolean;
  weeklyDigest: boolean;
  tapToConfirm: boolean;
  assignToBoth: boolean;
  linkedApps: string[];
};

import React, { useState } from "react";

// --- Section helpers ---
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
function WeekdayCheckboxes({ selected, onChange }: { selected: string[], onChange: (days: string[]) => void }) {
  function toggle(day: string) {
    const set = new Set(selected);
    set.has(day) ? set.delete(day) : set.add(day);
    onChange(Array.from(set));
  }
  return (
    <div className="flex gap-2 flex-wrap">
      {weekdays.map(d => (
        <label key={d} className="inline-flex items-center mr-2">
          <input type="checkbox" checked={selected.includes(d)} onChange={() => toggle(d)} />
          {d}
        </label>
      ))}
    </div>
  );
}

function ChildForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: any;
  onSave: (child: any) => void;
  onCancel?: () => void;
}) {
  // --- Section 1: Basic Info ---
  const [name, setName] = useState(initial?.name || "");
  const [year, setYear] = useState(initial?.year || "");
  const [className, setClassName] = useState(initial?.class || "");
  const [color, setColor] = useState(initial?.color || "#004225");

  // --- Section 2: Routine (Activities) ---
  // Each activity: days[], bring
  const [routine, setRoutine] = useState(() => {
    const base = initial?.routine || {};
    return {
      pe: { days: base.pe?.days || [], bring: base.pe?.bring || "" },
      music: { days: base.music?.days || [], bring: base.music?.bring || "" },
      library: { days: base.library?.days || [], bring: base.library?.bring || "" },
      art: { days: base.art?.days || [], bring: base.art?.bring || "" },
      sports: { days: base.sports?.days || [], bring: base.sports?.bring || "" },
      afterSchoolCare: {
        days: base.afterSchoolCare?.days || [],
        closingTime: base.afterSchoolCare?.closingTime || "",
      },
      extracurriculars: base.extracurriculars || [],
    };
  });

  // --- Section 4: Extracurriculars ---
  const [extraName, setExtraName] = useState("");
  const [extraDays, setExtraDays] = useState<string[]>([]);
  const [extraStart, setExtraStart] = useState("");
  const [extraFinish, setExtraFinish] = useState("");

  // --- Update helpers ---
  function updateRoutineField(activity: string, key: string, value: any) {
    setRoutine((prev: any) => ({
      ...prev,
      [activity]: { ...prev[activity], [key]: value },
    }));
  }
  // Extracurriculars
  function addExtracurricular() {
    if (!extraName || extraDays.length === 0 || !extraStart || !extraFinish) return;
    setRoutine((prev: any) => ({
      ...prev,
      extracurriculars: [
        ...prev.extracurriculars,
        { name: extraName, days: extraDays, start: extraStart, finish: extraFinish },
      ],
    }));
    setExtraName(""); setExtraDays([]); setExtraStart(""); setExtraFinish("");
  }
  function removeExtracurricular(idx: number) {
    setRoutine((prev: any) => ({
      ...prev,
      extracurriculars: prev.extracurriculars.filter((_: any, i: number) => i !== idx),
    }));
  }

  // --- Submit ---
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ name, year, class: className, color, routine });
  }

  // --- UI ---
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Basic Info */}
      <section>
        <h2 className="text-xl font-bold text-[#004225] mb-3">Child Details</h2>
        <div className="flex gap-4 flex-wrap items-end">
          <div>
            <label className="block font-medium">Name</label>
            <input required className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium">Year</label>
            <input required className="input" value={year} onChange={e => setYear(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium">Class</label>
            <input required className="input" value={className} onChange={e => setClassName(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium">Color Tag</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
          </div>
        </div>
      </section>

      {/* Section 2: Routine Activities */}
      <section>
        <h3 className="font-semibold text-lg mb-2">Routine</h3>
        {["pe", "music", "library", "art", "sports"].map(activity => (
          <div key={activity} className="mb-2">
            <label className="font-medium capitalize">{activity} Days</label>
            <WeekdayCheckboxes
              selected={routine[activity].days}
              onChange={days => updateRoutineField(activity, "days", days)}
            />
            <input
              className="input mt-1 ml-2"
              placeholder="Bring (optional)"
              value={routine[activity].bring}
              onChange={e => updateRoutineField(activity, "bring", e.target.value)}
            />
          </div>
        ))}
      </section>

      {/* Section 3: After School Care */}
      <section>
        <h3 className="font-semibold text-lg mb-2">After School Care</h3>
        <WeekdayCheckboxes
          selected={routine.afterSchoolCare.days}
          onChange={days => setRoutine((prev: any) => ({
            ...prev,
            afterSchoolCare: { ...prev.afterSchoolCare, days }
          }))}
        />
        <input
          className="input mt-1 ml-2"
          placeholder="Closing Time (e.g. 6:30pm)"
          value={routine.afterSchoolCare.closingTime}
          onChange={e => setRoutine((prev: any) => ({
            ...prev,
            afterSchoolCare: { ...prev.afterSchoolCare, closingTime: e.target.value }
          }))}
        />
      </section>

      {/* Section 4: Extracurriculars */}
      <section>
        <h3 className="font-semibold text-lg mb-2">Extracurriculars</h3>
        <div className="mb-2">
          {routine.extracurriculars.map((ex: any, i: number) => (
            <div key={i} className="flex items-center gap-2 mb-1">
              <span>
                {ex.name} ({ex.days.join(", ")}) {ex.start}-{ex.finish}
              </span>
              <button type="button" className="btn-danger text-xs" onClick={() => removeExtracurricular(i)}>Remove</button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-end">
          <input
            placeholder="Name"
            value={extraName}
            className="input w-24"
            onChange={e => setExtraName(e.target.value)}
          />
          <WeekdayCheckboxes selected={extraDays} onChange={setExtraDays} />
          <input
            placeholder="Start"
            value={extraStart}
            className="input w-16"
            onChange={e => setExtraStart(e.target.value)}
          />
          <input
            placeholder="Finish"
            value={extraFinish}
            className="input w-16"
            onChange={e => setExtraFinish(e.target.value)}
          />
          <button type="button" className="btn-primary text-xs" onClick={addExtracurricular}>
            Add
          </button>
        </div>
      </section>

      {/* Section 5: Actions */}
      <section className="flex gap-3 mt-4">
        <button type="submit" className="btn-primary">Save Child</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </section>
    </form>
  );
}

// Parent preferences step
function PreferencesForm({
  preferences,
  setPreferences,
  canAssignToBoth,
  onNext,
}: {
  preferences: ParentPreferences;
  setPreferences: (p: ParentPreferences) => void;
  canAssignToBoth: boolean;
  onNext: () => void;
}) {
  function toggle(field: keyof ParentPreferences) {
    setPreferences({ ...preferences, [field]: !preferences[field] });
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Parent Preferences</h2>
      <label>
        <input
          type="checkbox"
          checked={preferences.dailyDigest}
          onChange={() => toggle("dailyDigest")}
        />{" "}
        Receive Daily Digest
      </label>
      <label>
        <input
          type="checkbox"
          checked={preferences.weeklyDigest}
          onChange={() => toggle("weeklyDigest")}
        />{" "}
        Receive Weekly Digest
      </label>
      <label>
        <input
          type="checkbox"
          checked={preferences.tapToConfirm}
          onChange={() => toggle("tapToConfirm")}
        />{" "}
        Tap-to-confirm reminders
      </label>
      {canAssignToBoth && (
        <label>
          <input
            type="checkbox"
            checked={preferences.assignToBoth}
            onChange={() => toggle("assignToBoth")}
          />{" "}
          Assign reminders to both parents
        </label>
      )}
      <button className="btn-primary mt-4" onClick={onNext}>
        Next
      </button>
    </div>
  );
}

// App linking step with Gmail Connect Button
function AppLinkingStep({
  linkedApps,
  setLinkedApps,
  onNext,
}: {
  linkedApps: string[];
  setLinkedApps: (apps: string[]) => void;
  onNext: () => void;
}) {
  function handleGmailConnect() {
    alert("Gmail connect coming soon!");
    if (!linkedApps.includes("gmail")) setLinkedApps([...linkedApps, "gmail"]);
  }
  function toggleApp(app: string) {
    setLinkedApps(
      linkedApps.includes(app)
        ? linkedApps.filter((a) => a !== app)
        : [...linkedApps, app]
    );
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Link School Apps</h2>
      <button
        className="btn-primary"
        style={{
          background: "#4285F4",
          color: "#fff",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: 500,
        }}
        onClick={handleGmailConnect}
        type="button"
      >
        {linkedApps.includes("gmail") ? "Gmail Connected" : "Connect Gmail"}
      </button>
      <div className="text-sm text-gray-500">
        Gmail connect coming soon (Phase 2)
      </div>
      <label>
        <input
          type="checkbox"
          checked={linkedApps.includes("toddle")}
          onChange={() => toggleApp("toddle")}
        />{" "}
        Toddle
      </label>
      <label>
        <input
          type="checkbox"
          checked={linkedApps.includes("seesaw")}
          onChange={() => toggleApp("seesaw")}
        />{" "}
        Seesaw
      </label>
      <label>
        <input
          type="checkbox"
          checked={linkedApps.includes("skoolbag")}
          onChange={() => toggleApp("skoolbag")}
        />{" "}
        SkoolBag
      </label>
      <button className="btn-primary mt-4" onClick={onNext}>
        Next
      </button>
    </div>
  );
}

// New beautiful Review step
function ReviewStep({
  children,
  preferences,
  linkedApps,
  onSubmit,
  loading,
  error,
}: {
  children: any[];
  preferences: any;
  linkedApps: string[];
  onSubmit: () => void;
  loading: boolean;
  error: string;
}) {
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
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-[#004225] mb-2">Review &amp; Finish</h2>
      <div>
        <h3 className="font-semibold text-lg mb-1">Children:</h3>
        {children && children.length > 0 ? (
          children.map((child, idx) => (
            <div key={idx} className="mb-2 p-2 bg-[#F7F7F7] rounded">
              <span className="font-medium">{child.name}</span>{" "}
              <span>({child.year} {child.class})</span>
              <span
                style={{
                  background: child.color,
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  marginLeft: 6,
                  verticalAlign: 'middle'
                }}
                title="Color Tag"
              ></span>
              {child.routine && (
                <div className="ml-2 mt-2 text-sm">
                  {renderRoutine(child.routine)}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">No children added.</div>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">Preferences:</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Daily Digest: <span className="font-medium">{preferences.dailyDigest ? "Yes" : "No"}</span></li>
          <li>Weekly Digest: <span className="font-medium">{preferences.weeklyDigest ? "Yes" : "No"}</span></li>
          <li>Tap to Confirm: <span className="font-medium">{preferences.tapToConfirm ? "Yes" : "No"}</span></li>
          <li>Assign To Both: <span className="font-medium">{preferences.assignToBoth ? "Yes" : "No"}</span></li>
          <li>Linked Apps:
            <span className="font-medium ml-1">
              {linkedApps && linkedApps.length > 0 ? linkedApps.join(', ') : 'None'}
            </span>
          </li>
        </ul>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <button
        className="bg-[#004225] text-white font-semibold rounded px-4 py-2 w-full hover:bg-[#006645] transition"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Finish &amp; Go to Dashboard"}
      </button>
    </div>
  );
}

// ----- Main Wizard -----
export default function UnifiedOnboardingWizard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(0);

  // Children states
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Preferences & apps
  const [preferences, setPreferences] = useState<ParentPreferences>({
    dailyDigest: true,
    weeklyDigest: false,
    tapToConfirm: true,
    assignToBoth: false,
    linkedApps: [],
  });
  const [linkedApps, setLinkedApps] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auth guard
  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECECEC]">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  if (!session || !session.user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECECEC]">
        <p className="text-gray-600">Please sign in to continue onboarding.</p>
      </div>
    );

  // Steps:
  // 0: List children or add first child
  // 1: Add/edit child
  // 2: Preferences
  // 3: App linking
  // 4: Review & finish

  // Child list step
  if (step === 0) {
    return (
      <div className="space-y-6 max-w-xl mx-auto mt-10 bg-white shadow rounded p-8">
        <h2 className="text-2xl font-bold">Your Children</h2>
        {children.length === 0 ? (
          <div>No children added yet.</div>
        ) : (
          <ul>
            {children.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                <span
                  className="inline-block rounded"
                  style={{
                    background: c.color,
                    width: 16,
                    height: 16,
                    marginRight: 6,
                  }}
                ></span>
                <span>
                  {c.name} ({c.year} {c.class})
                </span>
                <button
                  className="btn-secondary text-xs ml-4"
                  onClick={() => {
                    setEditingIndex(i);
                    setStep(1);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-danger text-xs"
                  onClick={() =>
                    setChildren(children.filter((_, j) => j !== i))
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          className="btn-primary"
          onClick={() => {
            setEditingIndex(null);
            setStep(1);
          }}
        >
          Add {children.length === 0 ? "Your Child" : "Another Child"}
        </button>
        {children.length > 0 && (
          <button
            className="btn-primary ml-4"
            onClick={() => setStep(2)}
          >
            Next
          </button>
        )}
      </div>
    );
  }

  // Add/edit child step
  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded p-8">
        <ChildForm
          initial={editingIndex !== null ? children[editingIndex] : undefined}
          onSave={(c) => {
            if (editingIndex !== null) {
              setChildren(
                children.map((child, i) => (i === editingIndex ? c : child))
              );
            } else {
              setChildren([...children, c]);
            }
            setEditingIndex(null);
            setStep(0);
          }}
          onCancel={() => {
            setEditingIndex(null);
            setStep(0);
          }}
        />
      </div>
    );
  }

  // Preferences step
  if (step === 2) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded p-8">
        <PreferencesForm
          preferences={preferences}
          setPreferences={setPreferences}
          canAssignToBoth={children.length > 1}
          onNext={() => setStep(3)}
        />
      </div>
    );
  }

  // App linking step (with Gmail button)
  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded p-8">
        <AppLinkingStep
          linkedApps={linkedApps}
          setLinkedApps={setLinkedApps}
          onNext={() => setStep(4)}
        />
      </div>
    );
  }

  // Review & finish step
  if (step === 4) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded p-8">
        <ReviewStep
          children={children}
          preferences={{ ...preferences, linkedApps }}
          linkedApps={linkedApps}
          loading={loading}
          error={error}
          onSubmit={async () => {
            setLoading(true);
            setError("");
            try {
              await setDoc(
                doc(db, "users", session.user.id),
                {
                  childProfile: { children },
                  preferences: { ...preferences, linkedApps },
                  onboardingCompleted: true,
                  updatedAt: new Date().toISOString(),
                },
                { merge: true }
              );
              router.replace("/dashboard");
            } catch (err) {
              setError("Failed to save. Please try again or contact support.");
              setLoading(false);
            }
          }}
        />
      </div>
    );
  }

  return null;
}
