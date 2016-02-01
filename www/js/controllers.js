var app = angular.module('starter.controllers', ['ngSanitize','wu.masonry','ionicLazyLoad','flexcalendar','pascalprecht.translate'])

/*====================================
=            Maps Factory            =
====================================*/

.factory('Markers', function($http) {

  var markers = [];

  return {
    getMarkers: function(){

      return $http.get("http://www.gemarsehati.com/enagic/api/getmitra").then(function(response){
          markers = response;
          return markers;
      });

    }
  }
})

.factory('Events', function($http) {

  var event = [];

  return {
    getEvents: function(){

      return $http.get("http://www.gemarsehati.com/enagic/api/getevent").then(function(response){
          events = response;
          //console.log(events.data[0].date);
          return events.data;
      });
    },
    getDateEvents: function(id){
      return $http.get("http://www.gemarsehati.com/enagic/api/getevent").then(function(response){
          events = response;
          result = events.data[id].date;
          return result;
      }); 
    }
  }
})

.factory('GoogleMaps', function($cordovaGeolocation, Markers){

  var apiKey = false;
  var map = null;
  var currentCoordinate;
  var dataDetailMitra;

  function initMap(){

    var options = {timeout: 10000, enableHighAccuracy: true};

    temp = $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      
      var currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      setCurrentCoordinate(currentLatLng);

      var mapOptions = {
        center: currentLatLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
      temp = google.maps.event.addListenerOnce(map, 'idle', function(){

        //Load the markers
        loadMarkers();
        loadCurrentPosMarkers(currentLatLng);
      });

    }, function(error){
      console.log("Could not get location");

        //Load the markers
        loadMarkers();
    });
    //console.log(temp);

  }

  function loadCurrentPosMarkers(){
    currentLatLng = getCurrentCoordinate();
    var image = '/img/marker.png';
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: currentLatLng, 
            icon: image
        });
    var infoWindowContent = "<h4>Posisi anda sekarang</h4>";
    addInfoWindow(marker, infoWindowContent, 0);
  }

  function loadMarkers(){

    currentLatLng = getCurrentCoordinate();
    //console.log(temp);

      //Get all of the markers from our Markers factory
      temp = Markers.getMarkers().then(function(markers){
        //get length markers
        
        //console.log(currentLatLng);
        var lengthMarkers = Object.keys(markers.data).length ;

        //variable for find nearest distance
        var closestMarker = -1;
        var closestDistance = Number.MAX_VALUE;
        var iki={};
        var image = '/img/marker.png';
        var count=0;
        for (var i = 0; i < lengthMarkers; i++) {
          var marker = markers.data;
          var dataMarker = markers.data;

          //variable for coordinate
          var koordinatFix = marker[i].koordinat.split(",");
          var koordinatLat = koordinatFix[0];
          var koordinatLng = koordinatFix[1];

          //set coordinate to markerPos
          var markerPos = new google.maps.LatLng(koordinatLat, koordinatLng);

          //find nearest distance
          var distance = google.maps.geometry.spherical.computeDistanceBetween(currentLatLng,markerPos);
          //find nearest marker
          /*if(distance < closestDistance){
            closestMarker=i;
            closestDistance=distance;
            closestPos=markerPos;
            //
          }*/

          //find marker in radius 20km
          

          // Add the all marker to the map
          // 
          if(distance<=20000){
            //console.log(dataMarker[i]);
            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: markerPos,
                icon: image
            });
            iki[count]=dataMarker[i];
            count++;
            //set information to marker
            var infoWindowContent = "<h4>" + dataMarker[i].nama + "</h4>";
            addInfoWindow(marker, infoWindowContent, dataMarker[i]);
          }
        }

        // Add the nearest marker to the map
        
        /*var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: closestPos, 
            icon: image
        });

        //set information to marker
        var infoWindowContent = "<h4>" + dataMarker[closestMarker].nama + "</h4>";
        addInfoWindow(marker, infoWindowContent, dataMarker[closestMarker]);
        //console.log("jarak terdekat:",closestDistance,"marker ke: ",dataMarker[closestMarker].koordinat);
        //
        var iki = dataMarker[closestMarker];
        //console.log(iki);
        setDataNearestMitra(iki);
        //console.log(getDataNearestMitra());
        //$scope.temp=closestMarker;*/

        //console.log(iki);
        var circle = new google.maps.Circle({
          map: map,
          radius: 20000,    // metres
          fillColor: '#AA0000'
        });
        circle.bindTo('center', marker, 'position');

        return iki;
      }); 
    return temp;
  }

  function setDataNearestMitra(dataDetailMitra){
    this.dataDetailMitra=dataDetailMitra;
    //console.log(this.dataDetailMitra)
    //return dataDetailMitra;
  }

  function getDataNearestMitra(){
    dataDetailMitra=this.dataDetailMitra;
    //console.log(dataDetailMitra);
    return dataDetailMitra;
  }

  function setCurrentCoordinate(currentCoordinate){
    //  console.log(currentCoordinate);
    this.currentCoordinate=currentCoordinate;
    return currentCoordinate;
  }

  function getCurrentCoordinate(){
    currentCoordinate=this.currentCoordinate;
    //console.log(currentCoordinate);
    return currentCoordinate;
  }

  function addInfoWindow(marker, message, record) {

      var infoWindow = new google.maps.InfoWindow({
          content: message
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });
      
  }

  return {
    init: function(){
      initMap();
    },
    getDetailMitra: function(){
      temp = loadMarkers();

      //console.log(temp);
      return temp;
    },
    getMitra: function(){
      temp = getDataNearestMitra();
      //console.log(temp);
      return temp;
    }
  }

})

