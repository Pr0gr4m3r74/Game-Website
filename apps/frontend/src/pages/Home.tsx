import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';

const Home = () => {
  const { t } = useTranslation();
  const isAuthenticated = authApi.isAuthenticated();

  const features = [
    {
      icon: '👤',
      title: t('home.features.avatars.title'),
      description: t('home.features.avatars.description'),
    },
    {
      icon: '🌍',
      title: t('home.features.worlds.title'),
      description: t('home.features.worlds.description'),
    },
    {
      icon: '🛒',
      title: t('home.features.marketplace.title'),
      description: t('home.features.marketplace.description'),
    },
    {
      icon: '👥',
      title: t('home.features.social.title'),
      description: t('home.features.social.description'),
    },
  ];

  const stats = [
    { value: '50K+', label: t('home.stats.players') },
    { value: '1000+', label: t('home.stats.worlds') },
    { value: '5000+', label: t('home.stats.cosmetics') },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            {t('home.hero.subtitle')}
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105">
              {t('home.hero.cta')}
            </Link>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">
            {t('home.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-primary-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of players in the metaverse today
            </p>
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
              {t('auth.signUp')}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
