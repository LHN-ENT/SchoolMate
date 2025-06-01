import Layout from '@/components/Layout'

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-4">
        <h1 className="text-2xl font-bold text-[#004225]">Privacy Policy</h1>
        <p className="text-gray-700 text-sm">
          SchoolMate does not collect, sell, or share your data — ever.
        </p>
        <p className="text-gray-700 text-sm">
          All reminders, profiles, and preferences are stored securely using Firebase and linked
          only to your private Google login. Your child’s data is never used for advertising or
          analytics.
        </p>
        <p className="text-gray-700 text-sm">
          This app exists solely to help you manage school life. No tracking, no spam, no hidden
          data scraping.
        </p>
        <p className="text-gray-700 text-sm">
          You can delete your account and data at any time via the app’s settings.
        </p>
      </div>
    </Layout>
  )
}
