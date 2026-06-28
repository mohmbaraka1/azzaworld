/* ============================================
   AZZA — خريطة الوطن العربي التفاعلية
   مبنية على D3.js + GeoJSON محلي (صفر اعتماد شبكي خارجي)
   ============================================ */

const ARAB_MAP_IDS = new Set([12,48,174,262,818,368,400,414,422,434,478,504,512,275,634,682,706,729,760,788,784,887]);

/* بيانات الدول والمدن — أرقام u (مسجّلين) و p (مشاريع) تجريبية، استبدلها ببيانات AZZA الحقيقية */

const ARAB_MAP_DATA = {
  12:  { ar:'الجزائر', en:'Algeria', capAr:'الجزائر العاصمة', capEn:'Algiers', capXY:[3.042,36.752], pop:'46 مليون', area:'2,381,741 km²', color:'#b8d4b8',
         cities:[{ar:'الجزائر العاصمة',en:'Algiers',xy:[3.042,36.752],city_id:'algiers',u:4200,p:285,isC:true},{ar:'وهران',en:'Oran',xy:[-0.634,35.697],city_id:'oran',u:1890,p:124},{ar:'قسنطينة',en:'Constantine',xy:[6.614,36.365],city_id:'constantine',u:1240,p:87},{ar:'عنابة',en:'Annaba',xy:[7.765,36.897],city_id:'annaba',u:780,p:52},{ar:'سطيف',en:'Setif',xy:[5.409,36.190],city_id:'setif',u:650,p:41}] },
  48:  { ar:'البحرين', en:'Bahrain', capAr:'المنامة', capEn:'Manama', capXY:[50.585,26.214], pop:'1.5 مليون', area:'765 km²', color:'#d4d4a0',
         cities:[{ar:'المنامة',en:'Manama',xy:[50.585,26.214],city_id:'manama',u:3200,p:245,isC:true},{ar:'المحرق',en:'Muharraq',xy:[50.619,26.258],city_id:'muharraq',u:1200,p:88},{ar:'الرفاع',en:'Riffa',xy:[50.555,26.130],city_id:'riffa',u:760,p:52}] },
  174: { ar:'جزر القمر', en:'Comoros', capAr:'موروني', capEn:'Moroni', capXY:[43.255,-11.702], pop:'870,000', area:'1,861 km²', color:'#c8b8d4',
         cities:[{ar:'موروني',en:'Moroni',xy:[43.255,-11.702],city_id:null,u:320,p:24,isC:true},{ar:'موتسامودو',en:'Mutsamudu',xy:[44.394,-12.163],city_id:null,u:145,p:11}] },
  262: { ar:'جيبوتي', en:'Djibouti', capAr:'جيبوتي', capEn:'Djibouti', capXY:[43.145,11.589], pop:'1.1 مليون', area:'23,200 km²', color:'#b8d4b8',
         cities:[{ar:'جيبوتي',en:'Djibouti',xy:[43.145,11.589],city_id:null,u:580,p:42,isC:true},{ar:'علي صبيح',en:'Ali Sabieh',xy:[42.712,11.155],city_id:null,u:180,p:14}] },
  818: { ar:'مصر', en:'Egypt', capAr:'القاهرة', capEn:'Cairo', capXY:[31.235,30.045], pop:'105 مليون', area:'1,002,450 km²', color:'#b8d4b8',
         cities:[{ar:'القاهرة',en:'Cairo',xy:[31.235,30.045],city_id:'cairo',u:18500,p:1240,isC:true},{ar:'الإسكندرية',en:'Alexandria',xy:[29.924,31.205],city_id:'alexandria',u:8200,p:580},{ar:'الجيزة',en:'Giza',xy:[31.204,29.987],city_id:'giza',u:5400,p:342},{ar:'شرم الشيخ',en:'Sharm El-Sheikh',xy:[34.330,27.912],city_id:'sharmelsheikh',u:1200,p:95},{ar:'أسوان',en:'Aswan',xy:[32.899,24.089],city_id:'aswan',u:890,p:64},{ar:'الأقصر',en:'Luxor',xy:[32.644,25.687],city_id:'luxor',u:720,p:48}] },
  368: { ar:'العراق', en:'Iraq', capAr:'بغداد', capEn:'Baghdad', capXY:[44.361,33.341], pop:'42 مليون', area:'438,317 km²', color:'#b8d4b8',
         cities:[{ar:'بغداد',en:'Baghdad',xy:[44.361,33.341],city_id:'baghdad',u:7800,p:520,isC:true},{ar:'البصرة',en:'Basra',xy:[47.783,30.508],city_id:'basra',u:2400,p:168},{ar:'الموصل',en:'Mosul',xy:[43.114,36.340],city_id:'mosul',u:1800,p:124},{ar:'النجف',en:'Najaf',xy:[44.315,31.997],city_id:'najaf',u:1200,p:85},{ar:'أربيل',en:'Erbil',xy:[44.009,36.191],city_id:'erbil',u:2100,p:148},{ar:'كربلاء',en:'Karbala',xy:[44.025,32.616],city_id:'karbala',u:980,p:72}] },
  400: { ar:'الأردن', en:'Jordan', capAr:'عمّان', capEn:'Amman', capXY:[35.945,31.956], pop:'10.8 مليون', area:'89,342 km²', color:'#d4d4a0',
         cities:[{ar:'عمّان',en:'Amman',xy:[35.945,31.956],city_id:'amman',u:6200,p:425,isC:true},{ar:'الزرقاء',en:'Zarqa',xy:[36.099,32.073],city_id:'zarqa',u:1800,p:124},{ar:'إربد',en:'Irbid',xy:[35.850,32.553],city_id:'irbid',u:1500,p:102},{ar:'العقبة',en:'Aqaba',xy:[35.000,29.527],city_id:'aqaba',u:780,p:52}] },
  414: { ar:'الكويت', en:'Kuwait', capAr:'مدينة الكويت', capEn:'Kuwait City', capXY:[47.978,29.369], pop:'4.6 مليون', area:'17,818 km²', color:'#b8c8d8',
         cities:[{ar:'مدينة الكويت',en:'Kuwait City',xy:[47.978,29.369],city_id:'kuwaitcity',u:5800,p:415,isC:true},{ar:'حولي',en:'Hawalli',xy:[48.028,29.332],city_id:'hawalli',u:2100,p:152},{ar:'الجهراء',en:'Al Jahra',xy:[47.658,29.337],city_id:'aljahra',u:980,p:68}] },
  422: { ar:'لبنان', en:'Lebanon', capAr:'بيروت', capEn:'Beirut', capXY:[35.513,33.888], pop:'5.3 مليون', area:'10,452 km²', color:'#d4c5a9',
         cities:[{ar:'بيروت',en:'Beirut',xy:[35.513,33.888],city_id:'beirut',u:5600,p:415,isC:true},{ar:'طرابلس',en:'Tripoli',xy:[35.849,34.437],city_id:'tripoli_lb',u:1800,p:128},{ar:'صيدا',en:'Sidon',xy:[35.368,33.563],city_id:'sidon',u:980,p:72},{ar:'صور',en:'Tyre',xy:[35.204,33.272],city_id:'tyre',u:720,p:52}] },
  434: { ar:'ليبيا', en:'Libya', capAr:'طرابلس', capEn:'Tripoli', capXY:[13.180,32.903], pop:'7 مليون', area:'1,759,541 km²', color:'#d4c5a9',
         cities:[{ar:'طرابلس',en:'Tripoli',xy:[13.180,32.903],city_id:'tripoli_ly',u:2800,p:192,isC:true},{ar:'بنغازي',en:'Benghazi',xy:[20.064,32.115],city_id:'benghazi',u:1600,p:112},{ar:'مصراتة',en:'Misrata',xy:[15.093,32.375],city_id:'misrata',u:780,p:56},{ar:'سبها',en:'Sabha',xy:[14.429,27.037],city_id:'sabha',u:380,p:28}] },
  478: { ar:'موريتانيا', en:'Mauritania', capAr:'نواكشوط', capEn:'Nouakchott', capXY:[-15.958,18.079], pop:'4.7 مليون', area:'1,030,700 km²', color:'#b8c8d8',
         cities:[{ar:'نواكشوط',en:'Nouakchott',xy:[-15.958,18.079],city_id:null,u:980,p:68,isC:true},{ar:'نواذيبو',en:'Nouadhibou',xy:[-17.032,20.930],city_id:null,u:480,p:34}] },
  504: { ar:'المغرب', en:'Morocco', capAr:'الرباط', capEn:'Rabat', capXY:[-6.832,33.990], pop:'37 مليون', area:'446,550 km²', color:'#d4c5a9',
         cities:[{ar:'الرباط',en:'Rabat',xy:[-6.832,33.990],city_id:'rabat',u:5200,p:380,isC:true},{ar:'الدار البيضاء',en:'Casablanca',xy:[-7.589,33.573],city_id:'casablanca',u:9400,p:680},{ar:'مراكش',en:'Marrakech',xy:[-7.989,31.629],city_id:'marrakech',u:4100,p:295},{ar:'فاس',en:'Fez',xy:[-5.000,34.033],city_id:'fez',u:3200,p:218},{ar:'طنجة',en:'Tangier',xy:[-5.830,35.759],city_id:'tangier',u:2800,p:195},{ar:'أكادير',en:'Agadir',xy:[-9.600,30.420],city_id:'agadir',u:1900,p:128}] },
  512: { ar:'عُمان', en:'Oman', capAr:'مسقط', capEn:'Muscat', capXY:[58.593,23.613], pop:'4.8 مليون', area:'309,500 km²', color:'#b8d4b8',
         cities:[{ar:'مسقط',en:'Muscat',xy:[58.593,23.613],city_id:'muscat',u:4800,p:355,isC:true},{ar:'صلالة',en:'Salalah',xy:[54.099,17.019],city_id:'salalah',u:1400,p:98},{ar:'صحار',en:'Sohar',xy:[56.704,24.347],city_id:'sohar',u:780,p:52},{ar:'نزوى',en:'Nizwa',xy:[57.531,22.933],city_id:'nizwa',u:560,p:38}] },
  275: { ar:'فلسطين', en:'Palestine', capAr:'القدس الشرقية', capEn:'East Jerusalem', capXY:[35.216,31.769], pop:'5.4 مليون', area:'6,220 km²', color:'#d8b8b8',
         cities:[{ar:'القدس الشرقية',en:'East Jerusalem',xy:[35.216,31.769],city_id:'jerusalem',u:4200,p:285,isC:true},{ar:'رام الله',en:'Ramallah',xy:[35.206,31.899],city_id:'ramallah',u:2800,p:195},{ar:'غزة',en:'Gaza City',xy:[34.464,31.507],city_id:'gaza',u:3400,p:215},{ar:'الخليل',en:'Hebron',xy:[35.095,31.530],city_id:'hebron',u:1800,p:124},{ar:'نابلس',en:'Nablus',xy:[35.260,32.221],city_id:'nablus',u:1600,p:112}] },
  634: { ar:'قطر', en:'Qatar', capAr:'الدوحة', capEn:'Doha', capXY:[51.531,25.286], pop:'2.9 مليون', area:'11,586 km²', color:'#d4c5a9',
         cities:[{ar:'الدوحة',en:'Doha',xy:[51.531,25.286],city_id:'doha',u:7200,p:520,isC:true},{ar:'الريان',en:'Al Rayyan',xy:[51.424,25.292],city_id:'alrayyan',u:1800,p:128},{ar:'الوكرة',en:'Al Wakrah',xy:[51.602,25.166],city_id:'alwakrah',u:980,p:68}] },
  682: { ar:'المملكة العربية السعودية', en:'Saudi Arabia', capAr:'الرياض', capEn:'Riyadh', capXY:[46.722,24.686], pop:'36 مليون', area:'2,149,690 km²', color:'#d8b8b8',
         cities:[{ar:'الرياض',en:'Riyadh',xy:[46.722,24.686],city_id:'riyadh',u:12400,p:890,isC:true},{ar:'جدة',en:'Jeddah',xy:[39.194,21.485],city_id:'jeddah',u:9800,p:720},{ar:'مكة المكرمة',en:'Mecca',xy:[39.826,21.389],city_id:'mecca',u:6200,p:410},{ar:'المدينة المنورة',en:'Medina',xy:[39.614,24.469],city_id:'medina',u:4100,p:285},{ar:'الدمام',en:'Dammam',xy:[50.104,26.433],city_id:'dammam',u:3800,p:245},{ar:'الطائف',en:'Taif',xy:[40.416,21.270],city_id:'taif',u:2100,p:142}] },
  706: { ar:'الصومال', en:'Somalia', capAr:'مقديشو', capEn:'Mogadishu', capXY:[45.341,2.046], pop:'17 مليون', area:'637,657 km²', color:'#d8b8b8',
         cities:[{ar:'مقديشو',en:'Mogadishu',xy:[45.341,2.046],city_id:null,u:1200,p:84,isC:true},{ar:'هرجيسا',en:'Hargeisa',xy:[44.065,9.560],city_id:null,u:680,p:48},{ar:'كسمايو',en:'Kismayo',xy:[42.545,-0.359],city_id:null,u:380,p:28}] },
  729: { ar:'السودان', en:'Sudan', capAr:'الخرطوم', capEn:'Khartoum', capXY:[32.522,15.552], pop:'45 مليون', area:'1,861,484 km²', color:'#b8c8d8',
         cities:[{ar:'الخرطوم',en:'Khartoum',xy:[32.522,15.552],city_id:'khartoum',u:5400,p:365,isC:true},{ar:'أم درمان',en:'Omdurman',xy:[32.487,15.654],city_id:'omdurman',u:3200,p:218},{ar:'بورتسودان',en:'Port Sudan',xy:[37.217,19.616],city_id:'portsudan',u:890,p:64},{ar:'الفاشر',en:'El Fasher',xy:[25.352,13.629],city_id:'elfasher',u:560,p:38}] },
  760: { ar:'سوريا', en:'Syria', capAr:'دمشق', capEn:'Damascus', capXY:[36.291,33.510], pop:'21 مليون', area:'185,180 km²', color:'#b8c8d8',
         cities:[{ar:'دمشق',en:'Damascus',xy:[36.291,33.510],city_id:'damascus',u:3200,p:215,isC:true},{ar:'حلب',en:'Aleppo',xy:[37.157,36.201],city_id:'aleppo',u:1800,p:128},{ar:'حمص',en:'Homs',xy:[36.710,34.730],city_id:'homs',u:920,p:68},{ar:'اللاذقية',en:'Latakia',xy:[35.791,35.519],city_id:'latakia',u:780,p:54}] },
  788: { ar:'تونس', en:'Tunisia', capAr:'تونس العاصمة', capEn:'Tunis', capXY:[10.181,36.819], pop:'12 مليون', area:'163,610 km²', color:'#b8c8d8',
         cities:[{ar:'تونس العاصمة',en:'Tunis',xy:[10.181,36.819],city_id:'tunis',u:4800,p:325,isC:true},{ar:'صفاقس',en:'Sfax',xy:[10.760,34.739],city_id:'sfax',u:1900,p:128},{ar:'سوسة',en:'Sousse',xy:[10.636,35.825],city_id:'sousse',u:1400,p:96},{ar:'بنزرت',en:'Bizerte',xy:[9.875,37.275],city_id:'bizerte',u:820,p:58}] },
  784: { ar:'الإمارات', en:'UAE', capAr:'أبوظبي', capEn:'Abu Dhabi', capXY:[54.367,24.453], pop:'9.9 مليون', area:'83,600 km²', color:'#d4d4a0',
         cities:[{ar:'أبوظبي',en:'Abu Dhabi',xy:[54.367,24.453],city_id:'abudhabi',u:8400,p:620,isC:true},{ar:'دبي',en:'Dubai',xy:[55.271,25.204],city_id:'dubai',u:14200,p:980},{ar:'الشارقة',en:'Sharjah',xy:[55.379,25.357],city_id:'sharjah',u:4200,p:285},{ar:'العين',en:'Al Ain',xy:[55.764,24.207],city_id:'alain',u:2100,p:145}] },
  887: { ar:'اليمن', en:'Yemen', capAr:'صنعاء', capEn:"Sana'a", capXY:[44.207,15.352], pop:'34 مليون', area:'527,968 km²', color:'#b8d4b8',
         cities:[{ar:'صنعاء',en:"Sana'a",xy:[44.207,15.352],city_id:'sanaa',u:3800,p:245,isC:true},{ar:'عدن',en:'Aden',xy:[45.036,12.779],city_id:'aden',u:2100,p:142},{ar:'تعز',en:'Taiz',xy:[44.017,13.579],city_id:'taiz',u:1600,p:108},{ar:'الحديدة',en:'Hudaydah',xy:[42.954,14.800],city_id:'hudaydah',u:1200,p:84}] }
};

