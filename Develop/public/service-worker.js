// const FILES_TO_CACHE = [
//     "/",
//     "/index.js",
//     "/db.js",
//     "/manifest.json",
//     "/styles.css",
//     "/icons/icon-192x192.png",
//     "/icons/icon-512x512.png"
// ];
  
// const CACHE_NAME = "static-cache-v2";
// const DATA_CACHE_NAME = "data-cache-v1";
  
// self.addEventListener("install", function(evt) {
//     evt.waitUntil(
//       caches.open(CACHE_NAME).then(cache => {
//         console.log("Your files were pre-cached successfully!");
//         return cache.addAll(FILES_TO_CACHE);
//       })
//     );
  
//     self.skipWaiting();
// });
  
// self.addEventListener("activate", function (evt) {
//     evt.waitUntil(
//         caches.keys().then(keyList => {
//             return Promise.all(
//                 keyList.map(key => {
//                     if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
//                         console.log("Removing old cache data", key);
//                         return caches.delete(key);
//                     }
//                 })
//             );
//         })
//     );
//     self.clients.claim();
// });
  
// self.addEventListener("fetch", function (evt) {
//     if (evt.request.url.includes("/api/")) {
//         evt.respondWith(
//             caches.open(DATA_CACHE_NAME).then(cache => {
//                 return fetch(evt.request)
//                     .then(response => {
//                         if (response.status === 200) {
//                             cache.put(evt.request.url, response.clone());
//                         }

//                         return response;
//                     })
//                     .catch(err => {
//                         // Network request failed, try to get it from the cache.
//                         return cache.match(evt.request);
//                     });
//             }).catch(err => console.log(err))
//         );
//         return;
//     }
//     evt.respondWith(
//         caches.match(evt.request).then(function (response) {
//             return response || fetch(evt.request);
//         })
//     );
// });

var CACHE_NAME = "my-site-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

var urlsToCache = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.json",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

self.addEventListener("install", function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  // cache all get requests to /api routes
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(event.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          // return the cached home page for all requests for html pages
          return caches.match("/");
        }
      });
    })
  );
});