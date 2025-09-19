'use client'

import { useEffect, useState } from 'react'

interface Team {
  id: string;
  slug: string;
  name: string;
  description: string;
  created_at: string;
}

interface PitLog {
  id: number;
  team_slug: string;
  driver_name: string;
  car_name: string;
  session_type: string;
  track: string;
  fuel_before_l: number;
  fuel_added_l: number;
  fuel_after_l: number;
  pit_box_time_s: number;
  tire_change: boolean;
  compound_after: string;
  created_at: string;
}

export default function HomePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [pitLogs, setPitLogs] = useState<PitLog[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('slowmo');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch('/api/teams');
        if (!response.ok) throw new Error('Teams laden fehlgeschlagen');
        const data = await response.json();
        setTeams(data);
      } catch (err) {
        console.error('Teams Error:', err);
        setError('Teams konnten nicht geladen werden');
      }
    }
    
    fetchTeams();
  }, []);

  useEffect(() => {
    async function fetchPitLogs() {
      if (!selectedTeam) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/pit-logs?team_slug=${selectedTeam}&limit=10`);
        if (!response.ok) throw new Error('Pit-Logs laden fehlgeschlagen');
        const result = await response.json();
        setPitLogs(result.data || []);
      } catch (err) {
        console.error('Pit-Logs Error:', err);
        setError('Pit-Logs konnten nicht geladen werden');
      } finally {
        setLoading(false);
      }
    }

    fetchPitLogs();
  }, [selectedTeam]);

  const formatTime = (seconds: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return mins > 0 ? `${mins}:${secs.padStart(4, '0')}` : `${secs}s`;
  };

  const formatFuel = (liters: number) => {
    return liters ? `${liters.toFixed(1)}L` : '-';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SMePit Dashboard</h1>
          <p className="text-gray-600">Live iRacing Team Management & Pit Analysis</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Teams</h2>
              <div className="space-y-2">
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <button
                      key={team.slug}
                      onClick={() => setSelectedTeam(team.slug)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedTeam === team.slug
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm opacity-75">{team.description}</div>
                    </button>
                  ))
                ) : (
                  <div className="text-gray-500">Teams werden geladen...</div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Pit-Logs {selectedTeam && `(${selectedTeam})`}
                </h2>
                <div className="text-sm text-gray-500">
                  {pitLogs.length} Einträge
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Pit-Logs werden geladen...
                </div>
              ) : pitLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Fahrer</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Auto</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Strecke</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Session</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">Box-Zeit</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">Fuel +</th>
                        <th className="px-3 py-2 text-center font-medium text-gray-700">Reifen</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Zeit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pitLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{log.driver_name || '-'}</td>
                          <td className="px-3 py-2 text-gray-600">{log.car_name || '-'}</td>
                          <td className="px-3 py-2 text-gray-600">{log.track || '-'}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 text-xs rounded ${
                              log.session_type === 'Race' ? 'bg-red-100 text-red-800' :
                              log.session_type === 'Practice' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {log.session_type || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right font-mono">
                            {formatTime(log.pit_box_time_s)}
                          </td>
                          <td className="px-3 py-2 text-right font-mono">
                            {formatFuel(log.fuel_added_l)}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {log.tire_change ? (
                              <span className="w-3 h-3 bg-green-500 rounded-full inline-block" title="Reifen gewechselt"></span>
                            ) : (
                              <span className="w-3 h-3 bg-gray-300 rounded-full inline-block" title="Keine Reifenänderung"></span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-500 text-xs">
                            {new Date(log.created_at).toLocaleString('de-DE')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-2">Keine Pit-Logs für {selectedTeam}</div>
                  <div className="text-sm text-gray-400">
                    Daten werden über den iRacing Webhook empfangen
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">API Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <code className="px-2 py-1 bg-gray-100 rounded">GET /api/teams</code>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <code className="px-2 py-1 bg-gray-100 rounded">GET /api/pit-logs</code>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <code className="px-2 py-1 bg-gray-100 rounded">POST /api/iracing/webhook</code>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-600">Teams: {teams.length} • Logs: {pitLogs.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}