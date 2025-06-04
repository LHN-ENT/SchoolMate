import { useState } from "react";
import { useRouter } from "next/router";

const steps = [
  "Welcome",
  "Parent Info",
  "Child Info",
  "Preferences",
  "Review",
];

export default function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [parent, setParent] = useState({ name: "", email: "" });
  const [children, setChildren] = useState([
    { name: "", year: "", class: "" }
  ]);
  const [preferences, setPreferences] = useState({
    dailyDigest: true,
    weeklyDigest: true,
    tapToConfirm: false,
    assignToBoth: false,
    linkedApps: [],
  });

  const router = useRouter();

  // Helper functions:
  function handleChildChange(idx: number, field: string, value: string) {
    setChildren((prev) =>
      prev.map((c, i) =>
        i === idx ? { ...c, [field]: value } : c
      )
    );
  }
  function addChild() {
    setChildren([...children, { name: "", year: "", class: "" }]);
  }
  function removeChild(idx: number) {
    if (children.length === 1) return;
    setChildren(children.filter((_, i) => i !== idx));
  }

  function handlePreferencesChange(field: string, value: any) {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    // TODO: Replace with your backend submit/save logic
    // For demo, just redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-blue-100 to-blue-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl px-6 py-10 md:p-12 my-8">
        {/* Progress bar */}
        <div className="flex items-center mb-8">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${
                  step === i
                    ? "bg-blue-600 text-white"
                    : step > i
                    ? "bg-blue-300 text-white"
                    : "bg-gray-200 text-blue-400"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 rounded ${
                    step > i
                      ? "bg-blue-400"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 0 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-3">Welcome!</h2>
            <p className="mb-4 text-gray-600">
              Let's set up your SchoolMate account.
            </p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-xl font-semibold"
              onClick={() => setStep(step + 1)}
            >
              Get Started
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Parent Info</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Your Name</label>
              <input
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={parent.name}
                onChange={(e) =>
                  setParent({ ...parent, name: e.target.value })
                }
                placeholder="Jane Doe"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={parent.email}
                onChange={(e) =>
                  setParent({ ...parent, email: e.target.value })
                }
                placeholder="jane@email.com"
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-100 text-blue-700 px-6 py-2 rounded-lg font-semibold"
                disabled
              >
                Back
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-2 rounded-lg font-semibold"
                onClick={() => setStep(step + 1)}
                disabled={!parent.name || !parent.email}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Child Info</h2>
            {children.map((child, idx) => (
              <div
                key={idx}
                className="p-4 mb-4 rounded-xl border bg-blue-50/50"
              >
                <div className="mb-2 flex gap-2">
                  <label className="w-1/4 font-medium mt-2">Name</label>
                  <input
                    className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={child.name}
                    onChange={(e) =>
                      handleChildChange(idx, "name", e.target.value)
                    }
                    placeholder="Child's Name"
                  />
                </div>
                <div className="mb-2 flex gap-2">
                  <label className="w-1/4 font-medium mt-2">Year</label>
                  <input
                    className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={child.year}
                    onChange={(e) =>
                      handleChildChange(idx, "year", e.target.value)
                    }
                    placeholder="e.g. 3"
                  />
                </div>
                <div className="mb-2 flex gap-2">
                  <label className="w-1/4 font-medium mt-2">Class</label>
                  <input
                    className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={child.class}
                    onChange={(e) =>
                      handleChildChange(idx, "class", e.target.value)
                    }
                    placeholder="e.g. 3S"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-red-100 text-red-700 px-4 py-1 rounded"
                    onClick={() => removeChild(idx)}
                    disabled={children.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              className="bg-blue-100 text-blue-700 px-4 py-1 rounded font-medium mb-6"
              onClick={addChild}
            >
              + Add Another Child
            </button>
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-100 text-blue-700 px-6 py-2 rounded-lg font-semibold"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-2 rounded-lg font-semibold"
                onClick={() => setStep(step + 1)}
                disabled={
                  children.some((c) => !c.name || !c.year || !c.class)
                }
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Preferences</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.dailyDigest}
                  onChange={(e) =>
                    handlePreferencesChange("dailyDigest", e.target.checked)
                  }
                  id="dailyDigest"
                />
                <label htmlFor="dailyDigest">Daily Digest</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.weeklyDigest}
                  onChange={(e) =>
                    handlePreferencesChange("weeklyDigest", e.target.checked)
                  }
                  id="weeklyDigest"
                />
                <label htmlFor="weeklyDigest">Weekly Digest</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.tapToConfirm}
                  onChange={(e) =>
                    handlePreferencesChange("tapToConfirm", e.target.checked)
                  }
                  id="tapToConfirm"
                />
                <label htmlFor="tapToConfirm">Tap to Confirm</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.assignToBoth}
                  onChange={(e) =>
                    handlePreferencesChange("assignToBoth", e.target.checked)
                  }
                  id="assignToBoth"
                />
                <label htmlFor="assignToBoth">Assign To Both</label>
              </div>
              <div className="mt-3">
                <label className="font-medium mb-1 block">
                  Linked Apps (comma separated)
                </label>
                <input
                  className="w-full border px-3 py-2 rounded-lg"
                  value={preferences.linkedApps.join(", ")}
                  onChange={(e) =>
                    handlePreferencesChange(
                      "linkedApps",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="e.g. Toddle, Seesaw"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-100 text-blue-700 px-6 py-2 rounded-lg font-semibold"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-2 rounded-lg font-semibold"
                onClick={() => setStep(step + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Review & Finish</h2>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="mb-2">
                <span className="font-semibold text-blue-600">Parent:</span> {parent.name} ({parent.email})
              </div>
              <div className="mb-2">
                <span className="font-semibold text-blue-600">Children:</span>
                <ul className="ml-5 list-disc">
                  {children.map((c, i) => (
                    <li key={i}>
                      {c.name} — Year {c.year} {c.class}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-blue-600">Preferences:</span>
                <ul className="ml-5 list-disc">
                  <li>Daily Digest: {preferences.dailyDigest ? "Yes" : "No"}</li>
                  <li>Weekly Digest: {preferences.weeklyDigest ? "Yes" : "No"}</li>
                  <li>Tap to Confirm: {preferences.tapToConfirm ? "Yes" : "No"}</li>
                  <li>Assign To Both: {preferences.assignToBoth ? "Yes" : "No"}</li>
                  <li>
                    Linked Apps:{" "}
                    {preferences.linkedApps.length
                      ? preferences.linkedApps.join(", ")
                      : "None"}
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-100 text-blue-700 px-6 py-2 rounded-lg font-semibold"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-2 rounded-lg font-semibold"
                onClick={handleSubmit}
              >
                Finish & Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
