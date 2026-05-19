import Link from "next/link";

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md text-center px-6">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Welcome to ColdMail AI Pro! You now have unlimited email generations.
        </p>
        <Link
          href="/dashboard"
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition inline-block"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