/* ── متغيرات الحالة العالمية ── */
let _mapInited=false;
let _mapSvg=null, _mapZoom=null, _mapG=null, _mapPathFn=null, _mapProj=null;
let _mapCountryPaths=null, _mapFeatures=null;
let _mapCityGroups={};
let _mapSelectedCountryId=null, _mapSelectedCityIdx=null;
let _mapCityFilterRole='';

/* ── نقطة الدخول: تُستدعى عند فتح تبويب الخريطة ── */
function initArabWorldMap(){
  if(_mapInited){ console.log('AZZA Map: تم التهيئة مسبقاً، تجاهل الاستدعاء'); return; }
  _mapInited=true;
  console.log('AZZA Map: بدء التهيئة...');
  _mapBuildCountrySelect();
  _mapBindUI();
  _mapDraw();
}

/* ── تعبئة قائمة الدول المنسدلة ── */
function _mapBuildCountrySelect(){
  const sel=document.getElementById('arab-map-country-sel');
  if(!sel){ console.error('AZZA Map: عنصر arab-map-country-sel غير موجود بالـHTML'); return; }
  const list=Object.entries(ARAB_MAP_DATA)
    .map(([id,d])=>({id,ar:d.ar}))
    .sort((a,b)=>a.ar.localeCompare(b.ar,'ar'));
  sel.innerHTML='<option value="">— اختر الدولة —</option>'+
    list.map(o=>`<option value="${o.id}">${o.ar}</option>`).join('');
  console.log('AZZA Map: تم تعبئة قائمة', list.length, 'دولة');
}

