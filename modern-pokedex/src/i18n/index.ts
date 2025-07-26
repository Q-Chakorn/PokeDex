import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      'app.title': 'Modern Pokédex',
      'app.subtitle': 'Discover and explore Pokémon from the Kanto region',
      'navigation.home': 'Home',
      'navigation.pokemon': 'Pokémon',
      'navigation.about': 'About',
      'loading.pokemon': 'Loading Pokémon...',
      'search.placeholder': 'Search Pokémon by name or number...',
      'filter.clear': 'Clear All',
      'pokemon.stats.hp': 'HP',
      'pokemon.stats.attack': 'Attack',
      'pokemon.stats.defense': 'Defense',
      'pokemon.stats.spAttack': 'Sp. Attack',
      'pokemon.stats.spDefense': 'Sp. Defense',
      'pokemon.stats.speed': 'Speed',
      'error.loadFailed': 'Failed to load Pokémon data',
      'error.tryAgain': 'Try Again',
      'pagination.previous': 'Previous',
      'pagination.next': 'Next',
      'results.showing': 'Showing {{count}} Pokémon',
      'results.noResults': 'No Pokémon found',
      'results.noResultsDesc': 'Try adjusting your search or filters'
    }
  },
  th: {
    translation: {
      'app.title': 'โปเกเด็กซ์สมัยใหม่',
      'app.subtitle': 'ค้นพบและสำรวจโปเกมอนจากภูมิภาคคันโต',
      'navigation.home': 'หน้าแรก',
      'navigation.pokemon': 'โปเกมอน',
      'navigation.about': 'เกี่ยวกับ',
      'loading.pokemon': 'กำลังโหลดโปเกมอน...',
      'search.placeholder': 'ค้นหาโปเกมอนด้วยชื่อหรือหมายเลข...',
      'filter.clear': 'ล้างทั้งหมด',
      'pokemon.stats.hp': 'พลังชีวิต',
      'pokemon.stats.attack': 'การโจมตี',
      'pokemon.stats.defense': 'การป้องกัน',
      'pokemon.stats.spAttack': 'การโจมตีพิเศษ',
      'pokemon.stats.spDefense': 'การป้องกันพิเศษ',
      'pokemon.stats.speed': 'ความเร็ว',
      'error.loadFailed': 'โหลดข้อมูลโปเกมอนไม่สำเร็จ',
      'error.tryAgain': 'ลองใหม่',
      'pagination.previous': 'ก่อนหน้า',
      'pagination.next': 'ถัดไป',
      'results.showing': 'แสดง {{count}} โปเกมอน',
      'results.noResults': 'ไม่พบโปเกมอน',
      'results.noResultsDesc': 'ลองปรับการค้นหาหรือตัวกรองของคุณ'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already does escaping
      skipOnVariables: false
    },
    
    react: {
      useSuspense: false
    },
    
    // CSP-friendly configuration
    debug: false,
    
    // Disable eval-based features
    saveMissing: false,
    updateMissing: false
  });

export default i18n;