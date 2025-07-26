import { Language } from '../types/app';

// Pokemon name mappings for Thai localization
const pokemonNamesTH: Record<string, string> = {
  // Kanto Pokemon Thai names
  'bulbasaur': 'ฟุชิงิดาเนะ',
  'ivysaur': 'ฟุชิงิโซ',
  'venusaur': 'ฟุชิงิบานะ',
  'charmander': 'ฮิโตคาเงะ',
  'charmeleon': 'ลิซาร์โด',
  'charizard': 'ลิซาร์ดอน',
  'squirtle': 'เซนิงาเมะ',
  'wartortle': 'คาเมล',
  'blastoise': 'คาเมกซ์',
  'caterpie': 'คาเทอร์พี',
  'metapod': 'ทรานเซล',
  'butterfree': 'บัตเตอร์ฟรี',
  'weedle': 'บีเดิล',
  'kakuna': 'โคคูน',
  'beedrill': 'สเปียร์',
  'pidgey': 'โปโปะ',
  'pidgeotto': 'พิจอน',
  'pidgeot': 'พิจอต',
  'rattata': 'โคราตตะ',
  'raticate': 'โคราตตะ',
  'spearow': 'โอนิสุซุเมะ',
  'fearow': 'โอนิโดริล',
  'ekans': 'อาโบะ',
  'arbok': 'อาร์บอก',
  'pikachu': 'ปิกาจู',
  'raichu': 'ไรจู',
  'sandshrew': 'ซันโด',
  'sandslash': 'ซันดแพน',
  'nidoran-f': 'นิโดรัน♀',
  'nidorina': 'นิโดรีนา',
  'nidoqueen': 'นิโดควีน',
  'nidoran-m': 'นิโดรัน♂',
  'nidorino': 'นิโดรีโน',
  'nidoking': 'นิโดคิง',
  'clefairy': 'ปิปปิ',
  'clefable': 'ปิกซี',
  'vulpix': 'โรคอน',
  'ninetales': 'คิวคอน',
  'jigglypuff': 'ปุรินิ',
  'wigglytuff': 'ปุคุริน',
  'zubat': 'ซูแบต',
  'golbat': 'โกลแบต',
  'oddish': 'นาโซะโนะคุซะ',
  'gloom': 'คุซาอิฮานะ',
  'vileplume': 'ราฟเฟลเซีย',
  'paras': 'ปาราส',
  'parasect': 'ปาราเซกต์',
  'venonat': 'โคนปัน',
  'venomoth': 'มอร์ฟอน',
  'diglett': 'ดิกดา',
  'dugtrio': 'ดักทริโอ',
  'meowth': 'เนียร์ธ',
  'persian': 'เปอร์เซียน',
  'psyduck': 'โคดัก',
  'golduck': 'โกลดัก',
  'mankey': 'มังกี้',
  'primeape': 'โอคาริยะ',
  'growlithe': 'การ์ดี',
  'arcanine': 'วินดี',
  'poliwag': 'นิโอโรโมะ',
  'poliwhirl': 'นิโอรันกะ',
  'poliwrath': 'นิโอคิง',
  'abra': 'เคซี่',
  'kadabra': 'ยุนเกลลาร์',
  'alakazam': 'ฟูดิน',
  'machop': 'วานริกี้',
  'machoke': 'โกริกี้',
  'machamp': 'คาอิริกี้',
  'bellsprout': 'มาดาทซึโบมิ',
  'weepinbell': 'อุทซึดอน',
  'victreebel': 'อุทซึบอต',
  'tentacool': 'เมโนคุราเงะ',
  'tentacruel': 'โดคุคุราเงะ',
  'geodude': 'อิชิทซึเบะ',
  'graveler': 'โกโรน',
  'golem': 'โกเลม',
  'ponyta': 'โปนีตะ',
  'rapidash': 'กิยาโลปปะ',
  'slowpoke': 'ยาดอน',
  'slowbro': 'ยาโดรัน',
  'magnemite': 'โคอิล',
  'magneton': 'เรอาโคอิล',
  'farfetchd': 'คาโมเนกิ',
  'doduo': 'โดโด',
  'dodrio': 'โดโดริโอ',
  'seel': 'ปาววาว',
  'dewgong': 'จูกอง',
  'grimer': 'เบโทเบโทน',
  'muk': 'เบโทเบโทน',
  'shellder': 'เชลเดอร์',
  'cloyster': 'ปาร์เชน',
  'gastly': 'โกส',
  'haunter': 'โกสต์',
  'gengar': 'เก็งการ์',
  'onix': 'อิวาร์ก',
  'drowzee': 'สลีป',
  'hypno': 'สลีเปอร์',
  'krabby': 'คราบบี้',
  'kingler': 'คิงเลอร์',
  'voltorb': 'บิริริดามะ',
  'electrode': 'มารุมาอิน',
  'exeggcute': 'ทามาทามะ',
  'exeggutor': 'นัสซี่',
  'cubone': 'คาระคาระ',
  'marowak': 'การาการา',
  'hitmonlee': 'ซาวามูลาร์',
  'hitmonchan': 'เอบิวาลาร์',
  'lickitung': 'เบโรริงงะ',
  'koffing': 'ดอกาส',
  'weezing': 'มาทาโดกาส',
  'rhyhorn': 'ไซฮอร์น',
  'rhydon': 'ไซดอน',
  'chansey': 'ลัคกี้',
  'tangela': 'โมนจาระ',
  'kangaskhan': 'การ์ูรา',
  'horsea': 'ทัตซึไฮ',
  'seadra': 'ซีดรา',
  'goldeen': 'โทซากินโตะ',
  'seaking': 'อะซึมาโอ',
  'staryu': 'ฮิโตเดมัน',
  'starmie': 'สตาร์มี',
  'mr-mime': 'บาเรียร์ด',
  'scyther': 'สไตรค์',
  'jynx': 'รูจูระ',
  'electabuzz': 'เอเลกิด',
  'magmar': 'บูเบอร์',
  'pinsir': 'คาอิรอส',
  'tauros': 'เคนทารอส',
  'magikarp': 'โคอิคิง',
  'gyarados': 'กิยาราโดส',
  'lapras': 'ลาปราส',
  'ditto': 'เมตามอน',
  'eevee': 'อีวุย',
  'vaporeon': 'ชาวเวอร์ส',
  'jolteon': 'ธันเดอร์ส',
  'flareon': 'บูสเตอร์',
  'porygon': 'โปรีกอน',
  'omanyte': 'โอมนาอิต',
  'omastar': 'โอมสตาร์',
  'kabuto': 'คาบูโต',
  'kabutops': 'คาบูทอปส์',
  'aerodactyl': 'ปูเทรา',
  'snorlax': 'คาบิกอน',
  'articuno': 'ฟรีเซอร์',
  'zapdos': 'ธันเดอร์',
  'moltres': 'ไฟเออร์',
  'dratini': 'มินิรยู',
  'dragonair': 'ฮากุรยู',
  'dragonite': 'คาอิรยู',
  'mewtwo': 'มิวทู',
  'mew': 'มิว'
};

/**
 * Get localized Pokemon name
 */
export function getLocalizedPokemonName(englishName: string, language: Language): string {
  if (language === 'th') {
    return pokemonNamesTH[englishName.toLowerCase()] || englishName;
  }
  
  // For English, capitalize first letter
  return englishName.charAt(0).toUpperCase() + englishName.slice(1);
}

/**
 * Get localized type name
 */
export function getLocalizedTypeName(type: string, language: Language, t: (key: string) => string): string {
  return t(`types.${type.toLowerCase()}`);
}

/**
 * Get localized ability name (fallback to English if no translation)
 */
export function getLocalizedAbilityName(ability: string, language: Language): string {
  // For now, return English names as Thai translations for abilities are complex
  // This can be extended with a full ability translation mapping
  return ability.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Format number with localized separators
 */
export function formatNumber(num: number, language: Language): string {
  if (language === 'th') {
    return num.toLocaleString('th-TH');
  }
  return num.toLocaleString('en-US');
}

/**
 * Get localized unit
 */
export function getLocalizedUnit(unit: 'meters' | 'kilograms' | 'centimeters', t: (key: string) => string): string {
  return t(`units.${unit}`);
}