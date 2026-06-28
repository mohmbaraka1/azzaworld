/* ============================================
   AZZA — قاعدة بيانات الدول والمدن العربية
   إحداثيات حقيقية (lat/lng) لاستخدامها بـ:
   1. نموذج التسجيل/الملف الشخصي (قائمتين منسدلتين: دولة ← مدينة)
   2. خريطة الاستكشاف التفاعلية (D3.js + GeoJSON)
   مفاتيح الدول/المدن (city_id) متطابقة تماماً مع ARAB_MAP_DATA
   بملف arab_world_map.js — أي تعديل هنا يجب أن يقابله تعديل هناك
   ============================================ */

const ARAB_COUNTRIES = {
  algeria: { name:'الجزائر', flag:'🇩🇿', mapId:12,
    cities:{
      algiers:    { name:'الجزائر العاصمة', lat:36.752, lng:3.042 },
      oran:       { name:'وهران', lat:35.697, lng:-0.634 },
      constantine:{ name:'قسنطينة', lat:36.365, lng:6.614 },
      annaba:     { name:'عنابة', lat:36.897, lng:7.765 },
      setif:      { name:'سطيف', lat:36.190, lng:5.409 },
    }
  },
  bahrain: { name:'البحرين', flag:'🇧🇭', mapId:48,
    cities:{
      manama:  { name:'المنامة', lat:26.214, lng:50.585 },
      muharraq:{ name:'المحرق', lat:26.258, lng:50.619 },
      riffa:   { name:'الرفاع', lat:26.130, lng:50.555 },
    }
  },
  egypt: { name:'مصر', flag:'🇪🇬', mapId:818,
    cities:{
      cairo:      { name:'القاهرة', lat:30.045, lng:31.235 },
      alexandria: { name:'الإسكندرية', lat:31.205, lng:29.924 },
      giza:       { name:'الجيزة', lat:29.987, lng:31.204 },
      sharmelsheikh:{ name:'شرم الشيخ', lat:27.912, lng:34.330 },
      aswan:      { name:'أسوان', lat:24.089, lng:32.899 },
      luxor:      { name:'الأقصر', lat:25.687, lng:32.644 },
    }
  },
  iraq: { name:'العراق', flag:'🇮🇶', mapId:368,
    cities:{
      baghdad: { name:'بغداد', lat:33.341, lng:44.361 },
      basra:   { name:'البصرة', lat:30.508, lng:47.783 },
      mosul:   { name:'الموصل', lat:36.340, lng:43.114 },
      najaf:   { name:'النجف', lat:31.997, lng:44.315 },
      erbil:   { name:'أربيل', lat:36.191, lng:44.009 },
      karbala: { name:'كربلاء', lat:32.616, lng:44.025 },
    }
  },
  jordan: { name:'الأردن', flag:'🇯🇴', mapId:400,
    cities:{
      amman: { name:'عمّان', lat:31.956, lng:35.945 },
      zarqa: { name:'الزرقاء', lat:32.073, lng:36.099 },
      irbid: { name:'إربد', lat:32.553, lng:35.850 },
      aqaba: { name:'العقبة', lat:29.527, lng:35.000 },
    }
  },
  kuwait: { name:'الكويت', flag:'🇰🇼', mapId:414,
    cities:{
      kuwaitcity: { name:'مدينة الكويت', lat:29.369, lng:47.978 },
      hawalli:    { name:'حولي', lat:29.332, lng:48.028 },
      aljahra:    { name:'الجهراء', lat:29.337, lng:47.658 },
    }
  },
  lebanon: { name:'لبنان', flag:'🇱🇧', mapId:422,
    cities:{
      beirut:  { name:'بيروت', lat:33.888, lng:35.513 },
      tripoli_lb:{ name:'طرابلس', lat:34.437, lng:35.849 },
      sidon:   { name:'صيدا', lat:33.563, lng:35.368 },
      tyre:    { name:'صور', lat:33.272, lng:35.204 },
    }
  },
  libya: { name:'ليبيا', flag:'🇱🇾', mapId:434,
    cities:{
      tripoli_ly: { name:'طرابلس', lat:32.903, lng:13.180 },
      benghazi:   { name:'بنغازي', lat:32.115, lng:20.064 },
      misrata:    { name:'مصراتة', lat:32.375, lng:15.093 },
      sabha:      { name:'سبها', lat:27.037, lng:14.429 },
    }
  },
  morocco: { name:'المغرب', flag:'🇲🇦', mapId:504,
    cities:{
      rabat:      { name:'الرباط', lat:33.990, lng:-6.832 },
      casablanca: { name:'الدار البيضاء', lat:33.573, lng:-7.589 },
      marrakech:  { name:'مراكش', lat:31.629, lng:-7.989 },
      fez:        { name:'فاس', lat:34.033, lng:-5.000 },
      tangier:    { name:'طنجة', lat:35.759, lng:-5.830 },
      agadir:     { name:'أكادير', lat:30.420, lng:-9.600 },
    }
  },
  oman: { name:'عُمان', flag:'🇴🇲', mapId:512,
    cities:{
      muscat: { name:'مسقط', lat:23.613, lng:58.593 },
      salalah:{ name:'صلالة', lat:17.019, lng:54.099 },
      sohar:  { name:'صحار', lat:24.347, lng:56.704 },
      nizwa:  { name:'نزوى', lat:22.933, lng:57.531 },
    }
  },
  palestine: { name:'فلسطين', flag:'🇵🇸', mapId:275,
    cities:{
      jerusalem:{ name:'القدس الشرقية', lat:31.769, lng:35.216 },
      ramallah: { name:'رام الله', lat:31.899, lng:35.206 },
      gaza:     { name:'غزة', lat:31.507, lng:34.464 },
      hebron:   { name:'الخليل', lat:31.530, lng:35.095 },
      nablus:   { name:'نابلس', lat:32.221, lng:35.260 },
    }
  },
  qatar: { name:'قطر', flag:'🇶🇦', mapId:634,
    cities:{
      doha:    { name:'الدوحة', lat:25.286, lng:51.531 },
      alrayyan:{ name:'الريان', lat:25.292, lng:51.424 },
      alwakrah:{ name:'الوكرة', lat:25.166, lng:51.602 },
    }
  },
  saudi: { name:'السعودية', flag:'🇸🇦', mapId:682,
    cities:{
      riyadh: { name:'الرياض', lat:24.686, lng:46.722 },
      jeddah: { name:'جدة', lat:21.485, lng:39.194 },
      mecca:  { name:'مكة المكرمة', lat:21.389, lng:39.826 },
      medina: { name:'المدينة المنورة', lat:24.469, lng:39.614 },
      dammam: { name:'الدمام', lat:26.433, lng:50.104 },
      taif:   { name:'الطائف', lat:21.270, lng:40.416 },
    }
  },
  sudan: { name:'السودان', flag:'🇸🇩', mapId:729,
    cities:{
      khartoum:  { name:'الخرطوم', lat:15.552, lng:32.522 },
      omdurman:  { name:'أم درمان', lat:15.654, lng:32.487 },
      portsudan: { name:'بورتسودان', lat:19.616, lng:37.217 },
      elfasher:  { name:'الفاشر', lat:13.629, lng:25.352 },
    }
  },
  syria: { name:'سوريا', flag:'🇸🇾', mapId:760,
    cities:{
      damascus: { name:'دمشق', lat:33.510, lng:36.291 },
      aleppo:   { name:'حلب', lat:36.201, lng:37.157 },
      homs:     { name:'حمص', lat:34.730, lng:36.710 },
      latakia:  { name:'اللاذقية', lat:35.519, lng:35.791 },
    }
  },
  tunisia: { name:'تونس', flag:'🇹🇳', mapId:788,
    cities:{
      tunis:   { name:'تونس العاصمة', lat:36.819, lng:10.181 },
      sfax:    { name:'صفاقس', lat:34.739, lng:10.760 },
      sousse:  { name:'سوسة', lat:35.825, lng:10.636 },
      bizerte: { name:'بنزرت', lat:37.275, lng:9.875 },
    }
  },
  uae: { name:'الإمارات', flag:'🇦🇪', mapId:784,
    cities:{
      abudhabi: { name:'أبوظبي', lat:24.453, lng:54.367 },
      dubai:    { name:'دبي', lat:25.204, lng:55.271 },
      sharjah:  { name:'الشارقة', lat:25.357, lng:55.379 },
      alain:    { name:'العين', lat:24.207, lng:55.764 },
    }
  },
  yemen: { name:'اليمن', flag:'🇾🇪', mapId:887,
    cities:{
      sanaa:    { name:"صنعاء", lat:15.352, lng:44.207 },
      aden:     { name:'عدن', lat:12.779, lng:45.036 },
      taiz:     { name:'تعز', lat:13.579, lng:44.017 },
      hudaydah: { name:'الحديدة', lat:14.800, lng:42.954 },
    }
  },
};

/* دالة مساعدة: تجيب بيانات مدينة محددة (دولة + مفتاح مدينة) */
function getCityCoords(countryKey, cityKey){
  const country = ARAB_COUNTRIES[countryKey];
  if(!country) return null;
  const city = country.cities[cityKey];
  if(!city) return null;
  return { ...city, countryName: country.name, countryFlag: country.flag };
}

/* دالة مساعدة: تبني قائمة <option> لكل الدول (لاستخدامها بـ <select>) */
function buildCountryOptions(selectedKey){
  return Object.entries(ARAB_COUNTRIES).map(([key, c]) =>
    `<option value="${key}" ${key===selectedKey?'selected':''}>${c.flag} ${c.name}</option>`
  ).join('');
}

/* دالة مساعدة: تبني قائمة <option> لمدن دولة معيّنة */
function buildCityOptions(countryKey, selectedKey){
  const country = ARAB_COUNTRIES[countryKey];
  if(!country) return '<option value="">اختر الدولة أولاً</option>';
  return Object.entries(country.cities).map(([key, c]) =>
    `<option value="${key}" ${key===selectedKey?'selected':''}>${c.name}</option>`
  ).join('');
}