/* ── ربط أحداث الواجهة (قوائم، أزرار) ── */
function _mapBindUI(){
  const countrySel=document.getElementById('arab-map-country-sel');
  const citySel=document.getElementById('arab-map-city-sel');
  const closeBtn=document.getElementById('arab-map-close-btn');
  const zoomIn=document.getElementById('arab-map-zoom-in');
  const zoomOut=document.getElementById('arab-map-zoom-out');
  const zoomReset=document.getElementById('arab-map-zoom-reset');

  if(countrySel) countrySel.addEventListener('change',e=>{
    const id=parseInt(e.target.value,10);
    if(!id||isNaN(id)){ _mapDeselectCountry(); return; }
    _mapSelectCountry(id);
  });

  if(citySel) citySel.addEventListener('change',e=>{
    const idx=parseInt(e.target.value,10);
    if(isNaN(idx)) return;
    const cities=(ARAB_MAP_DATA[_mapSelectedCountryId]?.cities)||[];
    const city=cities[idx];
    if(!city) return;
    _mapSelectedCityIdx=idx;
    _mapShowCityStats(city);
    if(city.xy) _mapZoomToCity(city.xy);
  });

  if(closeBtn) closeBtn.addEventListener('click',_mapDeselectCountry);
  if(zoomIn) zoomIn.addEventListener('click',()=>{
    if(_mapSvg&&_mapZoom) _mapSvg.transition().duration(380).ease(d3.easeCubicOut).call(_mapZoom.scaleBy,1.65);
  });
  if(zoomOut) zoomOut.addEventListener('click',()=>{
    if(_mapSvg&&_mapZoom) _mapSvg.transition().duration(380).ease(d3.easeCubicOut).call(_mapZoom.scaleBy,1/1.65);
  });
  if(zoomReset) zoomReset.addEventListener('click',()=>{
    if(_mapSvg&&_mapZoom) _mapSvg.transition().duration(650).ease(d3.easeCubicInOut).call(_mapZoom.transform,d3.zoomIdentity);
  });
}

