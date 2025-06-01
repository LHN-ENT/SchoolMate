import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECECEC] px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl w-full space-y-6 text-gray-800">
        <h1 className="text-3xl font-bold text-[#004225]">About SchoolMate</h1>
        <p>
          SchoolMate was built by parents, for parents. We know how hard it is to juggle school notices, emails, calendars, and last-minute events — especially when you’ve got more than one child.
        </p>
        <p>
          Our mission is to simplify school communication and help families stay organised without the chaos. From daily reminders to digest summaries and smart automation, SchoolMate is your digital assistant for school admin.
        </p>
        <p>
          We take privacy seriously. You can read more about how we protect your data in our{' '}
          <Link href="/privacy" className="text-[#004225] underline hover:text-[#00331b]">Privacy Policy</Link>.
        </p>
        <p className="text-sm text-gray-500 mt-6">
          Made with ❤️ by parents in Singapore & Australia.
        </p>
      </div>
    </div>
  )
}
