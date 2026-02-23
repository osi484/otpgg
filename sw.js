const CACHE_NAME = 'zen-focus-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/rain.mp3',
  './assets/Ambience.mp3',
  './assets/Campfire.mp3',
  './assets/Ocean Waves.mp3'
];

// 서비스 워커 설치 및 리소스 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching initial assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 새로운 버전의 서비스 워커 활성화 및 오래된 캐시 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 네트워크 요청 가로채기 및 캐시 우선 전략 (Cache-First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시 데이터 반환, 없으면 네트워크 요청
        return response || fetch(event.request).then((networkResponse) => {
          // 동적으로 새로운 리소스를 캐시에 추가 (필요시)
          return caches.open(CACHE_NAME).then((cache) => {
            if (event.request.url.startsWith('http')) {
               // 오디오 파일 등 특정 리소스만 추가로 캐싱하고 싶을 때 확장 가능
            }
            return networkResponse;
          });
        });
      })
      .catch(() => {
        // 오프라인 상태에서 캐시에도 없을 때의 폴백 (예: index.html 반환)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});
