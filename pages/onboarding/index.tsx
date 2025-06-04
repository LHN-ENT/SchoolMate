import React, { useState } from "react";
import { useRouter } from "next/router";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const routineTypes = [
  { key: "pe", label: "PE" },
  { key: "music", label: "Music" },
  { key: "library", label: "Library" },
  { key: "art", label: "Art" },
  { key: "sports", label: "Sports" },
];

type Routine = {
  [key: string]: {
    days: string[];
    bring?: string;
  };
};

type Child = {
  name: string;
  year: string;
  class: string;
  color: string;
  routine: Routine;
  afterSchoolCare: {
    days: string[];
    closingTime?: string;
  };
  extracurriculars: {
    name: string;
    days: string[];
    start: string;
    finish: string;
  }[];
};

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // All state in one place for simplicity
  const [child, setChild] = useState<Child>({
    name: "",
    year: "",
    class: "",
    color: "#155244",
    routine: {},
    afterSchoolCare: { days: [], closingTime: "" },
    extracurriculars: [],
  });
  const [activity, setActivity] = useState({ name: "", days: [], start: "", finish: "" });

  // Step 1: Child Details
  const childDetails = (
    <div>
      <h2 className="text-xl font-bold mb-4 text-[#004225]">Child Details</h2>
      <div className="mb-2">
        <label>Name</label>
        <input className="input" value={child.name} onChange={e => setChild({ ...child, name: e.target.value })} />
      </div>
      <div className="mb-2">
        <label>Year</label>
        <input className="input" value={child.year} onChange={e => setChild({ ...child, year: e.target.value })} />
      </div>
      <div className="mb-2">
        <label>Class</label>
        <input className="input" value={child.class} onChange={e => setChild({ ...child, class: e.target.value })} />
      </div>
      <div className="mb-2">
        <label>Color Tag</label>
        <input type="color" value={child.color} onChange={e => setChild({ ...child, color: e.target.value })} />
      </div>
    </div>
  );

  // Step 2: Routine
  const routineStep = (
    <div>
      <h2 className="text-xl font-bold mb-4 text-[#004225]">Routine</h2>
      {routineTypes.map((rt) => (
        <div key={rt.key} className="mb-3">
          <div className="font-medium mb-1">{rt.label}</div>
          <div className="flex gap-2 mb-1">
            {weekdays.map((d) => (
              <label key={d} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={child.routine[rt.key]?.days.includes(d) || false}
                  onChange={e => {
                    const current = child.routine[rt.key]?.days || [];
                    let nextDays = e.target.checked
                      ? [...current, d]
                      : current.filter(day => day !== d);
                    setChild({
                      ...child,
                      routine: {
                        ...child.routine,
                        [rt.key]: {
                          ...child.routine[rt.key],
                          days: nextDays,
                        },
                      },
                    });
                  }}
                />
                {d}
              </label>
            ))}
          </div>
          <div>
            <input
              className="input"
              placeholder={`Bring (optional)`}
              value={child.routine[rt.key]?.bring || ""}
              onChange={e => setChild({
                ...child,
                routine: {
                  ...child.routine,
                  [rt.key]: {
                    ...child.routine[rt.key],
                    bring: e.target.value,
                    days: child.routine[rt.key]?.days || [],
                  }
                }
              })}
            />
          </div>
        </div>
      ))}
    </div>
  );

  // Step 3: After School Care
  const afterSchoolStep = (
    <div>
      <h2 className="text-xl font-bold mb-4 text-[#004225]">After School Care</h2>
      <div className="flex gap-2 mb-2">
        {weekdays.map((d) => (
          <label key={d} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={child.afterSchoolCare.days.includes(d)}
              onChange={e => {
                let next = e.target.checked
                  ? [...child.afterSchoolCare.days, d]
                  : child.afterSchoolCare.days.filter(day => day !== d);
                setChild({
                  ...child,
                  afterSchoolCare: { ...child.afterSchoolCare, days: next }
                });
              }}
            />
            {d}
          </label>
        ))}
      </div>
      <div>
        <input
          className="input"
          placeholder="Closing Time (e.g. 6pm)"
          value={child.afterSchoolCare.closingTime}
          onChange={e => setChild({
            ...child,
            afterSchoolCare: { ...child.afterSchoolCare, closingTime: e.target.value }
          })}
        />
      </div>
    </div>
  );

  // Step 4: Extracurriculars
  const extracurricularStep = (
    <div>
      <h2 className="text-xl font-bold mb-4 text-[#004225]">Extracurriculars</h2>
      <div className="flex gap-2 mb-2">
        <input
          className="input"
          placeholder="Name (e.g. Rugby)"
          value={activity.name}
          onChange={e => setActivity({ ...activity, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Start (e.g. 3:30)"
          value={activity.start}
          onChange={e => setActivity({ ...activity, start: e.target.value })}
        />
        <input
          className="input"
          placeholder="Finish (e.g. 4:30)"
          value={activity.finish}
          onChange={e => setActivity({ ...activity, finish: e.target.value })}
        />
      </div>
      <div className="flex gap-2 mb-2">
        {weekdays.map((d) => (
          <label key={d} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={activity.days?.includes(d) || false}
              onChange={e => {
                const next = e.target.checked
                  ? [...(activity.days || []), d]
                  : (activity.days || []).filter(day => day !== d);
                setActivity({ ...activity, days: next });
              }}
            />
            {d}
          </label>
        ))}
      </div>
      <button
        className="btn-secondary mb-4"
        type="button"
        onClick={() => {
          if (!activity.name) return;
          setChild({
            ...child,
            extracurriculars: [...child.extracurriculars, { ...activity }]
          });
          setActivity({ name: "", days: [], start: "", finish: "" });
        }}
      >
        Add
      </button>
      <ul>
        {child.extracurriculars.map((ex, i) => (
          <li key={i} className="mb-1">
            {ex.name} — {ex.days.join(", ")} {ex.start}-{ex.finish}{" "}
            <button
              type="button"
              className="ml-2 text-red-500 underline"
              onClick={() => setChild({
                ...child,
                extracurriculars: child.extracurriculars.filter((_, idx) => idx !== i)
              })}
            >Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );

  // Step 5: Review
  const reviewStep = (
    <div>
      <h2 className="text-xl font-bold mb-4 text-[#004225]">Review & Finish</h2>
      <div className="mb-4 p-4 bg-[#f7faf7] rounded">
        <strong>{child.name}</strong> ({child.year} {child.class}) <span style={{ background: child.color, display: "inline-block", width: 16, height: 16, borderRadius: 4, marginLeft: 4 }}></span>
        <div className="mt-2">
          <div className="font-medium">Routine:</div>
          <ul className="ml-4">
            {routineTypes.map(rt =>
              child.routine[rt.key]?.days?.length > 0 && (
                <li key={rt.key}>
                  <span className="font-semibold">{rt.label}:</span> {child.routine[rt.key].days.join(", ")}
                  {child.routine[rt.key].bring && <> — <span className="italic">{child.routine[rt.key].bring}</span></>}
                </li>
              )
            )}
            {child.afterSchoolCare.days.length > 0 && (
              <li>
                <span className="font-semibold">After School Care:</span> {child.afterSchoolCare.days.join(", ")}
                {child.afterSchoolCare.closingTime && <> until {child.afterSchoolCare.closingTime}</>}
              </li>
            )}
            {child.extracurriculars.length > 0 && (
              <li>
                <span className="font-semibold">Extracurriculars:</span> {child.extracurriculars.map(ex =>
                  <span key={ex.name}>{ex.name} ({ex.days.join(", ")}, {ex.start}-{ex.finish}) </span>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
      <button
        className="btn-primary w-full"
        onClick={() => router.push("/dashboard")}
      >
        Finish &amp; Go to Dashboard
      </button>
    </div>
  );

  const steps = [
    childDetails,
    routineStep,
    afterSchoolStep,
    extracurricularStep,
    reviewStep
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECECEC]">
      <form
        className="bg-white p-8 shadow rounded max-w-lg w-full"
        onSubmit={e => { e.preventDefault(); setStep(Math.min(steps.length - 1, step + 1)); }}
        autoComplete="off"
      >
        {steps[step]}
        <div className="flex justify-between mt-6">
          {step > 0 && step < steps.length - 1 && (
            <button
              className="btn-secondary"
              type="button"
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          )}
          {step < steps.length - 1 && (
            <button className="btn-primary ml-auto" type="submit">
              Next
            </button>
          )}
        </div>
      </form>
      <style jsx>{`
        .input {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 0.4rem 0.6rem;
          margin-bottom: 0.3rem;
          width: 100%;
        }
        .btn-primary {
          background: #004225;
          color: #fff;
          padding: 0.5rem 1.6rem;
          border-radius: 4px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.1s;
        }
        .btn-primary:hover { background: #155244; }
        .btn-secondary {
          background: #fff;
          color: #004225;
          border: 2px solid #004225;
          padding: 0.5rem 1.6rem;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-secondary:hover { background: #f7faf7; }
      `}</style>
    </div>
  );
}
