import { useTranslation } from 'react-i18next';

const AvatarEditor = () => {
  const { t } = useTranslation();

  return (
    <div className="container-custom py-8">
      <h1 className="text-4xl font-bold mb-8">{t('avatar.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-white text-xl">3D Avatar Viewer (Three.js)</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">{t('avatar.myAvatars')}</h2>
          <button className="btn-primary w-full mb-4">
            {t('avatar.createNew')}
          </button>
          <div className="space-y-2">
            <p className="text-gray-500 text-center py-8">No avatars yet</p>
          </div>
        </div>
      </div>

      <div className="mt-8 card">
        <h2 className="text-2xl font-bold mb-6">{t('avatar.editAvatar')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('avatar.avatarName')}
            </label>
            <input type="text" className="input" placeholder="My Avatar" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('avatar.bodyType')}
            </label>
            <select className="input">
              <option>Default</option>
              <option>Athletic</option>
              <option>Slim</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('avatar.hairStyle')}
            </label>
            <select className="input">
              <option>Short</option>
              <option>Long</option>
              <option>Bald</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('avatar.height')}
            </label>
            <input type="range" min="0.8" max="1.2" step="0.1" className="w-full" />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="btn-primary">{t('avatar.saveAvatar')}</button>
          <button className="btn-secondary">{t('common.cancel')}</button>
        </div>
      </div>
    </div>
  );
};

export default AvatarEditor;
