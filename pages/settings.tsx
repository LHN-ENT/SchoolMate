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

  const handleDeleteAccount = () => {
    alert('Account deletion is not yet implemented.')
    setShowDeleteModal(false)
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

        {/* 🔓 Logout */}
        <div>
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Log Out
          </button>
        </div>

        {/* 🗑️ Delete Account */}
        <div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-600 underline"
          >
            Delete Account
          </button>
        </div>

        {showDeleteModal && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
            <p className="mb-2">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded mr-2"
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
        )}
        {/* 🧹 Reset Preferences (with confirmation) */}
<div className="mt-6">
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
    className="text-sm text-gray-500 underline"
  >
    Reset Preferences
  </button>
</div>
      </main>
    </div>
  )
}
