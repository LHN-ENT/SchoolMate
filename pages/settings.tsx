import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Sidebar from '../components/Sidebar'

export default function SettingsPage() {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [prefs, setPrefs] = useState({
    boostedReminders: true,
    tapToConfirm: true
  })

  useEffect(() => {
    const stored = localStorage.getItem('userPreferences')
    if (stored) setPrefs(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(prefs))
  }, [prefs])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleDeleteAccount = async () => {
  localStorage.removeItem('userPreferences')
  localStorage.removeItem('childProfile')
  localStorage.removeItem('reminders')

  await signOut({ callbackUrl: '/' })
}

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* 🔔 Notification Preferences */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[#1C1C1C]">Boosted Reminder Ping (7am)</span>
            <input
              type="checkbox"
              checked={prefs.boostedReminders}
              onChange={() =>
                setPrefs({ ...prefs, boostedReminders: !prefs.boostedReminders })
              }
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#1C1C1C]">Tap-to-Confirm Reminders</span>
            <input
              type="checkbox"
              checked={prefs.tapToConfirm}
              onChange={() =>
                setPrefs({ ...prefs, tapToConfirm: !prefs.tapToConfirm })
              }
              className="w-5 h-5"
            />
          </div>
        </div>

        {/* 👤 Account Controls */}
        <div className="pt-8 border-t border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold">Account Controls</h2>

          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Log Out
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-600 underline block"
          >
            Delete Account
          </button>

          <button
            onClick={() => {
              if (
                confirm(
                  'Are you sure you want to reset your preferences? This will clear all settings and reload the page.'
                )
              ) {
                localStorage.removeItem('userPreferences')
                window.location.reload()
              }
            }}
            className="text-sm text-gray-500 underline block"
          >
            Reset Preferences
          </button>
        </div>

        {/* 🧨 Confirm Delete Modal */}
        {showDeleteModal && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
            <p className="mb-2 font-medium">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
