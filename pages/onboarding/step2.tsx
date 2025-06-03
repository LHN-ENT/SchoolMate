import { useState } from "react";
import { useRouter } from "next/router";
import { addChild } from "../lib/childrenHelpers";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function Step2() {
  const router = useRouter();
  const [routine, setRoutine] = useState({
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
    extraName: "",
    extraDay: "",
    extraGear: "",
  });
  const [done, setDone] = useState(false);

  function updateField(field: string, value: any) {
    setRoutine((c) => ({ ...c, [field]: value }));
  }

  function addExtraActivity() {
    if (!routine.extraName || !routine.extraDay) return;
    setRoutine((c) => ({
      ...c,
      extracurriculars: [
        ...(c.extracurriculars || []),
        { name: c.extraName, day: c.extraDay, gear: c.extraGear },
      ],
      extraName: "",
      extraDay: "",
      extraGear: "",
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Merge with step1 childProfile
    const child = JSON.parse(localStorage.getItem("childProfile") || "{}");
    child.routine = {
      peDays: routine.peDays,
      libraryDay: routine.libraryDay,
      libraryBooks: routine.libraryBooks,
      sportDay: routine.sportDay,
      sportUniform: routine.sportUniform,
      cca: routine.ccaOn ? routine.cca : undefined,
      afterSchoolCare: routine.afterCareOn ? routine.afterSchoolCare : [],
      extracurriculars: routine.extracurriculars,
    };
    addChild(child);
    setDone(true);
  }

  function handleAddAnother() {
    localStorage.removeItem("childProfile");
    router.push("/onboarding/step1");
  }

  function handleContinue() {
    localStorage.removeItem("childProfile");
    router.push("/onboarding/step3");
  }

  if (done)
    return (
      <div className="p-8 flex flex-col items-center">
        <h2>Child added!</h2>
        <button className="btn-primary m-2" onClick={handleAddAnother}>
          Add another child
        </button>
        <button className="btn-primary m-2" onClick={handleContinue}>
          Continue to preferences
        </button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">School Life Details</h2>
      <label>PE Days</label>
      <div className="flex gap-2">
        {weekdays.map(day => (
          <label key={day}>
            <input
              type="checkbox"
              checked={routine.peDays.includes(day)}
              onChange={e =>
                updateField(
                  "peDays",
                  e.target.checked
                    ? [...routine.peDays, day]
                    : routine.peDays.filter(d => d !== day)
                )
              }
            />
            {day}
          </label>
        ))}
      </div>
      <label>
        Library Day
        <select value={routine.libraryDay} onChange={e => updateField("libraryDay", e.target.value)}>
          <option value="">Select</option>
          {weekdays.map(day => <option key={day} value={day}>{day}</option>)}
        </select>
      </label>
      <label>
        <input type="checkbox" checked={routine.libraryBooks} onChange={e => updateField("libraryBooks", e.target.checked)} />
        Bring library books?
      </label>
      <label>
        Sport Day
        <select value={routine.sportDay} onChange={e => updateField("sportDay", e.target.value)}>
          <option value="">Select</option>
          {weekdays.map(day => <option key={day} value={day}>{day}</option>)}
        </select>
      </label>
      <label>
        <input type="checkbox" checked={routine.sportUniform} onChange={e => updateField("sportUniform", e.target.checked)} />
        Requires Sports Uniform
      </label>
      <label>
        <input type="checkbox" checked={routine.ccaOn} onChange={e => updateField("ccaOn", e.target.checked)} />
        Enrolled in CCA (after school sport/enrichment)?
      </label>
      {routine.ccaOn && (
        <div className="space-y-2">
          <input placeholder="CCA Name" value={routine.cca.name} onChange={e => updateField("cca", { ...routine.cca, name: e.target.value })} className="input" />
          <select value={routine.cca.day} onChange={e => updateField("cca", { ...routine.cca, day: e.target.value })}>
            <option value="">Day</option>
            {weekdays.map(day => <option key={day} value={day}>{day}</option>)}
          </select>
          <input placeholder="Time (e.g. 3:30-4:30pm)" value={routine.cca.time} onChange={e => updateField("cca", { ...routine.cca, time: e.target.value })} className="input" />
          <input placeholder="Location" value={routine.cca.location} onChange={e => updateField("cca", { ...routine.cca, location: e.target.value })} className="input" />
          <label>
            <input type="checkbox" checked={routine.cca.pickup} onChange={e => updateField("cca", { ...routine.cca, pickup: e.target.checked })} />
            Pickup Needed?
          </label>
        </div>
      )}
      <label>
        <input type="checkbox" checked={routine.afterCareOn} onChange={e => updateField("afterCareOn", e.target.checked)} />
        Goes to After School Care?
      </label>
      {routine.afterCareOn && (
        <div className="flex gap-2">
          {weekdays.map(day => (
            <label key={day}>
              <input
                type="checkbox"
                checked={routine.afterSchoolCare.includes(day)}
                onChange={e =>
                  updateField(
                    "afterSchoolCare",
                    e.target.checked
                      ? [...routine.afterSchoolCare, day]
                      : routine.afterSchoolCare.filter(d => d !== day)
                  )
                }
              />
              {day}
            </label>
          ))}
        </div>
      )}
      <hr />
      <h3>Extracurricular Activities</h3>
      <div className="flex flex-col gap-2">
        {(routine.extracurriculars || []).map((act, i) => (
          <div key={i}>
            {act.name} | {act.day} | {act.gear}
          </div>
        ))}
        <div className="flex gap-2">
          <input placeholder="Activity Name" value={routine.extraName} onChange={e => updateField("extraName", e.target.value)} className="input" />
          <select value={routine.extraDay} onChange={e => updateField("extraDay", e.target.value)}>
            <option value="">Day</option>
            {weekdays.map(day => <option key={day} value={day}>{day}</option>)}
          </select>
          <input placeholder="Gear Needed" value={routine.extraGear} onChange={e => updateField("extraGear", e.target.value)} className="input" />
          <button type="button" onClick={addExtraActivity}>Add</button>
        </div>
      </div>
      <button className="btn-primary mt-4" type="submit">
        Save Child
      </button>
    </form>
  );
}