/* ── رسم الخريطة الفعلي ── */
function _mapDraw(){
  /* فحوصات دفاعية أولاً — كل واحدة تطبع رسالة واضحة لو فشلت */
  if(typeof d3==='undefined'){
    console.error('AZZA Map: مكتبة D3.js غير محمّلة. تأكد من وجود ملف d3.min.js بنفس مجلد الصفحة.');
    _mapShowError('تعذّر تحميل مكوّن الرسم (D3.js).<br>تأكد من وجود ملف d3.min.js بنفس مجلد الصفحة.');
    return;
  }
  if(typeof ARAB_GEO_FEATURES==='undefined'){
    console.error('AZZA Map: ARAB_GEO_FEATURES غير معرّفة. تأكد من تحميل arab_geo_data.js قبل arab_world_map.js.');
    _mapShowError('تعذّر إيجاد بيانات حدود الدول (arab_geo_data.js).<br>تأكد من وجوده بنفس مجلد الصفحة.');
    return;
  }
  const container=document.getElementById('arab-map-svg-mount');
  if(!container){
    console.error('AZZA Map: عنصر arab-map-svg-mount غير موجود بالـHTML.');
    return;
  }
  const W=container.clientWidth, H=container.clientHeight;
  if(!W||!H){
    console.error('AZZA Map: حجم حاوية الخريطة صفر (W='+W+', H='+H+'). تأكد أن العنصر ظاهر (display!=none) وقت الرسم.');
    _mapShowError('تعذّر قياس مساحة الخريطة.<br>أعد فتح تبويب الخريطة بعد إعادة تحميل الصفحة.');
    return;
  }

  console.log('AZZA Map: جاري الرسم — أبعاد الحاوية', W, 'x', H);

  /* مسح أي محتوى سابق (حماية من رسم مزدوج) */
  container.innerHTML='';

  const svg=d3.select(container).append('svg').attr('width',W).attr('height',H).style('display','block');
  _mapSvg=svg;

  const defs=svg.append('defs');
  const grad=defs.append('linearGradient').attr('id','azzaSeaGrad').attr('x1','0').attr('y1','0').attr('x2','0').attr('y2','1');
  grad.append('stop').attr('offset','0%').attr('stop-color','#b0d4ec');
  grad.append('stop').attr('offset','100%').attr('stop-color','#9ec8e4');
  svg.append('rect').attr('width',W).attr('height',H).attr('fill','url(#azzaSeaGrad)');

  const proj=d3.geoMercator();
  _mapProj=proj;
  const g=svg.append('g');
  _mapG=g;

  const zoom=d3.zoom().scaleExtent([0.5,14]).on('zoom',ev=>g.attr('transform',ev.transform));
  svg.call(zoom).on('dblclick.zoom',null);
  _mapZoom=zoom;
  svg.on('click',_mapDeselectCountry);

  const arabFeats=ARAB_GEO_FEATURES.features;
  if(!arabFeats||!arabFeats.length){
    console.error('AZZA Map: ARAB_GEO_FEATURES.features فاضية أو غير موجودة.');
    _mapShowError('بيانات حدود الدول فاضية.<br>تأكد من سلامة ملف arab_geo_data.js.');
    return;
  }
  _mapFeatures=arabFeats;
  console.log('AZZA Map: تم تحميل', arabFeats.length, 'دولة من بيانات الحدود');

  proj.fitExtent([[40,36],[W-40,H-36]],{type:'FeatureCollection',features:arabFeats});
  const pathFn=d3.geoPath().projection(proj);
  _mapPathFn=pathFn;

  /* خطوط الطول/العرض الزخرفية */
  g.append('path').datum(d3.geoGraticule().step([10,10])()).attr('d',pathFn)
    .attr('fill','none').attr('stroke','#8bbad8').attr('stroke-width',.4).attr('stroke-opacity',.5);

  /* رسم الدول */
  _mapCountryPaths=g.append('g').selectAll('path')
    .data(arabFeats).join('path').attr('d',pathFn)
    .attr('fill',f=>ARAB_MAP_DATA[+f.id]?.color||'#d4c5a9')
    .attr('stroke','#7a6a54').attr('stroke-width',.9).style('cursor','pointer')
    .style('transition','fill .25s ease, filter .25s ease')
    .on('mouseover',(ev,f)=>{
      const id=+f.id;
      if(_mapSelectedCountryId!==id){
        const c=d3.color(ARAB_MAP_DATA[id]?.color||'#d4c5a9');
        d3.select(ev.currentTarget).raise()
          .attr('fill',c?c.darker(.32).toString():'#c0b098')
          .style('filter','drop-shadow(0 3px 6px rgba(0,0,0,.25))');
      }
    })
    .on('mouseout',(ev,f)=>{
      const id=+f.id;
      if(_mapSelectedCountryId!==id){
        d3.select(ev.currentTarget)
          .attr('fill',ARAB_MAP_DATA[id]?.color||'#d4c5a9')
          .style('filter','none');
      }
    })
    .on('click',(ev,f)=>{ ev.stopPropagation(); _mapSelectCountry(+f.id,f); });

  console.log('AZZA Map: تم رسم', _mapCountryPaths.size(), 'مسار دولة بنجاح');

  /* تسميات أسماء الدول (دائمة الظهور) */
  const labelsG=g.append('g').attr('pointer-events','none');
  arabFeats.forEach(feat=>{
    const id=+feat.id, d=ARAB_MAP_DATA[id]; if(!d) return;
    const ct=pathFn.centroid(feat); if(isNaN(ct[0])) return;
    const bb=pathFn.bounds(feat), sz=Math.min(bb[1][0]-bb[0][0],bb[1][1]-bb[0][1]);
    if(sz<10) return;
    const fs=Math.max(8,Math.min(15,sz/5.8));
    [['white',3],[null,0]].forEach(([stroke,sw])=>{
      const t=labelsG.append('text').attr('x',ct[0]).attr('y',ct[1]-fs*.4)
        .attr('text-anchor','middle').attr('dominant-baseline','middle')
        .attr('font-family',"Tajawal, sans-serif").attr('font-size',fs+'px').attr('font-weight','600')
        .attr('fill',stroke?'white':'#2a1e0e');
      if(stroke) t.attr('stroke','white').attr('stroke-width',sw).attr('paint-order','stroke');
      t.text(d.ar);
    });
  });

  /* مجموعات تسميات المدن — مخفية افتراضياً، تظهر فقط بعد اختيار الدولة */
  _mapCityGroups={};
  arabFeats.forEach(feat=>{
    const id=+feat.id, d=ARAB_MAP_DATA[id]; if(!d) return;
    const cityG=g.append('g').attr('pointer-events','none').style('display','none');
    _mapCityGroups[id]=cityG;

    const drawLabel=(x,y,text,size,weight)=>{
      [['white',3],[null,0]].forEach(([stroke,sw])=>{
        const t=cityG.append('text').attr('x',x).attr('y',y).attr('dominant-baseline','middle')
          .attr('font-family',"Tajawal, sans-serif").attr('font-size',size+'px').attr('font-weight',weight)
          .attr('fill',stroke?'white':'#1a0800');
        if(stroke) t.attr('stroke','white').attr('stroke-width',sw).attr('paint-order','stroke');
        t.text(text);
      });
    };
    const cp=proj(d.capXY);
    if(cp&&!isNaN(cp[0])){
      cityG.append('circle').attr('cx',cp[0]).attr('cy',cp[1]).attr('r',3.8).attr('fill','#bf1f1f').attr('stroke','white').attr('stroke-width',1.5);
      drawLabel(cp[0]+6,cp[1],d.capAr,10,'600');
    }
    (d.cities||[]).filter(c=>!c.isC).forEach(c=>{
      const pt=proj(c.xy); if(!pt||isNaN(pt[0])) return;
      cityG.append('circle').attr('cx',pt[0]).attr('cy',pt[1]).attr('r',2.6).attr('fill','#2c2c2c').attr('stroke','white').attr('stroke-width',1.1);
      drawLabel(pt[0]+5,pt[1],c.ar,9,'400');
    });
  });

  console.log('AZZA Map: اكتمل الرسم بنجاح ✓');
  _mapHideLoading();
}

