import { useTranslation } from 'react-i18next';

const Cosmetics = () => {
  const { t } = useTranslation();

  const mockCosmetics = [
    { id: '1', name: 'Cool Hair', category: 'hair', rarity: 'rare', price: 100 },
    { id: '2', name: 'Fancy Hat', category: 'accessory', rarity: 'epic', price: 250 },
    { id: '3', name: 'Stylish Outfit', category: 'clothing', rarity: 'legendary', price: 500 },
  ];

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-600',
      rare: 'text-blue-600',
      epic: 'text-purple-600',
      legendary: 'text-orange-600',
    };
    return colors[rarity as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-4xl font-bold mb-8">{t('cosmetics.title')}</h1>

      <div className="mb-8 flex gap-4">
        <select className="input max-w-xs">
          <option value="">{t('cosmetics.category')}</option>
          <option value="hair">{t('cosmetics.hair')}</option>
          <option value="clothing">{t('cosmetics.clothing')}</option>
          <option value="accessory">{t('cosmetics.accessory')}</option>
        </select>

        <select className="input max-w-xs">
          <option value="">{t('cosmetics.rarity')}</option>
          <option value="common">{t('cosmetics.common')}</option>
          <option value="rare">{t('cosmetics.rare')}</option>
          <option value="epic">{t('cosmetics.epic')}</option>
          <option value="legendary">{t('cosmetics.legendary')}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockCosmetics.map((cosmetic) => (
          <div key={cosmetic.id} className="card hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">🎨</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{cosmetic.name}</h3>
            <p className={`text-sm font-medium mb-2 ${getRarityColor(cosmetic.rarity)}`}>
              {t(`cosmetics.${cosmetic.rarity}`)}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary-600">{cosmetic.price} 💎</span>
              <button className="btn-primary text-sm">
                {t('cosmetics.purchase')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cosmetics;
