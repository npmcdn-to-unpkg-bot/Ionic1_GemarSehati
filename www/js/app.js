// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core','ngCordova', 'ionic.service.core','ionic.service.push','starter.controllers','flexcalendar' , 'pascalprecht.translate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider,$ionicAppProvider){
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicAppProvider.identify({
    app_id:'0b54bf40',
    api_key:'5fbb872afcd7c687bd5a0ec004492b9adde4c7ac56270c62',
    dev_push:true
  });
})

.filter('trustAsResourceUrl', ['$sce', function($sce) {
return function(val) {
    return $sce.trustAsResourceUrl(val);
};
}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })


  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html'
  })

  .state('app.login', {
    url: "/login",
    views: {
      'menuContent': {
        templateUrl: "templates/login.html"
      }
    }
  })

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html'
  })



  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html"
      }
    }
  })

  .state('app.event', {
      url: '/event',
      views: {
        'menuContent': {
          templateUrl: 'templates/event.html',
          controller: 'EventCtrl'
        }
      }
    })

  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html",
        controller: 'PDFCtrl'
      }
    }
  })

  .state('app.socialmedia', {
    url: "/socialmedia",
    views: {
      'menuContent': {
        templateUrl: "templates/socialmedia.html"
      }
    }
  })

    

    .state('app.video', {
      url: '/video',
      views: {
        'menuContent': {
          templateUrl: 'templates/video.html',
          controller: 'VideoCtrl'
        }
      }
    })

.state('app.photo', {
      url: '/photo',
      views: {
        'menuContent': {
          templateUrl: 'templates/photo.html',
          controller: 'PhotoCtrl'
        }
      }
    })

.state('app.pdf', {
    url: "/pdf",
    views: {
      'menuContent': {
        templateUrl: "templates/pdf.html",
        controller: 'PDFCtrl'
      }
    }
  })
.state('app.articles', {
      url: '/articles',
      views: {
        'menuContent': {
          templateUrl: 'templates/articles.html',
          controller: 'ArticlesCtrl'
        }
      }
    })
.state('app.article', {
      url: '/articles/:aId',
      views: {
        'menuContent': {
          templateUrl: 'templates/article.html',
          controller: 'ArticlesCtrl'
        }
      }
    })

.state('app.testimoni', {
      url: '/testimoni',
      views: {
        'menuContent': {
          templateUrl: 'templates/testimoni.html',
          controller : 'TestimoniCtrl'
        }
      }
    })

.state('app.mitrafinder', {
      url: '/mitrafinder',
      views: {
        'menuContent': {
          templateUrl: 'templates/mitrafinder.html',
          controller : 'MitraFinderCtrl'
        }
      }
    })

    .state('app.contactus', {
      url: '/contactus',
      views: {
        'menuContent': {
          templateUrl: 'templates/contactus.html',
          controller: 'ContactCtrl'
        }
      }
    })

    .state('app.push', {
      url: '/push',
      views: {
        'menuContent': {
          templateUrl: 'templates/push.html',
          controller: 'PushCtrl'
        }
      }
    })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/push');
});
