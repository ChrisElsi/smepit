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
  const [selectedTeam, setSelectedTeam] = useState<string>('slowmo');
  const [pitLogs, setPitLogs] = useState<PitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Teams laden
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        } else {
          throw new Error('Teams konnten nicht geladen werden');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      }
    };
    
    loadTeams();
  }, []);

  // Pit-Logs laden wenn Team gewechselt wird
  useEffect(() => {
    const loadPitLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/pit-logs?team_slug=${selectedTeam}`);
        if (response.ok) {
          const data = await response.json();
          setPitLogs(data.data || []);
        } else {
          throw new Error('Pit-Logs konnten nicht geladen werden');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      } finally {
        setLoading(false);
      }
    };

    if (selectedTeam) {
      loadPitLogs();
    }
  }, [selectedTeam]);

  // Zeit formatieren
  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = (seconds % 60).toFixed(1);
      return `${minutes}:${remainingSeconds.padStart(4, '0')}`;
    }
    return `${seconds.toFixed(1)}s`;
  };

  // Session-Type mit Farbe
  const getSessionTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'race': return 'bg-red-100 text-red-800';
      case 'practice': return 'bg-green-100 text-green-800';
      case 'qualifying': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">SMePit Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams Panel */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Teams</h2>
            <div className="space-y-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team.slug)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedTeam === team.slug
                      ? 'bg-blue-100 text-blue-900 border-2 border-blue-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-500">{team.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pit-Logs */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Pit-Logs - {teams.find(t => t.slug === selectedTeam)?.name || selectedTeam}
              </h2>
              <div className="text-sm text-gray-500">
                {pitLogs.length} Einträge
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8 text-gray-500">Lade Daten...</div>
            ) : pitLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Keine Pit-Logs für {selectedTeam} vorhanden
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Fahrer</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Auto</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Session</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Strecke</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Box-Zeit</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Fuel</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Reifen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pitLogs.map((log) => (
                      <tr key={log.id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium">{log.driver_name}</td>
                        <td className="py-2 px-3 text-gray-600">{log.car_name}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded text-xs ${getSessionTypeColor(log.session_type)}`}>
                            {log.session_type}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-600">{log.track}</td>
                        <td className="py-2 px-3 font-mono">{formatTime(log.pit_box_time_s)}</td>
                        <td className="py-2 px-3">
                          <div className="text-xs">
                            <div>+{log.fuel_added_l?.toFixed(1)}L</div>
                            <div className="text-gray-500">{log.fuel_after_l?.toFixed(1)}L</div>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3 h-3 rounded-full ${
                                log.tire_change ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            ></span>
                            <span className="text-xs text-gray-600">
                              {log.compound_after}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* API Status */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">API Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Teams API:</strong> 
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded">GET /api/teams</code>
            </div>
            <div>
              <strong>Pit-Logs API:</strong> 
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded">GET /api/pit-logs</code>
            </div>
            <div>
              <strong>Webhook:</strong> 
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded">POST /api/iracing/webhook</code>
            </div>
            <div>
              <strong>Aktives Team:</strong> 
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {selectedTeam}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}