angular.module('ugApp', ['ngRoute', 'ngResource', 'ngCookies'])
.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/', {
    templateUrl: 'views/home.html',
    controller: 'mainController'
  })
  .when('/about', {
    templateUrl: 'views/about.html',
    controller: 'aboutController'
  })
  .when('/skills', {
    templateUrl: 'views/skills.html',
    controller: 'skillsController'
  })
  .when('/work', {
    templateUrl: 'views/work.html',
    controller: 'workController'
  })
  .when('/contact', {
    templateUrl: 'views/contact.html',
    controller: 'contactController'
  })
  .otherwise('/');


})
.service('translationService', function ($resource, $cookies) {
  if (!$cookies.lang)
    $cookies.lang = 'en';
  this.getTranslation = function (callback) {
    $resource('lang/lang.json').get(callback);
  };
})
.run(function ($location, $window, $rootScope) {
  var doScroll = function (e) {
    $rootScope.$apply(function () {
      //cross-browser wheel delta
      e = window.event || e;
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

      // Do something with `delta`
      if (-1 === delta) {
        if ($location.path() === '/') {
          $location.path('/about');
          $('html,body').animate({ scrollTop: $('#main-nav').offset().top }, "slow");
        } else if ($location.path() === '/about')
        $location.path('/skills');
        else if ($location.path() === '/skills')
          $location.path('/work');
        else if ($location.path() === '/work')
          $location.path('/contact');
      }
      else if (1 === delta) {
        if ($location.path() === '/contact')
          $location.path('/work');
        else if ($location.path() === '/work')
          $location.path('/skills');
        else if ($location.path() === '/skills')
          $location.path('/about');
        else if ($location.path() === '/about') {
          $location.path('/');
          $('html,body').animate({ scrollTop: $('#cover').offset().top }, "slow");
        }
      }

      e.preventDefault();

    });
  };

  if (window.addEventListener) {
    window.addEventListener("mousewheel", doScroll, false);
    window.addEventListener("DOMMouseScroll", doScroll, false);
  } else {
    window.attachEvent("onmousewheel", doScroll);
    window.attachEvent("onwheel", doScroll);
  }
})
.controller('mainController', function ($scope, $location, $route, $cookies, $anchorScroll, translationService) {
  $scope.alerts = []
  //$('html,body').animate({ scrollTop: $('#cover').offset().top }, "slow");
  if (!$scope.translation)
    translationService.getTranslation(function(data) {
      $scope.translation = data;
      $scope.text = data[$cookies.lang]
    });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
    .then(function(registration) {
        if(registration.installing) {
          console.log('Service worker installing');
          $scope.offline_alert = 'This site is now available offline';
        } else if(registration.waiting) {
          console.log('Service worker installed');          
        } else if(registration.active) {
          console.log('Service worker active');
        }
    }).catch(function(error) {
    })
  }

  $scope.cookie_alert = 'I use cookies to store your language prefrence';

  $scope.getClass = function (path) {
    if ($location.path() == path) {
      return "active"
    } else {
      return "inactive"
    }
  }

  $scope.scrollToTop = function (pos) {
    $('html,body').animate({ scrollTop: $(pos).offset().top }, "slow");
  }

  $scope.changeLang = function () {
    if ($cookies.lang == 'en')
      $cookies.lang = 'fr';
    else
      $cookies.lang = 'en';

    $scope.text = $scope.translation[$cookies.lang]
  }
  $scope.otherLang = function () {
    if ($cookies.lang == 'en')
      $scope.text.CURRENT_LANG = 'fr';
    else
      $scope.text.CURRENT_LANG = 'en';
  }
  $scope.curLang = function () {
    if ($cookies.lang == 'en')
      $scope.text.CURRENT_LANG = 'en';
    else
      $scope.text.CURRENT_LANG = 'fr';
  }
})
.controller('aboutController', function ($scope, $location, translationService) {
  //translationService.getTranslation($scope);
})
.controller('skillsController', function ($scope, $location, translationService) {
  //translationService.getTranslation($scope);
})
.controller('workController', function ($scope, $location, translationService) {
  //translationService.getTranslation($scope);
})
.controller('contactController', function ($scope, $location, translationService) {
  //translationService.getTranslation($scope);
  var _host = ($location.host().indexOf("www.") > -1) ? $location.host().substr(4) : $location.host();
  $scope.via = "mail" + "to" + ":" + "live" + "@" + _host;
})
.directive('timeStampImg', function ($cookies, $window, $location) {
  return {
    restrict: 'ACE',
    link: function (scope, element, attrs, ctrl) {
      element.height(element.width() * 0.4326923076923077);
      $window.addEventListener('resize', function () {
        element.height(element.width() * 0.4326923076923077);
        if ($cookies.lang == 'fr') {
          element.css({
            "background-position": "0px 0px"
          });
        } else {
          element.css({
            "background-position": "0px -"+(element.height()-1)+"px"
          });
        }
        if ($location.path() === '/') {
          $('html,body').scrollTop($('#cover').offset().top);
        } else {
          $('html,body').scrollTop($('#main-nav').offset().top);
        }
      }, false);
      scope.$watch(
        function () {
          if ($cookies.lang == 'fr') {
            element.css({
              "background-position": "0px 0px"
            });
          } else {
            element.css({
              "background-position": "0px -"+(element.height()-1)+"px"
            });
          }
        }
      );
    }
  }
});