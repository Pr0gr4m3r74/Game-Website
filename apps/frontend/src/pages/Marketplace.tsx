import { useTranslation } from 'react-i18next';

const Marketplace = () => {
  const { t } = useTranslation();

  const mockListings = [
    { id: '1', cosmetic: 'Rare Sword', seller: 'Player123', price: 150, quantity: 1 },
    { id: '2', cosmetic: 'Epic Shield', seller: 'GamerPro', price: 300, quantity: 2 },
    { id: '3', cosmetic: 'Legendary Wings', seller: 'MasterTrader', price: 1000, quantity: 1 },
  ];

  return (
    <div className="container-custom py-8">
      <h1 className="text-4xl font-bold mb-8">{t('marketplace.title')}</h1>

      <div className="mb-8 flex gap-4">
        <button className="btn-primary">
          {t('marketplace.createListing')}
        </button>
        <button className="btn-secondary">
          {t('marketplace.myListings')}
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Item</th>
                <th className="text-left py-3 px-4 font-semibold">{t('marketplace.seller')}</th>
                <th className="text-left py-3 px-4 font-semibold">{t('common.price')}</th>
                <th className="text-left py-3 px-4 font-semibold">{t('common.quantity')}</th>
                <th className="text-left py-3 px-4 font-semibold">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {mockListings.map((listing) => (
                <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{listing.cosmetic}</td>
                  <td className="py-3 px-4 text-gray-600">{listing.seller}</td>
                  <td className="py-3 px-4 font-bold text-primary-600">{listing.price} 💎</td>
                  <td className="py-3 px-4 text-gray-600">{listing.quantity}</td>
                  <td className="py-3 px-4">
                    <button className="btn-primary text-sm">
                      {t('marketplace.buyNow')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
