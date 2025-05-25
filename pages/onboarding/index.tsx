import OnboardingForm from '@/components/OnboardingForm'

export default function OnboardingPage() {
  return <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">Welcome to SchoolMate</h1>
      <OnboardingForm />
    </div>
  </div>
}
