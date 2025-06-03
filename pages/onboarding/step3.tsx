import { useState } from "react";
import { useRouter } from "next/router";

const COMMON_APPS = [
  { label: "Gmail (via LachieBot)", value: "gmail" },
  { label: "Toddle", value: "toddle" },
  { label: "Seesaw", value: "seesaw" },
  { label: "SkoolBag", value: "skoolbag" },
];

const MAX_APPS = 5;

export default function Step3() {
  const router = useRouter();
  // Load any child profiles from localStorage (for "assign to both kids" logic)
  const [children, setChildren] = useState(() => {
    // Could be a single child or array
    const one = localStorage.getItem("childProfile");
    const many = localStorage.getItem("children");
    return many ? JSON.parse(many) : one ? [JSON.parse(one)] : [];
  });

  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [otherApps, setOtherApps] = useState<string[]>([]);
  const [otherAppInput, setOtherAppInput] = useState("");
  const [saving, setSaving] = useState(false);

  // Preferences
  const [dailyDigest, setDailyDigest] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [tapToConfirm, setTapToConfirm] = useState(false);
  const [assignToBoth, setAssignToBoth] = useState(false);

  // Gmail sign-in placeholder
  function handleGmailSignin() {
    alert("Gmail sign-in would go here!");
  }

  function toggleApp(app: string) {
    let updated = selectedApps.includes(app)
      ? selectedApps.filter((a) => a !== app)
      : [...selectedApps, app];

    // Limit total apps
    if (updated.length + otherApps.length > MAX_APPS) return;
    setSelectedApps(updated);

    // Gmail sign-in (placeholder)
    if (app === "gmail" && !selectedApps.includes("gmail")) handleGmailSignin();
  }

  function addOtherApp() {
    if (!otherAppInput) return;
    if (
      otherApps.includes(otherAppInput) ||
      selectedApps.length + otherApps.length >= MAX_APPS
    )
      return;
    setOtherApps((apps) => [...apps, otherAppInput]);
    setOtherAppInput("");
  }

  function removeOtherApp(app: string) {
    setOtherApps((apps) => apps.filter((a) => a !== app));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // Save to localStorage for now
    const parentPrefs = {
      apps: [...selectedApps, ...otherApps],
      preferences: {
        dailyDigest,
        weeklyDigest,
        tapToConfirm,
        assignToBoth: children.length > 1 ? assignToBoth : false,
      },
    };
    localStorage.setItem("parentPreferences", JSON.stringify(parentPrefs));

    // In production, save to Firestore here

    setTimeout(() => {
      setSaving(false);
      router.push("/dashboard");
    }, 1000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow rounded space-y-6"
    >
      <h2 className="text-xl font-bold">Apps & Preferences</h2>

      <div>
        <h3 className="font-semibold mb-2">Communication Apps</h3>
        {COMMON_APPS.map((app) => (
          <label key={app.value} className="block mb-2">
            <input
              type="checkbox"
              checked={selectedApps.includes(app.value)}
              onChange={() => toggleApp(app.value)}
              disabled={
                !selectedApps.includes(app.value) &&
                selectedApps.length + otherApps.length >= MAX_APPS
              }
            />{" "}
            {app.label}
          </label>
        ))}
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Other app"
            value={otherAppInput}
            onChange={(e) => setOtherAppInput(e.target.value)}
            className="input"
            disabled={selectedApps.length + otherApps.length >= MAX_APPS}
          />
          <button type="button" className="btn-secondary" onClick={addOtherApp} disabled={selectedApps.length + otherApps.length >= MAX_APPS}>
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {otherApps.map((app) => (
            <span key={app} className="bg-gray-200 px-2 py-1 rounded">
              {app}{" "}
              <button
                type="button"
                onClick={() => removeOtherApp(app)}
                className="text-red-500 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          You can select up to {MAX_APPS} apps.
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Preferences</h3>
        <label className="block mb-2">
          <input
            type="checkbox"
            checked={dailyDigest}
            onChange={() => setDailyDigest((v) => !v)}
          />{" "}
          Daily Digest (7am reminders)
        </label>
        <label className="block mb-2">
          <input
            type="checkbox"
            checked={weeklyDigest}
            onChange={() => setWeeklyDigest((v) => !v)}
          />{" "}
          Weekly Digest (Sunday night summary)
        </label>
        <label className="block mb-2">
          <input
            type="checkbox"
            checked={tapToConfirm}
            onChange={() => setTapToConfirm((v) => !v)}
          />{" "}
          Tap-to-Confirm
        </label>
        {children.length > 1 && (
          <label className="block">
            <input
              type="checkbox"
              checked={assignToBoth}
              onChange={() => setAssignToBoth((v) => !v)}
            />{" "}
            Assign all reminders to both kids
          </label>
        )}
      </div>

      <button
        type="submit"
        className="btn-primary mt-4"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save and Finish"}
      </button>
    </form>
  );
}
