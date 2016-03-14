// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic','ngCordova','starter.controllers', 'ionicLazyLoad']) 

.run(function($ionicPlatform, $ionicLoading, $state,$localstorage,$cordovaSplashscreen, $timeout, $cordovaPush, $rootScope) {
  $rootScope.flag=true;
  $rootScope.message="";
  $ionicPlatform.ready(function($scope) {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      console.log("keyboard");
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(false);
    }
    
    //batch
    //devkey = DEV56CBFB6BBE3411F544B30608A28
    //livekey = 56CBFB6BBCCA59D945DA7C9E85298A
    /*batch.setConfig({"androidAPIKey":"56CBFB6BBCCA59D945DA7C9E85298A",
            "iOSAPIKey":"<YOUR IOS APIKEY>"});
    batch.push.setGCMSenderID("1071866914808").setup();
    batch.start();
    batch.push.registerForRemoteNotifications();*/

    //airpush
    UAirship.setUserNotificationsEnabled(true);
    UAirship.getChannelID(function (channelID) {
      console.log("Channel: " + channelID)
    })
  });
})

.config(function($ionicConfigProvider){
  $ionicConfigProvider.navBar.alignTitle('center');
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

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller:'LoginCtrl'
      }
    }
  })

  .state('app.register', {
    url: '/register',
    views: {
      'menuContent': {
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl'
      }
    }
  })

  .state('app.forgot', {
    url: '/forgot',
    views: {
      'menuContent': {
        templateUrl: 'templates/forgot.html',
        controller: 'ForgotCtrl'
      }
    }
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
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
        controller: 'AboutCtrl'
      }
    }
  })

  .state('app.detailabout', {
    url: '/about/:aId',
    views: {
      'menuContent': {
        templateUrl: 'templates/detailabout.html',
        controller: 'AboutCtrl'
      }
    }
  })

  .state('app.socialmedia', {
    url: "/socialmedia",
    views: {
      'menuContent': {
        templateUrl: "templates/socialmedia.html",
        controller: 'SocialMediaCtrl'
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

  .state('app.album', {
    url: '/album',
    views: {
      'menuContent': {
        templateUrl: 'templates/album.html',
        controller: 'AlbumCtrl'
      }
    }
  })

  .state('app.photo', {
    url: '/photo/:idAlbum',
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
        templateUrl: 'templates/detailarticle.html',
        controller: 'ArticlesCtrl'
      }
    }
  })

  .state('app.technologies', {
    url: '/technology',
    views: {
      'menuContent': {
        templateUrl: 'templates/technology.html',
        controller: 'TechnologyCtrl'
      }
    }
  })

  .state('app.technology', {
    url: '/technology/:aId',
    views: {
      'menuContent': {
        templateUrl: 'templates/detailtechnology.html',
        controller: 'TechnologyCtrl'
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

  .state('app.mitracity', {
    url: '/mitracity',
    views: {
      'menuContent': {
        templateUrl: 'templates/mitracity.html',
        controller:'MitraCityCtrl'
      }
    }
  })

  .state('app.detailmitracity', {
    url: '/mitracity/:aId',
    views: {
      'menuContent': {
        templateUrl: 'templates/detailmitracity.html',
        controller:'MitraCityCtrl'
      }
    }
  })

  .state('app.input', {
    url: '/input',
    views: {
      'menuContent': {
        templateUrl: 'templates/input.html',
        controller: 'InputCtrl'
      }
    }
  })

  .state('app.profil', {
    url: '/profil',
    views: {
      'menuContent': {
        templateUrl: 'templates/profil.html',
        controller:'ProfilCtrl'
      }
    }
  })

  .state('app.products', {
    url: '/product',
    views: {
      'menuContent': {
        templateUrl: 'templates/product.html',
        controller:'ProductCtrl'
      }
    }
  })

  .state('app.product', {
    url: '/product/:aId',
    views: {
      'menuContent': {
        templateUrl: 'templates/detailproduct.html',
        controller:'ProductCtrl'
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

  .state('app.credit', {
    url: '/credit',
    views: {
      'menuContent': {
        templateUrl: 'templates/credit.html',
        controller:'CreditCtrl'
      }
    }
  })

  .state('app.splash', {
    url: '/splash',
    views: {
      'menuContent': {
        templateUrl: 'templates/splash.html',
        controller:'SplashCtrl'
      }
    }
  })

  .state('app.notif', {
    url: '/notif',
    views: {
      'menuContent': {
        templateUrl: 'templates/notif.html',
        controller:'NotifCtrl'
      }
    }
  })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/splash');
});
