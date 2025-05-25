export default function Dashboard({ hideSetup }) {
  return <div className="p-6">
    {!hideSetup && <div className="mb-4 p-4 bg-yellow-100">Complete your setup to see dashboard</div>}
    <h2 className="text-xl font-bold mb-2">Reminders</h2>
    <ul className="list-disc pl-5 text-gray-700">
      <li>No reminders yet (placeholder)</li>
    </ul>
  </div>
}
