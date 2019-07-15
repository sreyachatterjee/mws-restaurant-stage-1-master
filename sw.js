const currentCacheName = 'restrnt-reviews-v1';

const cacheFileNames = ['./',
    './index.html', './restaurant.html', './css/styles.css',
    './js/main.js', './js/restaurant_info.js', './js/dbhelper.js', './js/sw_registration.js',       
    './img/1.jpg', './img/2.jpg', 'img/3.jpg', './img/4.jpg', './img/5.jpg', './img/6.jpg', './img/7.jpg', './img/8.jpg', './img/9.jpg', 
    './img/10.jpg',
    './data/restaurants.json', 
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
    ];

/**
 * Installation of Service worker and cache all pages and assets required for offline access
 */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(currentCacheName).then(function(cache){
      return cache.addAll(cacheFileNames);
    })
  );
});

/**
 * Activation of Service worker and delete old cache (if any) add new cache
 */
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.filter(function(cacheName){
          return cacheName.startsWith('restrnt-') && cacheName != currentCacheName;
        }).map(function(cacheName){
            return caches.delete(cacheName);
          })
      );
    })
  );
});


/***
 * Intercept all request and match against the cache to respond accordingly
 */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        console.log('found', e.request, 'in cache');
        return response;
      }
      else{
        console.log('not found', e.request, 'in cache, fetching');
        return fetch(e.request)
        .then(function(response){
          const clonedResponse = response.clone();
          caches.open(currentCacheName).then(function(cache){
            cache.put(e.request, clonedResponse);
          })
          return response;
        })
        .catch(function(err){
          console.error(err);
        });
      }
    })
  );
});

