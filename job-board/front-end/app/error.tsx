'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-50 flex items-center justify-center p-4">
      <div className="text-center bg-white p-10 rounded-3xl shadow-2xl max-w-md">
        <div className="text-7xl mb-4">⚠️</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={() => reset()}
          className="btn bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 font-bold rounded-full px-8 py-3 shadow-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

