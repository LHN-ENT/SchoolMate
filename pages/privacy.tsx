export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECECEC] px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl w-full space-y-6 text-gray-800">
        <h1 className="text-3xl font-bold text-[#004225]">Privacy Policy</h1>
        <p>
          SchoolMate was built with your family’s privacy in mind. We do not sell, share, or use your data for advertising. Your information is stored securely and used only to deliver features like reminders, digests, and child-specific scheduling tools.
        </p>
        <p>
          All data remains under your control. You can delete your account and all associated data at any time. No third parties have access to your information — including schools, advertisers, or analytics platforms.
        </p>
        <p>
          Emails are parsed only with your permission, and no content is stored beyond what is needed to display upcoming tasks and reminders.
        </p>
        <p>
          If you have any questions about privacy, contact us directly through the app’s support channel.
        </p>
        <p className="text-sm text-gray-500 mt-6">
          Last updated: June 1, 2025
        </p>
      </div>
    </div>
  )
}
