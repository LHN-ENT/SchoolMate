import { useState } from "react";
import { useRouter } from "next/router";

export default function Step1() {
  const router = useRouter();
  const [child, setChild] = useState({
    name: "",
    year: "",
    class: "",
    color: "#004225",
  });

  function handleChange(field, value) {
    setChild((c) => ({ ...c, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Save to localStorage
    localStorage.setItem("childProfile", JSON.stringify(child));
    router.push("/onboarding/step2");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Add Your Child</h2>
      <input required placeholder="Full Name" value={child.name} onChange={e => handleChange("name", e.target.value)} className="input" />
      <input required placeholder="School Year" value={child.year} onChange={e => handleChange("year", e.target.value)} className="input" />
      <input required placeholder="Class (e.g. 3S)" value={child.class} onChange={e => handleChange("class", e.target.value)} className="input" />
      <label>
        Color Tag
        <input type="color" value={child.color} onChange={e => handleChange("color", e.target.value)} />
      </label>
      <button className="btn-primary mt-4" type="submit">
        Next
      </button>
    </form>
  );
}