/* ── شاشة التحميل والأخطاء ── */
function _mapHideLoading(){
  const el=document.getElementById('arab-map-loading');
  if(el){ el.style.opacity='0'; setTimeout(()=>{ el.style.display='none'; },650); }
}

function _mapShowError(message){
  const el=document.getElementById('arab-map-loading');
  if(!el) return;
  el.style.opacity='1';
  el.style.display='flex';
  el.innerHTML='<div style="text-align:center;color:#fff;max-width:340px;padding:0 20px">'+
    '<div style="font-size:32px;margin-bottom:14px">⚠️</div>'+
    '<div style="font-family:\'Tajawal\',sans-serif;font-size:14px;line-height:1.8;opacity:.92">'+message+'</div>'+
    '</div>';
}

/* ── اختيار/إلغاء اختيار دولة ── */
function _mapSelectCountry(id,feat){
  const data=ARAB_MAP_DATA[id]; if(!data) return;
  if(_mapCountryPaths){
    _mapCountryPaths.attr('fill',d=>ARAB_MAP_DATA[+d.id]?.color||'#d4c5a9').style('filter','none');
    const c=d3.color(data.color);
    _mapCountryPaths.filter(d=>+d.id===id).raise()
      .attr('fill',c?c.darker(.38).toString():'#b09878')
      .style('filter','drop-shadow(0 4px 9px rgba(0,0,0,.32))');
  }
  Object.entries(_mapCityGroups).forEach(([gid,grp])=>{
    grp.style('display',+gid===id?'block':'none');
  });
  _mapSelectedCountryId=id;
  _mapSelectedCityIdx=null;
  _mapUpdateInfoPanel(data);

  const sel=document.getElementById('arab-map-country-sel');
  if(sel) sel.value=String(id);
  const hint=document.getElementById('arab-map-hint');
  if(hint) hint.style.display='none';

  /* الزووم التلقائي على الدولة المختارة — يعمل سواء جاء الاختيار من الضغط المباشر أو القائمة المنسدلة */
  const targetFeat=feat||_mapFeatures?.find(f=>+f.id===id);
  if(targetFeat) _mapZoomToFeature(targetFeat);
}

