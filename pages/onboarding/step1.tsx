import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseClient";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function Step1() {
  const router = useRouter();
  const { data: session } = useSession();
  const [adding, setAdding] = useState(false);
  const [showAddAnother, setShowAddAnother] = useState(false);

  const [child, setChild] = useState({
    name: "",
    year: "",
    class: "",
    color: "#004225",
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

  function updateField(field, value) {
    setChild((c) => ({ ...c, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!session?.user?.id) return alert("Not signed in");
    setAdding(true);

    // Prepare extracurriculars
    const extracurriculars = child.extracurriculars || [];
    if (child.extraName && child.extraDay) {
      extracurriculars.push({
        name: child.extraName,
        day: child.extraDay,
        gear: child.extraGear,
      });
    }

    // Prepare CCA if enabled
    const cca = child.ccaOn
      ? {
          name: child.cca.name,
          day: child.cca.day,
          time: child.cca.time,
          location: child.cca.location,
          pickup: child.cca.pickup,
        }
      : undefined;

    // Prepare after school care
    const afterSchoolCare = child.afterCareOn ? child.afterSchoolCare : [];

    // Build child profile object
    const childProfile = {
      name: child.name,
      year: child.year,
      class: child.class,
      color: child.color,
      routine: {
        peDays: child.peDays,
        libraryDay: child.libraryDay,
        libraryBooks: child.libraryBooks,
        sportDay: child.sportDay,
        sportUniform: child.sportUniform,
        cca,
        afterSchoolCare,
        extracurriculars,
      },
    };

    // Get existing
    const userRef = doc(db, "users", session.user.id);
    const userSnap = await getDoc(userRef);
    const existing = userSnap.exists() ? userSnap.data() : {};
    const prevChildren = Array.isArray(existing.children) ? existing.children : [];

    await setDoc(
      userRef,
      { ...existing, children: [...prevChildren, childProfile] },
      { merge: true }
    );

    setAdding(false);
    setShowAddAnother(true);
  }

  function addExtraActivity() {
    if (!child.extraName || !child.extraDay) return;
    setChild((c) => ({
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

  if (showAddAnother)
    return (
      <div className="p-8 flex flex-col items-center">
        <h2>Child added!</h2>
        <button
          className="btn-primary m-2"
          onClick={() => {
            setChild({
              name: "",
              year: "",
              class: "",
              color: "#004225",
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
            setShowAddAnother(false);
          }}
        >
          Add another child
        </button>
        <button
          className="btn-primary m-2"
          onClick={() => router.push("/onboarding/step3")}
        >
          Finish onboarding
        </button>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Add a Child</h2>
      <input required placeholder="Full Name" value={child.name} onChange={e => updateField("name", e.target.value)} className="input" />
      <input required placeholder="School Year" value={child.year} onChange={e => updateField("year", e.target.value)} className="input" />
      <input required placeholder="Class" value={child.class} onChange={e => updateField("class", e.target.value)} className="input" />
      <label>
        Color Tag
        <input type="color" value={child.color} onChange={e => updateField("color", e.target.value)} />
      </label>
      <hr />

      <h3 className="font-semibold">Weekly Routine</h3>
      <label>PE Days</label>
      <div className="flex gap-2">
        {weekdays.map(day => (
          <label key={day}>
            <input
              type="checkbox"
              checked={child.peDays.includes(day)}
              onChange={e =>
                updateField(
                  "peDays",
                  e.target.checked
                    ? [...child.peDays, day]
                    : child.peDays.filter(d => d !== day)
                )
              }
            />
            {day}
          </label>
        ))}
      </div>
      <label>
        Library Day
        <select value={child.libraryDay} onChange={e => updateField("libraryDay", e.target.value)}>
          <option value="">Select</option>
          {weekdays.map(day => <option key={day} value={day}>{day}</option>)}
        </select>
      </label>
      <label>
        <input type="checkbox" checked={child.libraryBooks} onChange={e => updateField("libraryBooks", e.target.checked)} />
        Bring library books?
      </label>
      <label>
        Sport Day
        <select value={child.sportDay} onChange={e => updateField("sportDay", e.target.value)}>
          <option value="">Select</option>
          {weekdays.map(day => <option key={day} value={day}>{day}</option>)}
        </select>
      </label>
      <label>
        <input type="checkbox" checked={child.sportUniform} onChange={e => updateField("sportUniform", e.target.checked)} />
        Requires Sports Uniform
      </label>
      <label>
        <input type="checkbox" checked={child.ccaOn} onChange={e => updateField("ccaOn", e.target.checked)} />
        Enrolled in CCA (after school sport/enrichment)?
      </label>
      {child.ccaOn && (
        <div className="space-y-2">
          <input placeholder="CCA Name" value={child.cca.name} onChange={e => updateField("cca", { ...child.cca, name: e.target.value })} className="input" />
          <select value={child.cca.day} onChange={e => updateField("cca", { ...child.cca, day: e.target.value })}>
            <option value="">Day</option>
            {weekdays.map(day => <option key={day} value={day}>{day}</option>)}
          </select>
          <input placeholder="Time (e.g. 3:30-4:30pm)" value={child.cca.time} onChange={e => updateField("cca", { ...child.cca, time: e.target.value })} className="input" />
          <input placeholder="Location" value={child.cca.location} onChange={e => updateField("cca", { ...child.cca, location: e.target.value })} className="input" />
          <label>
            <input type="checkbox" checked={child.cca.pickup} onChange={e => updateField("cca", { ...child.cca, pickup: e.target.checked })} />
            Pickup Needed?
          </label>
        </div>
      )}
      <label>
        <input type="checkbox" checked={child.afterCareOn} onChange={e => updateField("afterCareOn", e.target.checked)} />
        Goes to After School Care?
      </label>
      {child.afterCareOn && (
        <div className="flex gap-2">
          {weekdays.map(day => (
            <label key={day}>
              <input
                type="checkbox"
                checked={child.afterSchoolCare.includes(day)}
                onChange={e =>
                  updateField(
                    "afterSchoolCare",
                    e.target.checked
                      ? [...child.afterSchoolCare, day]
                      : child.afterSchoolCare.filter(d => d !== day)
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
        {(child.extracurriculars || []).map((act, i) => (
          <div key={i}>
            {act.name} | {act.day} | {act.gear}
          </div>
        ))}
        <div className="flex gap-2">
          <input placeholder="Activity Name" value={child.extraName} onChange={e => updateField("extraName", e.target.value)} className="input" />
          <select value={child.extraDay} onChange={e => updateField("extraDay", e.target.value)}>
            <option value="">Day</option>
            {weekdays.map(day => <option key={day} value={day}>{day}</option>)}
          </select>
          <input placeholder="Gear Needed" value={child.extraGear} onChange={e => updateField("extraGear", e.target.value)} className="input" />
          <button type="button" onClick={addExtraActivity}>Add</button>
        </div>
      </div>
      <button className="btn-primary mt-4" type="submit" disabled={adding}>
        {adding ? "Saving..." : "Save Child"}
      </button>
    </form>
  );
}
