this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        'index.html',
        '404.html',
        'cover.png',
        'favicon.png',
        '/img/github.png',
        '/img/google_plus_b.png',
        '/img/linkedin_b.png',
        '/img/skype_b.png',
        '/img/twitter_b.png',
        '/js/',
        '/js/angular.min.js',
        '/js/angular-cookies.min.js',
        '/js/angular-resource.min.js',
        '/js/angular-route.min.js',
        '/js/jquery.min.js',
        '/js/Script.js',
        '/lang/lang.json',
        '/css/style.css',
        '/css/timeline.css',
        '/views/about.html',
        '/views/contact.html',
        '/views/home.html',
        '/views/skills.html',
        '/views/work.html'

      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open('v1').then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function() {
    return caches.match('404.html');
  }));
});