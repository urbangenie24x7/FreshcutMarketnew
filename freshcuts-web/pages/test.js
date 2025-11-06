export default function Test() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-blue-800">FreshCuts Test Page</h1>
        <p className="mt-4 text-gray-600">If you see this, Next.js is working!</p>
        <p className="mt-2 text-sm text-gray-500">
          Environment: {process.env.NODE_ENV}
        </p>
      </div>
    </div>
  )
}