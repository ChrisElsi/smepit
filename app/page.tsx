'use client'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">SMePit Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <p className="text-green-600">SMePit System ist bereit für iRacing Integration</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium">Teams API</h3>
              <code className="text-sm">/api/teams</code>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium">Pit-Logs API</h3>
              <code className="text-sm">/api/pit-logs</code>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium">Webhook</h3>
              <code className="text-sm">/api/iracing/webhook</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
