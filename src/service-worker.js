var staticCacheName = 'railway-static-v1';

self.addEventListener('install', function (event) {
    console.log("install a fetch !");
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                '/',
                './js/railway.js',
                './js/idb.js',
                './js/offlineData.js',
                './css/style.css'
            ]);
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('railway-static-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    var requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/src' || requestUrl.pathname.startsWith('/src/js/') || requestUrl.pathname.startsWith('/src/css/')) {
            event.respondWith(caches.open(staticCacheName).then(function (cache) {
                return cache.match(requestUrl).then(function (response) {
                    if (response) {
                        return response;
                    }

                    return fetch(event.request).then(function (networkResponse) {
                        if (networkResponse.status < 400) {

                            cache.put(requestUrl, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(function (error) {
                        /*return caches.match('/js/src/index2.html');*/
                    });
                });
            }));

            return;
        }
    }


    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
