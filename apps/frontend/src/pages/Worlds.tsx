import { useTranslation } from 'react-i18next';

const Worlds = () => {
  const { t } = useTranslation();

  const mockWorlds = [
    {
      id: '1',
      name: 'Sunset Beach',
      creator: 'WorldBuilder',
      players: 15,
      maxPlayers: 50,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Cyber City',
      creator: 'TechMaster',
      players: 32,
      maxPlayers: 100,
      rating: 4.9,
    },
    {
      id: '3',
      name: 'Fantasy Castle',
      creator: 'MagicCreator',
      players: 8,
      maxPlayers: 30,
      rating: 4.5,
    },
  ];

  return (
    <div className="container-custom py-8">
      <h1 className="text-4xl font-bold mb-8">{t('worlds.title')}</h1>

      <div className="mb-8 flex gap-4">
        <button className="btn-primary">{t('worlds.publicWorlds')}</button>
        <button className="btn-secondary">{t('worlds.myWorlds')}</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWorlds.map((world) => (
          <div key={world.id} className="card hover:shadow-xl transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-6xl">🌍</span>
            </div>
            
            <h3 className="font-bold text-xl mb-2">{world.name}</h3>
            
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">{t('worlds.creator')}:</span> {world.creator}
              </p>
              <p>
                <span className="font-medium">{t('worlds.players')}:</span> {world.players}/{world.maxPlayers}
              </p>
              <p>
                <span className="font-medium">{t('worlds.rating')}:</span> ⭐ {world.rating}
              </p>
            </div>

            <button className="btn-primary w-full">
              {t('worlds.joinWorld')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Worlds;
