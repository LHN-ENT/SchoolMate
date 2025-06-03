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

// ----- Step Components -----
function ChildForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<ChildProfile>;
  onSave: (c: ChildProfile) => void;
  onCancel?: () => void;
}) {
  const [child, setChild] = useState<ChildProfile>({
    name: initial?.name || "",
    year: initial?.year || "",
    class: initial?.class || "",
    color: initial?.color || "#004225",
    routine: initial?.routine || {
      peDays: [],
      libraryDay: "",
      libraryBooks: false,
      sportDay: "",
      sportUniform: false,
      ccaOn: false,
      cca: { name: "", day: "", time: "", location: "", pickup: false },
      afterCareOn: false,
      afterSchoolCare: [],
      extracurriculars: [],
    },
  });
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const [extra, setExtra] = useState({ name: "", day: "", gear: "" });

  function update(field: keyof ChildProfile, value: any) {
    setChild((c) => ({ ...c, [field]: value }));
  }
  function updateRoutine(field: keyof Routine, value: any) {
    setChild((c) => ({
      ...c,
      routine: { ...c.routine, [field]: value },
    }));
  }

  function addExtra() {
    if (!extra.name || !extra.day) return;
    updateRoutine("extracurriculars", [
      ...child.routine.extracurriculars,
      { ...extra },
    ]);
    setExtra({ name: "", day: "", gear: "" });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(child);
      }}
    >
      <h2 className="text-xl font-bold">Add/Edit Child</h2>
      <input
        required
        placeholder="Full Name"
        value={child.name}
        onChange={(e) => update("name", e.target.value)}
        className="input"
      />
      <input
        required
        placeholder="School Year"
        value={child.year}
        onChange={(e) => update("year", e.target.value)}
        className="input"
      />
      <input
        required
        placeholder="Class (e.g. 3S)"
        value={child.class}
        onChange={(e) => update("class", e.target.value)}
        className="input"
      />
      <label>
        Color Tag
        <input
          type="color"
          value={child.color}
          onChange={(e) => update("color", e.target.value)}
        />
      </label>
      <div className="border-t pt-2 mt-2">
        <h3 className="font-semibold">Routine</h3>
        <label>PE Days</label>
        <div className="flex gap-2">
          {weekdays.map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                checked={child.routine.peDays.includes(day)}
                onChange={(e) =>
                  updateRoutine(
                    "peDays",
                    e.target.checked
                      ? [...child.routine.peDays, day]
                      : child.routine.peDays.filter((d) => d !== day)
                  )
                }
              />
              {day}
            </label>
          ))}
        </div>
        <label>
          Library Day
          <select
            value={child.routine.libraryDay}
            onChange={(e) => updateRoutine("libraryDay", e.target.value)}
          >
            <option value="">None</option>
            {weekdays.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <label className="ml-2">
            <input
              type="checkbox"
              checked={child.routine.libraryBooks}
              onChange={(e) =>
                updateRoutine("libraryBooks", e.target.checked)
              }
            />{" "}
            Bring library books
          </label>
        </label>
        <label>
          Sport Day
          <select
            value={child.routine.sportDay}
            onChange={(e) => updateRoutine("sportDay", e.target.value)}
          >
            <option value="">None</option>
            {weekdays.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <label className="ml-2">
            <input
              type="checkbox"
              checked={child.routine.sportUniform}
              onChange={(e) =>
                updateRoutine("sportUniform", e.target.checked)
              }
            />{" "}
            Sport uniform needed
          </label>
        </label>
        <label>
          <input
            type="checkbox"
            checked={child.routine.ccaOn}
            onChange={(e) =>
              updateRoutine("ccaOn", e.target.checked)
            }
          />{" "}
          Has CCA
        </label>
        {child.routine.ccaOn && (
          <div className="pl-4 space-y-1">
            <input
              placeholder="CCA Name"
              value={child.routine.cca.name}
              onChange={(e) =>
                updateRoutine("cca", {
                  ...child.routine.cca,
                  name: e.target.value,
                })
              }
              className="input"
            />
            <select
              value={child.routine.cca.day}
              onChange={(e) =>
                updateRoutine("cca", {
                  ...child.routine.cca,
                  day: e.target.value,
                })
              }
            >
              <option value="">Day</option>
              {weekdays.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <input
              placeholder="Time"
              value={child.routine.cca.time}
              onChange={(e) =>
                updateRoutine("cca", {
                  ...child.routine.cca,
                  time: e.target.value,
                })
              }
              className="input"
            />
            <input
              placeholder="Location"
              value={child.routine.cca.location}
              onChange={(e) =>
                updateRoutine("cca", {
                  ...child.routine.cca,
                  location: e.target.value,
                })
              }
              className="input"
            />
            <label>
              <input
                type="checkbox"
                checked={child.routine.cca.pickup}
                onChange={(e) =>
                  updateRoutine("cca", {
                    ...child.routine.cca,
                    pickup: e.target.checked,
                  })
                }
              />{" "}
              Needs pickup
            </label>
          </div>
        )}
        <label>
          <input
            type="checkbox"
            checked={child.routine.afterCareOn}
            onChange={(e) =>
              updateRoutine("afterCareOn", e.target.checked)
            }
          />{" "}
          After School Care
        </label>
        {child.routine.afterCareOn && (
          <div className="pl-4">
            <label>
              Days (comma separated, e.g. Mon,Wed)
              <input
                value={child.routine.afterSchoolCare.join(",")}
                onChange={(e) =>
                  updateRoutine(
                    "afterSchoolCare",
                    e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean)
                  )
                }
                className="input"
              />
            </label>
          </div>
        )}
        <div>
          <h4>Extracurriculars</h4>
          {child.routine.extracurriculars.map((ex, i) => (
            <div
              key={i}
              className="flex gap-2 items-center border rounded px-2 py-1 my-1"
            >
              <span>
                {ex.name} ({ex.day}) {ex.gear && `- ${ex.gear}`}
              </span>
              <button
                type="button"
                onClick={() =>
                  updateRoutine(
                    "extracurriculars",
                    child.routine.extracurriculars.filter((_, j) => j !== i)
                  )
                }
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex gap-2 items-end">
            <input
              placeholder="Name"
              value={extra.name}
              onChange={(e) =>
                setExtra((x) => ({ ...x, name: e.target.value }))
              }
              className="input w-24"
            />
            <select
              value={extra.day}
              onChange={(e) =>
                setExtra((x) => ({ ...x, day: e.target.value }))
              }
            >
              <option value="">Day</option>
              {weekdays.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <input
              placeholder="Gear"
              value={extra.gear}
              onChange={(e) =>
                setExtra((x) => ({ ...x, gear: e.target.value }))
              }
              className="input w-24"
            />
            <button type="button" onClick={addExtra} className="btn-primary">
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">
          Save Child
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
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

// Review step
function ReviewStep({
  children,
  preferences,
  linkedApps,
  onSubmit,
  loading,
  error,
}: {
  children: ChildProfile[];
  preferences: ParentPreferences;
  linkedApps: string[];
  onSubmit: () => void;
  loading: boolean;
  error: string;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Review & Finish</h2>
      <div>
        <h3 className="font-semibold">Children:</h3>
        <ul>
          {children.map((c, i) => (
            <li key={i}>
              <span style={{ background: c.color, padding: "0 8px" }}>
                {c.name}
              </span>{" "}
              ({c.year} {c.class})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold">Preferences:</h3>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(preferences, null, 2)}
        </pre>
      </div>
      <div>
        <h3 className="font-semibold">Linked Apps:</h3>
        <ul>
          {linkedApps.length === 0 ? <li>None</li> : linkedApps.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <button className="btn-primary" onClick={onSubmit} disabled={loading}>
        {loading ? "Saving..." : "Finish & Go to Dashboard"}
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
                  children,
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
