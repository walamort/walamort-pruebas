(function(root){'use strict';const shapes={
 note:'<path d="M9 18V5l11-2v12M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="15" rx="3" ry="2"/>',
 ear:'<path d="M8 17c0 5 6 5 6 1 0-3 6-3 6-9A8 8 0 0 0 4 9m4 3c-3-4 3-8 6-4 2 3-3 4-3 7"/>',
 rhythm:'<path d="M5 21 9 3h6l4 18ZM7 15h10M12 17l5-10"/><circle cx="12" cy="17" r="1"/>',
 book:'<path d="M12 5C8 2 3 3 3 3v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2Zm0 0v16"/>',
 keys:'<rect x="2" y="5" width="20" height="15" rx="2"/><path d="M7 5v9H5V5m7 0v9h-2V5m9 0v9h-2V5M8 14v6m6-6v6"/>',
 guitar:'<path d="m14 10 6-7 2 2-7 7c3 7-4 10-7 7-7 2-9-7-3-9 2-4 6-3 9 0Z"/><circle cx="10" cy="14" r="2"/>',
 layers:'<path d="m12 3 10 5-10 5L2 8Zm-10 10 10 5 10-5M2 18l10 5 10-5"/>',
 wave:'<path d="M2 12h3l3-8 4 16 4-13 3 5h3"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',
 home:'<path d="m3 10 9-8 9 8v11h-7v-7h-4v7H3Z"/>',
 chart:'<path d="M3 3v18h19M7 17v-5m5 5V7m5 10V4"/>',
 settings:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
 trophy:'<path d="M7 3h10v7a5 5 0 0 1-10 0Zm0 2H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4m-5 3v6m-4 0h8"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-13 4h2m4 0h2"/>',
 compass:'<circle cx="12" cy="12" r="10"/><path d="m16 7-2 7-6 3 2-7Z"/>',
 check:'<path d="m5 12 4 4L20 5"/><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10"/>',
 spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',
 direction:'<path d="M5 20V4m-3 4 3-4 3 4m11-4v16m-3-4 3 4 3-4"/>'};
const aliases={reading:'note',intervalTheory:'note',keys:'keys',interval:'ear',scale:'ear',dictation:'keys',rhythmTheory:'rhythm',rhythmDictation:'rhythm',rhythmLab:'rhythm',chord:'layers',chordTheory:'layers',progression:'wave',intonation:'mic',tuner:'target',inversion:'layers',scaleDegree:'compass',meterTheory:'rhythm',lessons:'book',practice:'target',progress:'chart',dictionary:'keys'};
function svg(name){return '<svg class="app-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(shapes[aliases[name]||name]||shapes.spark)+'</svg>';}
const api={svg};if(typeof module==='object'&&module.exports)module.exports=api;else root.AcademyIcons=api;
})(typeof window==='object'?window:globalThis);
