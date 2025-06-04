import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Welcome() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 max-w-xl w-full flex flex-col items-center">
        <img
          src="/schoolmate-logo.svg"
          alt="SchoolMate Logo"
          className="mb-4 w-20 h-20"
        />
        <h1 className="text-4xl font-bold text-blue-700 mb-3 text-center">
          Welcome to SchoolMate!
        </h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          The modern, simple way to manage and track your child's school life. Get organized, stay in the loop, and never miss a beat.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-xl font-semibold text-lg shadow"
          onClick={() => router.push("/onboarding")}
        >
          Get Started
        </button>
        <div className="mt-6 text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/api/auth/signin" className="text-blue-600 underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