function _mapDeselectCountry(){
  if(_mapCountryPaths) _mapCountryPaths.attr('fill',d=>ARAB_MAP_DATA[+d.id]?.color||'#d4c5a9').style('filter','none');
  Object.values(_mapCityGroups).forEach(grp=>grp.style('display','none'));
  _mapSelectedCountryId=null;
  _mapSelectedCityIdx=null;

  const panel=document.getElementById('arab-map-info-panel');
  if(panel) panel.style.transform='translateX(-108%)';
  const zoomCtrl=document.getElementById('arab-map-zoom-ctrl');
  if(zoomCtrl) zoomCtrl.style.left='20px';
  const countrySel=document.getElementById('arab-map-country-sel');
  if(countrySel) countrySel.value='';
  const citySel=document.getElementById('arab-map-city-sel');
  if(citySel){ citySel.innerHTML='<option value="">— اختر المدينة —</option>'; citySel.disabled=true; }
  const statsBox=document.getElementById('arab-map-city-stats');
  if(statsBox) statsBox.style.display='none';
}

/* ── تحديث لوحة معلومات الدولة الجانبية ── */
function _mapUpdateInfoPanel(data){
  const strip=document.getElementById('arab-map-info-strip'); if(strip) strip.style.background=data.color;
  const setT=(id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
  setT('arab-map-info-ar',data.ar);
  setT('arab-map-info-en',data.en);
  setT('arab-map-cap-ar',data.capAr);
  setT('arab-map-cap-en',data.capEn);
  setT('arab-map-pop',data.pop);
  setT('arab-map-area',data.area);

  const citiesListEl=document.getElementById('arab-map-cities-list');
  if(citiesListEl){
    const majorCities=(data.cities||[]).filter(c=>!c.isC);
    citiesListEl.innerHTML=majorCities.map(c=>
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">'+
      '<span style="width:8px;height:8px;background:#333;border-radius:50%;border:1.5px solid #fff;box-shadow:0 0 0 1px #333;flex-shrink:0"></span>'+
      '<div style="display:flex;align-items:baseline;gap:5px;flex-wrap:wrap">'+
      '<span style="font-family:\'Tajawal\',sans-serif;font-size:13.5px;color:#1a1e28">'+c.ar+'</span>'+
      '<span style="font-family:\'Tajawal\',sans-serif;font-size:11px;color:#8a9aaa;font-style:italic">'+c.en+'</span>'+
      '</div></div>'
    ).join('');
  }

  const citySel=document.getElementById('arab-map-city-sel');
  if(citySel){
    citySel.innerHTML='<option value="">— اختر المدينة —</option>'+
      (data.cities||[]).map((c,i)=>'<option value="'+i+'">'+c.ar+'</option>').join('');
    citySel.disabled=false;
  }

  const panel=document.getElementById('arab-map-info-panel');
  if(panel) panel.style.transform='translateX(0)';
  const zoomCtrl=document.getElementById('arab-map-zoom-ctrl');
  if(zoomCtrl) zoomCtrl.style.left='300px';
  const statsBox=document.getElementById('arab-map-city-stats');
  if(statsBox) statsBox.style.display='none';
}

/* ── إحصائيات المدينة الحقيقية (من مستخدمي AZZA الفعليين) ── */
function _mapShowCityStats(city){
  const box=document.getElementById('arab-map-city-stats');
  if(!box) return;
  if(!city){ box.style.display='none'; return; }
  box.style.display='block';
  box.style.borderTopColor=ARAB_MAP_DATA[_mapSelectedCountryId]?.color||'#888';

  const setT=(id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
  setT('arab-map-stats-ar',city.ar);
  setT('arab-map-stats-en',city.en);

  _mapCityFilterRole='';
  _mapRenderCityUsers(city);
}

function _mapGetCityUsers(city){
  if(!city.city_id||typeof getUsers!=='function') return [];
  const me=(typeof getMe==='function')?getMe():null;
  return getUsers().filter(u=>u.city===city.city_id && (!me||u.id!==me.id));
}

function _mapRenderCityUsers(city){
  const allUsers=_mapGetCityUsers(city);
  const totalEl=document.getElementById('arab-map-stats-total');
  if(totalEl){
    totalEl.textContent=city.city_id
      ? allUsers.length+' مسجّل في هذه المدينة على عزّة'
      : 'هذه المدينة غير مرتبطة بنظام التسجيل بعد';
  }

  const roleCounts={};
  allUsers.forEach(u=>{
    const t=(typeof vType==='function')?vType(u):(u.type||'idea');
    roleCounts[t]=(roleCounts[t]||0)+1;
  });

  const filtersEl=document.getElementById('arab-map-role-filters');
  if(filtersEl){
    const roleEntries=Object.entries(roleCounts);
    if(roleEntries.length===0){
      filtersEl.innerHTML='';
    }else{
      const allBtn='<button class="arab-map-role-chip'+(_mapCityFilterRole===''?' on':'')+'" data-role="">الكل ('+allUsers.length+')</button>';
      const roleBtns=roleEntries.map(([role,count])=>{
        const label=(typeof VERIFY!=='undefined'&&VERIFY[role])?VERIFY[role].label:role;
        return '<button class="arab-map-role-chip'+(_mapCityFilterRole===role?' on':'')+'" data-role="'+role+'">'+label+' ('+count+')</button>';
      }).join('');
      filtersEl.innerHTML=allBtn+roleBtns;
      filtersEl.querySelectorAll('.arab-map-role-chip').forEach(btn=>{
        btn.addEventListener('click',()=>{
          _mapCityFilterRole=btn.dataset.role;
          _mapRenderCityUsers(city);
        });
      });
    }
  }

  const filtered=_mapCityFilterRole
    ? allUsers.filter(u=>((typeof vType==='function')?vType(u):(u.type||'idea'))===_mapCityFilterRole)
    : allUsers;

  const listEl=document.getElementById('arab-map-users-list');
  if(!listEl) return;
  if(filtered.length===0){
    listEl.innerHTML='<div style="font-family:\'Tajawal\',sans-serif;font-size:12px;color:#9a9a9a;text-align:center;padding:14px 0">لا يوجد مسجّلون بهذا التصنيف بعد</div>';
    return;
  }
  listEl.innerHTML=filtered.map(u=>{
    const t=(typeof vType==='function')?vType(u):(u.type||'idea');
    const vc=(typeof VERIFY!=='undefined'&&VERIFY[t])?VERIFY[t]:{label:t,color:'#666',bg:'#f2f2f2'};
    return '<a href="user.html?id='+u.id+'" style="display:flex;justify-content:space-between;align-items:center;padding:8px 11px;border:1px solid #ece8e0;border-radius:6px;text-decoration:none;color:inherit;background:#fff">'+
      '<span style="font-family:\'Tajawal\',sans-serif;font-size:12.5px;font-weight:600;color:#1a1e28">'+(u.name||u.username||'مستخدم')+'</span>'+
      '<span style="font-family:\'Tajawal\',sans-serif;font-size:10.5px;color:'+vc.color+';background:'+vc.bg+';border-radius:999px;padding:2px 9px;font-weight:700">'+vc.label+'</span>'+
      '</a>';
  }).join('');
}

/* ── الزووم على دولة/مدينة محددة ── */
function _mapZoomToFeature(feat){
  if(!_mapSvg||!_mapZoom||!_mapPathFn) return;
  const el=document.getElementById('arab-map-svg-mount'); if(!el) return;
  const W=el.clientWidth, H=el.clientHeight;
  const [[x0,y0],[x1,y1]]=_mapPathFn.bounds(feat);
  const scale=Math.max(.5,Math.min(8,.8/Math.max((x1-x0)/W,(y1-y0)/H)));
  const tx=W/2-scale*(x0+x1)/2, ty=H/2-scale*(y0+y1)/2;
  _mapSvg.transition().duration(820).ease(d3.easeCubicInOut)
    .call(_mapZoom.transform,d3.zoomIdentity.translate(tx,ty).scale(scale));
}

function _mapZoomToCity(xy){
  if(!_mapSvg||!_mapZoom||!_mapProj) return;
  const el=document.getElementById('arab-map-svg-mount'); if(!el) return;
  const W=el.clientWidth, H=el.clientHeight;
  const pt=_mapProj(xy); if(!pt||isNaN(pt[0])) return;
  const sc=7, tx=W/2-sc*pt[0], ty=H/2-sc*pt[1];
  _mapSvg.transition().duration(720).ease(d3.easeCubicInOut)
    .call(_mapZoom.transform,d3.zoomIdentity.translate(tx,ty).scale(sc));
}