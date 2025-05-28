// pages/settings.tsx
import { useRouter } from 'next/router'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

export default function SettingsPage() {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/auth/signin')
  }

  const handleDeleteAccount = () => {
    // Placeholder: connect to real delete logic later
    alert('Account deletion is not yet implemented.')
    setShowDeleteModal(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <button
        onClick={handleLogout}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Log Out
      </button>

      <div className="mt-6">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-red-600 underline"
        >
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
          <p className="mb-2">Are you sure you want to delete your account? This action cannot be undone.</p>
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
    </div>
  )
}