/*=====  End of Maps Factory  ======*/


.filter('inSlicesOf', 
    ['$rootScope',  
    function($rootScope) {
      makeSlices = function(items, count) { 
        if (!count)            
          count = 3;
        
        if (!angular.isArray(items) && !angular.isString(items)) return items;
        
        var array = [];
        for (var i = 0; i < items.length; i++) {
          var chunkIndex = parseInt(i / count, 10);
          var isFirst = (i % count === 0);
          if (isFirst)
            array[chunkIndex] = [];
          array[chunkIndex].push(items[i]);
        }

        if (angular.equals($rootScope.arrayinSliceOf, array))
          return $rootScope.arrayinSliceOf;
        else
          $rootScope.arrayinSliceOf = array;
          
        return array;
      };
      
      return makeSlices; 
    }]
  )

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
.controller('PDFCtrl', function($scope, $http, $state,$sce) {
    $http({
      method: 'get', 
      url: 'http://www.gemarsehati.com/enagic/api/getpdfall', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.pdfs = data;
      $scope.doRefresh = function(){
        $http({
          method: 'get', 
          url: 'http://www.gemarsehati.com/enagic/api/getpdfall'
        })
        .success(function(data){
          $scope.pdfs=data;

          //$scope.$broadcast('scroll.refreshComplete');
        })
      }
    });
})
/*.controller('PhotoCtrl', function($scope){
  $scope.images = [];
  $scope.loadImages = function(){
    for(var i = 0; i<10;i++){
      $scope.images.push({id:i, src:"http://placehold.it/50x50"});
    }
  }*/
.controller('PhotoCtrl', function($scope, $http, $state,$sce,$ionicModal, $ionicBackdrop, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
/*  $scope.singers = ['img/shakira.jpg','img/justin.jpg','img/selena.jpg','img/adam.jpg'];*/
  $http({
      method: 'get', 
      url: 'http://www.gemarsehati.com/enagic/api/getphoto',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .success(function(data){
      $scope.photos = data;
    });
  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    /*$scope.showModal('templates/image-popover.html');*/
    $scope.showModal('templates/image-zoom.html');
  }
 
  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }
 
  // Close the modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove()
  };
  $scope.updateSlideStatus = function(slide) {
  var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
  if (zoomFactor == $scope.zoomMin) {
    $ionicSlideBoxDelegate.enableSlide(true);
  } else {
    $ionicSlideBoxDelegate.enableSlide(false);
  }
};
})

.controller('VideoCtrl', function($scope, $http, $state,$sce) {
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
    $http({
      method: 'get', 
      url: 'http://www.gemarsehati.com/enagic/api/getvideo', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.videos = data;
      /*var myId = getId($scope.videos.link);
      console();
      var myCode = "http://www.youtube.com/embed/"+ myId;
      alert(myCode);*/
      //$scope.videos.link=myCode;

      $scope.doRefresh = function(){
        $http({
          method: 'get', 
          url: 'http://www.gemarsehati.com/enagic/api/getvideo'
        })
        .success(function(data){
          $scope.videos=data;

          //$scope.$broadcast('scroll.refreshComplete');
        })
      }
    });
    var myUrl = $('#video-link').val();
    //myId = getId(myUrl);
    //$('#video-link').html('<iframe width="560" height="315" src="//www.youtube.com/embed/' + myId + '" frameborder="0" allowfullscreen></iframe>');
})

/*.controller('VideoCtrl',['$scope', '$http','$state',
  function($scope, $http){
    $http.get('js/video.json').success(function(resp) {
      //console.log('Success', resp);
      $scope.videos = resp.video;  
    // For JSON responses, resp.data contains the result
  }, 
  function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })
}])*/

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('TestimoniCtrl', function($http,$scope, $stateParams) {
  $http({
      method: 'get', 
      url: 'http://www.gemarsehati.com/enagic/api/gettestimoni', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.testimonis = data;

      $scope.doRefresh = function(){
        $http({
          method: 'get', 
          url: 'http://www.gemarsehati.com/enagic/api/gettestimoni'
        })
        .success(function(data){
          $scope.testimonis=data;}
        );
      }
  });
})

.controller('ArticlesCtrl', function($http,$scope, $stateParams,$state) {
  $http({
      method: 'get', 
      url: 'http://www.gemarsehati.com/enagic/api/getarticles', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.articles = data;
      $scope.whicharticle = $state.params.aId;
      var myJSONString = JSON.stringify(data);
      var myEscapedJSONString = myJSONString.replace(/\\r/g, "\\r")
                                            .replace(/\\n/g, "\\n");
      //console.log(myJSONString);

      $scope.doRefresh = function(){
        $http({
          method: 'get', 
          url: 'http://www.gemarsehati.com/enagic/api/getarticles'
        })
        .success(function(data){
          $scope.articles=data;}
        );
      }
  });
})

