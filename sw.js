var CACHE_NAME = "ShoppingList-v1.4";
var urlsToCache = [
  "//malarium.github.io/ShoppingList/styles.min.css",
  "//fonts.googleapis.com/css?family=Amatic+SC:400,700&amp;subset=latin-ext",
  "//cdnjs.cloudflare.com/ajax/libs/annyang/2.6.0/annyang.min.js",
  "//unpkg.com/vue@2.6.10"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log("fetched from cache: ", response);
        return response;
      }

      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== "basic" || response.type !== "cors") {
          console.log("fetched from the web: ", response);
          return response;
        }
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          console.log("added to cache: ", responseToCache);
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

self.addEventListener("activate", function(event) {
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
