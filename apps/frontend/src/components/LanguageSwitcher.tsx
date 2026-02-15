import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('locale', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors font-medium"
      aria-label="Switch language"
    >
      {i18n.language === 'en' ? '🇩🇪 DE' : '🇬🇧 EN'}
    </button>
  );
};

export default LanguageSwitcher;