.controller('EventCtrl',function($rootScope,$http,$scope, Events) {
  /*$http({
      method: 'get', 
      url: 'http://www.gemarsehati.com/enagic/api/getevent', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  .success(function(data){
    $scope.event = data;
    $scope.date=data[0].date;
    //console.log(date);
  });*/

  //$scope.events = Events.getEvents();
  //console.log($scope.events);

  $rootScope.temp;
  Events.getEvents().then(function(data){

      //$scope.events= data.date;
      $rootScope.temp=data[0].date;
      $rootScope.temp="2012-02-02";
      //console.log($scope.events);
      //console.log(temp);
      //bismillah();      //return $scope.events;
      //panggil fungsi scope events
    })

  //console.log($rootScope.temp);
  var hadu = Events.getDateEvents(0).then(function(data){
    temp = data;
    return temp;
  });

  //console.log(hadu);
  var temp2 = Events.getEvents();
  //console.log(temp2);
  $scope.options = {
    defaultDate: "2016-02-01",
    minDate: "2016-01-01",
    maxDate: "2016-12-31",
    disabledDates: [],
    dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    mondayIsFirstDay: true,//set monday as first day of week. Default is false
    eventClick: function(date) {
      console.log(date);
    },
    dateClick: function(date) {
      console.log(date);
    },
    changeMonth: function(month, year) {
      console.log(month, year);
    },
  };

  //console.log($scope.date);
  function bismillah(){
    //console.log(temp);
    return temp;
  }
  var tanggal=["2016-02-20","2016-02-21"];
  //bikin fungsi buat v
  $scope.events = [
    {foo: 'bar', date: tanggal[0]},
    {foo: 'bar', date: tanggal[1]}
  ];
  //console.log($scope.events);
})

.controller('MitraFinderCtrl', function($scope, $state, $cordovaGeolocation, GoogleMaps) {
  GoogleMaps.init();
    temp=GoogleMaps.getDetailMitra();

    temp.then(function(data){
      $scope.mitras = data;
      //console.log(data.nama);
    })
})

.controller('ContactCtrl', function($scope, $stateParams, $http) {
  $scope.SendContact = function(data) {
      $http({
        method: 'POST',
        url: 'http://http://gemarsehati.com/enagic/api/contactus',
        data: {'opsi': 'insert-data', 'odp': detailunit, 'nama': data.namasf, 'interest': data.interest, 'alasan': data.alasan, 'alamat': data.alamat, 'tiperumah': data.tiperumah},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){
        if(data['status'] == "pas"){    
            alert("Data Berhasil Dimasukkan");            
            $state.go('app.home');
        }
        if(data['status'] == "notpas"){    
            alert("terjadi kesalahan, coba lagi");       
        }
      }).
      error(function(data) {
        if(data == null){
          alert("data yang anda isikan kosong");
        }
        else{
          alert("input gagal periksa sambungan Internet Anda.");
        }
    });
  };
})

.controller('PushCtrl', function($scope, $rootScope, $ionicUser, $ionicPush) {

  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data){
    alert('Success: '+ data.token);
    console.log('Got token: ', data.token, data.platform);
    $scope.token = data.token;
  })

  $scope.identifyUser = function(){
    var user = $ionicUser.get();
    console.log(user);
    if(!user.user_id){
      user.user_id = $ionicUser.generateGUID();
    }

    angular.extend(user,{
      name:"simon",
      bio: "author of Devdatic"
    });

    $ionicUser.identify(user).then(function(){
      $scope.identified = true;
      console.log('name: '+user.name+"--- id: "+user.user_id);
    });
  };

  $scope.pushRegister = function(){
    $ionicPush.register({
      canShowAlert: true,
      canSetBadge: true,
      canPlaySound: true,
      canRunActionsOnWake: true,
      onNotification: function(notification){
        //handle your stuff 
        return true;
      }
    });
  };

})

/*.controller('TestCtrl', function($rootScope, $scope, $cordovaPush, $cordovaDevice) {
    var androidConfig = {
        "senderID": "33552110024",
    };
    document.addEventListener("deviceready", function() {
        $cordovaPush.register(androidConfig).then(function(result) {
            console.log(result);
            // Success
        }, function(err) {
            console.log(err);
            // Error
        })
        $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
            console.log(event);
            console.log(notification);
            switch (notification.event) {
                case 'registered':
                    if (notification.regid.length > 0) {
                        alert('registration ID = ' + notification.regid);
                    }
                    break;
                case 'message':
                    // this is the actual push notification. its format depends on the data model from the push server
                    alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
                    break;
                case 'error':
                    alert('GCM error = ' + notification.msg);
                    break;
                default:
                    alert('An unknown GCM event has occurred');
                    break;
            }
        });
    }, false);
*/
;