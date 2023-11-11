// Note: this MUST be at the rootmost dir. (says Google)

var CACHE_NAME = 'cyx-cache-3.11.0';
var urlsToCache = [
   'index.html'
  ,'css/play.css'
  ,'assets/jax.js'
  ,'js/lazyload.js'
  ,'js/leap-cursor.js'
  ,'js/timbre.js'
  ,'img/marks/goutte.png'
  ,'img/uvs/geode/anthracite.png'
  ,'img/uvs/geode/graphite.png'
  ,'img/css/bg.png'
  ,'img/css/menu/bg-hexagon.png'
  ,'img/gmf/loading.png'
  ,'img/cursors/hand.png'
  ,'img/cursors/hand_cyan.png'
  ,'img/cursors/hand_orange.png'
  ,'img/shapes/circle.png'
  ,'img/shapes/flower.png'
  ,'img/shapes/line.png'
  ,'img/shapes/triangle.png'
  ,'img/help/shapes.png'
  ,'typo/iceland-webfont.woff'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        //console.log('[Service Worker] Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      //console.log('[Service Worker] Trying to fetch', event.request, response);
      return response || fetch(event.request);
    })
  );
});
