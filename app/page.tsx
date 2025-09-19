'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Settings, Sun, Moon, Palette } from 'lucide-react';

const Dashboard = () => {
  const [currentTeam, setCurrentTeam] = useState('slowmo');
  const [pitLogs, setPitLogs] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [colorTheme, setColorTheme] = useState('blue');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const themes = {
    blue: {
      primary: 'blue-500',
      secondary: 'blue-600',
      accent: 'blue-400',
      gradient: 'from-blue-600 to-blue-800'
    },
    green: {
      primary: 'green-500',
      secondary: 'green-600', 
      accent: 'green-400',
      gradient: 'from-green-600 to-green-800'
    },
    purple: {
      primary: 'purple-500',
      secondary: 'purple-600',
      accent: 'purple-400', 
      gradient: 'from-purple-600 to-purple-800'
    },
    orange: {
      primary: 'orange-500',
      secondary: 'orange-600',
      accent: 'orange-400',
      gradient: 'from-orange-600 to-orange-800'
    }
  };

  const currentTheme = themes[colorTheme];

  // Mock data für Demo
  useEffect(() => {
    setTeams(['slowmo', 'slowmo2', 'slowmo3']);
    setPitLogs([
      {
        id: '1',
        driver_name: 'Max Test',
        car_name: 'BMW M4 GT3',
        session_type: 'Race',
        track: 'Spa-Francorchamps',
        fuel_before_l: 35.5,
        fuel_added_l: 20.0,
        fuel_after_l: 55.5,
        pit_box_time_s: 28.4,
        tire_change: true,
        compound_after: 'Soft',
        created_at: new Date().toISOString()
      },
      {
        id: '2', 
        driver_name: 'Anna Schmidt',
        car_name: 'Porsche 911 GT3 R',
        session_type: 'Qualifying',
        track: 'Nürburgring GP',
        fuel_before_l: 25.0,
        fuel_added_l: 15.5,
        fuel_after_l: 40.5,
        pit_box_time_s: 32.1,
        tire_change: false,
        compound_after: 'Medium',
        created_at: new Date(Date.now() - 300000).toISOString()
      }
    ]);
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadPitLogs();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, currentTeam]);

  const loadPitLogs = async () => {
    setIsLoading(true);
    try {
      // In echter Implementierung: API-Call
      // const response = await fetch(`/api/pit-logs?team_slug=${currentTeam}`);
      // const data = await response.json();
      // setPitLogs(data);
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error('Fehler beim Laden:', error);
      setIsLoading(false);
    }
  };

  const deletePitLog = async (id) => {
    try {
      const response = await fetch(`/api/pit-logs/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer Chris881hi?jabittellöschen!`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setPitLogs(logs => logs.filter(log => log.id !== id));
        console.log('Eintrag gelöscht:', result.message);
      } else {
        console.error('Delete failed:', response.status);
        alert('Löschen fehlgeschlagen');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Fehler beim Löschen');
    }
  };

  const StatCard = ({ title, value, trend, icon: Icon }) => (
    <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} rounded-xl p-6 transition-all hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          <p className={`text-sm text-${currentTheme.primary}`}>{trend}</p>
        </div>
        {Icon && <Icon className={`w-8 h-8 text-${currentTheme.primary}`} />}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900` 
        : `bg-gradient-to-br from-gray-50 via-white to-gray-50`
    }`}>
      
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white/50'} backdrop-blur sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                SMePit Dashboard
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Team: {currentTeam}
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Theme Selector */}
              <div className="relative">
                <select
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value)}
                  className={`${isDarkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'} border rounded-lg px-3 py-2 text-sm`}
                >
                  <option value="blue">Blau</option>
                  <option value="green">Grün</option>
                  <option value="purple">Lila</option>
                  <option value="orange">Orange</option>
                </select>
              </div>

              {/* Auto-refresh Toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  autoRefresh
                    ? `bg-${currentTheme.primary} text-white`
                    : `${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-200 text-gray-700'} hover:bg-${currentTheme.primary} hover:text-white`
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-gray-200 text-gray-600'} transition-colors`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Team Switcher */}
        <div className="mb-8">
          <div className="flex gap-3">
            {teams.map((team) => (
              <button
                key={team}
                onClick={() => setCurrentTeam(team)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  currentTeam === team
                    ? `bg-gradient-to-r ${currentTheme.gradient} text-white shadow-lg`
                    : `${isDarkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-white/50 text-gray-700'} hover:bg-${currentTheme.primary} hover:text-white`
                }`}
              >
                {team}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Durchschn. Pit-Zeit" value="28.4s" trend="+2.1s" />
          <StatCard title="Gesamt Stops" value="24" trend="+3" />
          <StatCard title="Kraftstoff-Effizienz" value="2.1L/min" trend="-0.3L" />
          <StatCard title="Reifenwechsel" value="18" trend="+5" />
        </div>

        {/* Pit Logs Table */}
        <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} rounded-xl overflow-hidden`}>
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Pit-Stop Protokoll
              </h2>
              <button
                onClick={loadPitLogs}
                disabled={isLoading}
                className={`px-4 py-2 bg-${currentTheme.primary} text-white rounded-lg hover:bg-${currentTheme.secondary} disabled:opacity-50 transition-colors`}
              >
                {isLoading ? 'Lädt...' : 'Aktualisieren'}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100/50'}`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Fahrer</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Fahrzeug</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Session</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Strecke</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Kraftstoff</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Box-Zeit</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Reifen</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Zeit</th>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {pitLogs.map((log, index) => (
                  <tr 
                    key={log.id} 
                    className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} hover:${isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'} transition-colors`}
                  >
                    <td className={`px-4 py-3 ${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                      {log.driver_name}
                    </td>
                    <td className={`px-4 py-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                      {log.car_name}
                    </td>
                    <td className={`px-4 py-3`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.session_type === 'Race' 
                          ? `bg-red-500/20 text-red-400`
                          : log.session_type === 'Qualifying'
                          ? `bg-yellow-500/20 text-yellow-400`
                          : `bg-${currentTheme.primary}/20 text-${currentTheme.accent}`
                      }`}>
                        {log.session_type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm`}>
                      {log.track}
                    </td>
                    <td className={`px-4 py-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                      <div className="text-sm">
                        <div>+{log.fuel_added_l}L</div>
                        <div className="text-xs opacity-70">{log.fuel_before_l}L → {log.fuel_after_l}L</div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${isDarkMode ? 'text-white' : 'text-gray-900'} font-mono`}>
                      {log.pit_box_time_s}s
                    </td>
                    <td className={`px-4 py-3`}>
                      {log.tire_change ? (
                        <div className="text-sm">
                          <div className={`text-${currentTheme.primary}`}>Gewechselt</div>
                          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{log.compound_after}</div>
                        </div>
                      ) : (
                        <span className={`${isDarkMode ? 'text-slate-500' : 'text-gray-400'} text-sm`}>Behalten</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} text-sm`}>
                      {new Date(log.created_at).toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deletePitLog(log.id)}
                        className={`p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors`}
                        title="Eintrag löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pitLogs.length === 0 && (
            <div className={`px-6 py-12 text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Keine Pit-Stop-Daten für Team "{currentTeam}" vorhanden.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;