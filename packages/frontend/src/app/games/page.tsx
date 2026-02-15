'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadGames();
  }, [filter]);

  const loadGames = async () => {
    setLoading(true);
    const response = await api.getGames(filter ? { status: filter } : {});
    if (response.success && response.data) {
      setGames(response.data.items || []);
    }
    setLoading(false);
  };

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
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Browse Games</h1>
          <div className="space-x-2">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded ${
                filter === '' ? 'bg-primary-600 text-white' : 'bg-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('waiting')}
              className={`px-4 py-2 rounded ${
                filter === 'waiting' ? 'bg-primary-600 text-white' : 'bg-white'
              }`}
            >
              Waiting
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded ${
                filter === 'in_progress' ? 'bg-primary-600 text-white' : 'bg-white'
              }`}
            >
              In Progress
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Loading games...</div>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600">No games found</p>
            <Link
              href="/dashboard"
              className="inline-block mt-4 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
            >
              Create a Game
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div key={game.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                <p className="text-gray-600 mb-4">{game.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Players:</span>
                    <span className="font-medium">
                      {game.currentPlayers}/{game.maxPlayers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        game.status === 'waiting'
                          ? 'bg-yellow-100 text-yellow-800'
                          : game.status === 'in_progress'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {game.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created by:</span>
                    <span className="font-medium">{game.createdBy?.displayName}</span>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const response = await api.joinGame(game.id);
                    if (response.success) {
                      loadGames();
                    }
                  }}
                  className="w-full mt-4 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition"
                  disabled={game.currentPlayers >= game.maxPlayers}
                >
                  {game.currentPlayers >= game.maxPlayers ? 'Full' : 'Join Game'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
