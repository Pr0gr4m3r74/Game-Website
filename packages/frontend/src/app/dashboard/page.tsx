'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [gameForm, setGameForm] = useState({
    name: '',
    description: '',
    maxPlayers: 4,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const response = await api.getProfile();
    if (response.success) {
      setProfile(response.data);
    } else {
      router.push('/login');
    }
    setLoading(false);
  };

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await api.createGame(gameForm);
    if (response.success) {
      setShowCreateGame(false);
      setGameForm({ name: '', description: '', maxPlayers: 4 });
      router.push('/games');
    }
  };

  const handleLogout = () => {
    api.logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🎮 PlayVerse
          </Link>
          <nav className="space-x-4">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/games" className="hover:underline">
              Games
            </Link>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile?.displayName}</h1>
              <p className="text-gray-600">@{profile?.username}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary-600">Lv. {profile?.level}</div>
              <div className="text-sm text-gray-500">{profile?.experience} XP</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {profile?.friendCount || 0}
              </div>
              <div className="text-sm text-gray-600">Friends</div>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {profile?.gamesPlayed || 0}
              </div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {profile?.achievements?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowCreateGame(true)}
                className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition"
              >
                Create New Game
              </button>
              <Link
                href="/games"
                className="block w-full bg-white text-primary-600 border-2 border-primary-600 py-3 rounded-md hover:bg-primary-50 transition text-center"
              >
                Browse Games
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Achievements</h2>
            <div className="space-y-2">
              {profile?.achievements && profile.achievements.length > 0 ? (
                profile.achievements.map((achievement: any) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <div className="font-semibold">{achievement.name}</div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No achievements yet. Start playing to earn some!</p>
              )}
            </div>
          </div>
        </div>

        {showCreateGame && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create New Game</h2>
              <form onSubmit={handleCreateGame} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Game Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={gameForm.name}
                    onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    value={gameForm.description}
                    onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Players</label>
                  <input
                    type="number"
                    required
                    min="2"
                    max="10"
                    className="w-full px-3 py-2 border rounded-md"
                    value={gameForm.maxPlayers}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, maxPlayers: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateGame(false)}
                    className="flex-1 bg-gray-200 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
