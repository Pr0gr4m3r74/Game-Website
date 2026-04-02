import { useTranslation } from 'react-i18next';

const Admin = () => {
  const { t } = useTranslation();

  const stats = [
    { label: t('admin.totalUsers'), value: '50,234' },
    { label: t('admin.activeUsers'), value: '12,456' },
    { label: t('admin.totalRevenue'), value: '$125,000' },
    { label: t('admin.reports'), value: '23' },
  ];

  return (
    <div className="container-custom py-8">
      <h1 className="text-4xl font-bold mb-8">{t('admin.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">{t('admin.users')}</h2>
          <p className="text-gray-600">User management interface</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">{t('admin.analytics')}</h2>
          <p className="text-gray-600">Analytics dashboard</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">{t('admin.moderation')}</h2>
          <p className="text-gray-600">Content moderation tools</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">{t('admin.settings')}</h2>
          <p className="text-gray-600">System settings</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
