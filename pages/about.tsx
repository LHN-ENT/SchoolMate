import Layout from '@/components/Layout'

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-4">
        <h1 className="text-2xl font-bold text-[#004225]">About SchoolMate</h1>
        <p className="text-gray-700 text-sm">
          SchoolMate is a simple, private tool built by parents, for parents. It helps you keep
          track of school reminders, activities, and updates — all in one place.
        </p>
        <p className="text-gray-700 text-sm">
          This app does not sell, store, or share your children’s data. All reminders are stored
          privately and only accessible by you.
        </p>
        <p className="text-gray-700 text-sm">
          Questions or feedback? Reach out anytime to the creator via the contact options in your
          dashboard.
        </p>
      </div>
    </Layout>
  )
}
