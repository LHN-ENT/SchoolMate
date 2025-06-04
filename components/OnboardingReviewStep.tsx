import React from 'react';

export default function OnboardingReviewStep({ children, preferences, onFinish }) {
  return (
    <div className="max-w-lg mx-auto mt-8 p-8 bg-white shadow rounded space-y-6">
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
              {preferences.linkedApps && preferences.linkedApps.length > 0 ? preferences.linkedApps.join(', ') : 'None'}
            </span>
          </li>
        </ul>
      </div>
      <button
        className="bg-[#004225] text-white font-semibold rounded px-4 py-2 w-full hover:bg-[#006645] transition"
        onClick={onFinish}
      >
        Finish &amp; Go to Dashboard
      </button>
    </div>
  );
}
