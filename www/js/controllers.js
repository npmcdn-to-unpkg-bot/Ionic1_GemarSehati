var user;
var id;

var app = angular.module('starter.controllers', ['ngSanitize','wu.masonry','ionicLazyLoad','flexcalendar','pascalprecht.translate','ngCordova'])



/*=================================
=            Directive            =
=================================*/

.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}])

/*.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}])*/



/*=====  End of Directive  ======*/


/*=======================.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }




}])=============

/*======================================
=            Footer Factory            =
======================================*/

.factory('Footer', function() {
  var currentTime = new Date();
  var currentYear = currentTime.getFullYear();
  var footerTitle = "gemarsehati.com"
  return{
    getFooter: function(){
      var footerText=currentYear+". "+footerTitle;
      return footerText;
    }
  }
})

/*=====  End of Footer Factory  ======*/


/*=============================================
=            Local Storage Factory            =
=============================================*/

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    isLoggedIn: function() {
    if( window.localStorage.getItem("id") !== undefined && 
        window.localStorage.getItem("username") !== undefined &&
        window.localStorage.getItem("photo") !== undefined) {
      return true;
    } else {
       return false;
    };
  }
}}
])

/*=====  End of Local Storage Factory  ======*/

.factory('$reload',['$window',function($window){
  return{
    refresh:function(){
      return window.location.reload(true);
    }
  }
}])

/*====================================
=            Maps Factory            =

/*====================================*/

/*.factory('geoLocation', function ($localStorage) {
        return {
            setGeolocation: function (latitude, longitude) {
                var _position = {
                    latitude: latitude,
                    longitude: longitude
                }
                $localStorage.setObject('geoLocation', _position)
            },
            getGeolocation: function () {
                return glocation = {
                    lat: $localStorage.getObject('geoLocation').latitude,
                    lng: $localStorage.getObject('geoLocation').longitude
                }
            }
        }
    })
*/
.factory('Markers', function($http) {

  var markers = [];

  return {
    getMarkers: function(){

      //return $http.get("http://www.gemarsehati.com/enagic/api/getmitra").then(function(response){
      return $http.get("http://www.gemarsehati.com/api/getmitra").then(function(response){
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

      //return $http.get("http://www.gemarsehati.com/enagic/api/getevent").then(function(response){
      return $http.get("http://www.gemarsehati.com/api/getevent").then(function(response){
          events = response;
          //console.log(events.data[0].date);
          return events.data;
      });
    },
    getDateEvents: function(id){
      //return $http.get("http://www.gemarsehati.com/enagic/api/getevent").then(function(response){
      return $http.get("http://www.gemarsehati.com/api/getevent").then(function(response){
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
      //alert("current posisi pas initmap : "+currentLatLng);
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
        //console.log("fungsi initmap");
        //console.log(loadMarkers());
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
    var image = 'img/marker_now-small.png';
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
    //alert("current pos pas load marker : "+currentLatLng);
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
        var image = 'img/marker-small.png';
        var count=0;
        for (var i = 0; i < lengthMarkers; i++) {
          var marker = markers.data;
          var dataMarker = markers.data;


          //alert(marker[0].koordinat);
          //variable for coordinate
          var koordinatFix = marker[i].koordinat.split(",");
          var koordinatLat = koordinatFix[0];
          var koordinatLng = koordinatFix[1];

          //set coordinate to markerPos
          var markerPos = new google.maps.LatLng(koordinatLat, koordinatLng);
          //alert("marker pos "+i+" : "+markerPos);
          //var currentPos = new google.maps.LatLng(currentLatLn)

          //find nearest distance
          //alert("posisi saiki "+i+" : "+currentLatLng +" dan "+markerPos);
          if(currentLatLng!= undefined){
            var distance = google.maps.geometry.spherical.computeDistanceBetween(currentLatLng,markerPos);
          }
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
            //alert("dist " + distance);
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
            if(dataMarker[i].nohp=="") dataMarker[i].nohp="-";
            if(dataMarker[i].email=="") dataMarker[i].email="-";
            if(dataMarker[i].alamat=="") dataMarker[i].alamat="-";
            var infoWindowContent = 
              "Nama : "+dataMarker[i].nama + "<br/>" + 
              "No hp : "+dataMarker[i].nohp + "<br/>" + 
              "Email : "+dataMarker[i].email + "<br/>" + 
              "Alamat : "+dataMarker[i].alamat;
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
          content: '<div style="width:200px; height:auto">'+message+'</div>'
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });
      
  }

  return {
    init: function(){
      initMap();
      var anu = loadMarkers();

    },
    getDetailMitra: function(){
      temp = loadMarkers();

      //console.log(temp);
      return temp;
    },
    getMitra: function(){
      temp = getDataNearestMitra();
      console.log(temp);
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

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$localstorage,$state,$ionicPopover) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.MitraCityButton = function(){
    $state.go('app.mitracity', {}, {reload: true});
  }

  photo = $localstorage.get('photo');
  username = $localstorage.get('username');
  
  if(username!==undefined){
    $scope.login=false;
    $scope.logout=true;
  }
  else 
  {
    $scope.login=true;
    $scope.logout=false;
  }
  //alert($scope.login);
  $scope.loginData = {
    'name': username,
    'photo': photo
  };
  //alert(window.localStorage.getItem("username"));

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

.controller('LoginCtrl', function($rootScope,$ionicHistory,$scope, $state, $http, $state,$ionicLoading,$localstorage, $window,$ionicModal, Footer) {
  $scope.data = {};
  $scope.result;
  $rootScope.nama;
  this.nama;
  $scope.footerText=Footer.getFooter();
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
    $scope.modal.remove();
  };

  // Open the login modal
  $scope.loginModal = function() {
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
  
  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if ($scope.modal.isShown()) {
      event.preventDefault();
      $scope.modal.remove();
    }
  });
  

  $scope.loadData = function(){
    alert("Username "+ ($localstorage.get('username')) +"\n" + 
          "photo " + ($localstorage.get('photo')) +"\n" + 
          "id "+ ($localstorage.get('id')));
  }
  

  $scope.Login = function(data) {
    //alert(data.email + " " + data.password);
    $ionicLoading.show({
      template: 'Loading'
    })
    if(data.email == null || data.password == null){
        $ionicLoading.hide()
        alert("Email atau Password Anda kosong, mohon dicek kembali");
        $state.go('app.login', {}, {reload: true});
    }
    var email = data.email;
    var password = data.password;
      $http({
        method: 'POST',
        url: 'http://gemarsehati.com/api/login',
        data: {'email': email, 'password': password},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000
      })
      .success(function(data){  
        console.log(data);
        //console.log(data.email);
        //console.log(data.password);
        alert("login success");
        //console.log(data);
        //alert("oi " + data.data);
        $ionicLoading.hide();
        //alert("selamat datang "+email);
        if(data.message=="loginSuccess") {
          $ionicHistory.nextViewOptions({
              disableBack: true
          });
          SetDataUser(data.id);
          //MovetoHome();
          //$scope.modal.show();
          //window.location.reload(true);
          $state.go('app.profil', {}, {reload: true});  
        }
      })
      .error(function(data) {
        $ionicLoading.hide();
        alert(data);
        if(data == null){
          alert("Email atau password tidak boleh kosong");
        }
      });
  };

  $scope.MovetoHome = function(){
    //alert("move");
    $state.go('app.home', {}, {reload: replace});
  }

  $scope.Logout = function() {
    $state.go('app.home', {}, {reload: true});
     window.localStorage.removeItem("id");
     window.localStorage.removeItem("username");
     window.localStorage.removeItem("photo");
    
    alert("Anda berhasil Logout");
    window.location.reload();
    
  };

  /*$scope.isLoggedIn = function() {
    if( window.localStorage.getItem("id") !== undefined && 
        window.localStorage.getItem("username") !== undefined &&
        window.localStorage.getItem("photo") !== undefined) {
      return true;
    } else {
       return false;
    }
  };*/

  function SetDataUser(id){
    var url = 'http://gemarsehati.com/api/getmitraid/'+id;
    $http({
      method: 'get',
      url: url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){ 
      //alert(data.id + data.nama + data.foto);
      //alert("set data user");
      $localstorage.set("id",data.id);
      $localstorage.set('username',data.nama);
      //alert("in SetDataUser " + data.nama);
      $localstorage.set('photo',data.foto);
      $localstorage.set('cek','true');
      //alert($localstorage.get('cek'));
      window.location.reload();
      $state.go('app.profil', {}, {reload: true});
    })
    //alert($rootScope.nama);
    return ;
  }
})

.controller('PDFCtrl', function($timeout,$scope, $http, $state,$sce,$ionicLoading,$localstorage, Footer,$cordovaFileTransfer,$cordovaFile) {
  
  $scope.download = function (index) {
 
    // File for download
    var url = $scope.pdfs[index].link_pdf;
    
    // File name only
    var filename = url.split("/").pop();
     
    // Save location
    var targetPath = cordova.file.externalRootDirectory + filename;
    alert('Sedang mendownload file');
    $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
      alert('Download file '+filename+' telah berhasil.');
    }, function (error) {
      alert('Download file '+filename+' gagal.');
    }, function (progress) {
      // PROGRESS HANDLING GOES HERE
    });
  }
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();

  if($localstorage.get('username')){
    //var url = 'http://www.gemarsehati.com/enagic/api/getpdfuser';
    var url = 'http://www.gemarsehati.com/api/getpdfuser';
  }
  else{
    //var url = 'http://www.gemarsehati.com/enagic/api/getpdfumum';
    var url = 'http://www.gemarsehati.com/api/getpdfumum';
  }
  $http({
    method: 'get', 
    url: url, 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){
    $scope.pdfs = data;
    $ionicLoading.hide(); 
  });
})

.controller('HomeCtrl', function($localstorage,$ionicHistory,$scope, $stateParams,$ionicLoading,$localstorage,$state,$window,$reload,$timeout, Footer) {
  $timeout(function() {
     $ionicLoading.hide();
  }, 3000);
  $scope.footerText=Footer.getFooter();
  
  //$state.go($state.current, {}, {reload: true});
  //for(i=0;i<1;i++) $window.location.reload(true);
  
  /*window.onload = function () {
    if (! localStorage.justOnce) {
        localStorage.setItem("justOnce", "true");
        window.location.reload();
    }
  }*/

  if($localstorage.get('username')){
    username=$localstorage.get('username');
    $scope.isLogin = true;
  }
  else {
    username = "non user";
    $scope.isLogin=false;
  }
  
  //alert("selamat datang "+username);
  /*$scope.doRefresh = function(){
    window.location.reload();
  };*/

  //else alert("anda belum login");
  /*window.onload = function () {
    if (! localStorage.username) {
        window.location.reload();
    }
}*/
  
  //if(localstorage.get('username')!==undefined) window.location.reload();

  /*$scope.reloadPage = function(){window.location.reload();}*/
  /*$scope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){ 
  });
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $timeout(function(){
      //window.location.reload()
    },2000);
  });*/
  $ionicHistory.clearHistory();
  //alert($localstorage.isLoggedIn());
})

.controller('PhotoCtrl', function($ionicLoading,$scope, $http, $state,$sce,$ionicModal, $ionicBackdrop, $ionicSlideBoxDelegate, $ionicScrollDelegate, Footer) {
/*  $scope.singers = ['img/shakira.jpg','img/justin.jpg','img/selena.jpg','img/adam.jpg'];*/
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/getphoto',
      url: 'http://www.gemarsehati.com/api/getphoto',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .success(function(data){
      var length = Object.keys(data).length;
      $scope.halfLength = length/2;
      $scope.photos = data;
      $ionicLoading.hide();
    });
  $scope.showImages = function(index) {
    console.log(index);
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

.controller('VideoCtrl', function($scope, $http, $state,$sce,$ionicLoading, Footer) {
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
    $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/getvideo', 
      url: 'http://www.gemarsehati.com/api/getvideo', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.videos = data;
      $ionicLoading.hide();
      /*var myId = getId($scope.videos.link);
      console();
      var myCode = "http://www.youtube.com/embed/"+ myId;
      alert(myCode);*/
      //$scope.videos.link=myCode;

      $scope.doRefresh = function(){
        $http({
          method: 'get', 
          //url: 'http://www.gemarsehati.com/enagic/api/getvideo'
          url: 'http://www.gemarsehati.com/api/getvideo'
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

.controller('RegisterCtrl', function($scope, $stateParams, $http, $state, Footer) {
  $scope.footerText=Footer.getFooter();
  //get gender
  $http({
    method: 'get',
    //url: 'http://www.gemarsehati.com/enagic/api/getgender'
    url: 'http://www.gemarsehati.com/api/getgender'
  })
  .success(function(data){
    $scope.genders = data;
    //console.log('berhasil');
  })

  //getcity
  $http({
    method: 'get',
    //url: 'http://www.gemarsehati.com/enagic/api/getcity'
    url: 'http://www.gemarsehati.com/api/getcity'
  })
  .success(function(data){
    $scope.cities = data;
  })
  $scope.showSelectValue = function(mySelect) {
    //console.log(mySelect.name);
    return mySelect.name;}
  
  $scope.SendRegister = function(data) {
    if(data.selectedGender){
      var genderId = data.selectedGender.id;
      if(data.selectedCity){
        var cityId = data.selectedCity.id;
        //console.log(cityId +" "+genderId);
      }
    }

    if(!data.address) data.address="";
    if(!data.nophone) data.nophone="";
    if(!data.postal) data.postal="";
    if(!data.lat) data.lat="";
    if(!data.log) data.log="";
    if(!data.fb) data.fb="";
    if(!data.twitter) data.twitter="";
    if(!data.pinbb) data.pinbb="";

    /*$scope.uploadFile = function(files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);

      $http.post(uploadUrl, fd, {
          withCredentials: true,
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
      }).success(" ...all right!... ").error(" ..damn!..." );
    } */

    /*console.log(
      "fullname "+ data.fullname+" <br/> ",
      "nickname "+ data.nickname+" <br/> ",
      "nophone "+ data.nophone+" <br/> ",
      "nohp "+ data.nohp+" <br/> ",
      "genderId "+ genderId+" <br/> ",
      "address "+ data.address+" <br/> ",
      "cityId "+ cityId+" <br/> ",
      "postal "+ data.postal+" <br/> ",
      "lat "+ data.lat+" <br/> ",
      "log "+ data.log+" <br/> ",
      "email "+ data.email+" <br/> ",
      "password "+ data.password+" <br/> ",
      "fb "+ data.fb+" <br/> ",
      "twitter "+ data.twitter+" <br/> ",
      "foto "+ data.foto+" <br/> ",
      "pinbb "+ data.pinbb+" <br/> "
      );*/
      alert(data.foto);
      $http({
        method: 'POST',
        //url: 'http://gemarsehati.com/enagic/api/register',
        url: 'http://gemarsehati.com/api/register',
        data: {
          'name': data.fullname, 
          'panggilan': data.nickname,
          'notelp': data.nophone, 
          'nohp': data.nohp, 
          'ms_gender_id': genderId, 
          'address': data.address,
          'ms_city_id': cityId,
          'kodepos': data.postal,
          'latitude': data.lat,
          'longitude': data.log,
          'email': data.email,
          'password': data.password,
          'facebook': data.fb,
          'twitter': data.twitter,
          'file': data.foto,
          /*'file': $scope.uploadFile(),*/
          'pin_bb': data.pinbb
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })

      .success(function(data){  
          alert("Data Berhasil Dimasukkan");            
          console.log(data);
          $state.go('app.home');
      })
      .error(function(data) {
        if(data == null){
          alert("data yang anda isikan kosong");
        }
        else{
          alert("input gagal periksa sambungan Internet Anda.");
        }
    });
  };
})



.controller('CityCtrl', function($http, $scope,$state) {
  $http({
    method: 'get',
    //url: 'http://www.gemarsehati.com/enagic/api/getcity'
    url: 'http://www.gemarsehati.com/api/getcity'
  })
  .success(function(data){
    $scope.cities = data;
    $scope.selectedCity = $scope.cities[0];
  })
})

.controller('GenderCtrl', function($http, $scope) {
  $http({
    method: 'get',
    //url: 'http://www.gemarsehati.com/enagic/api/getgender'
    url: 'http://www.gemarsehati.com/api/getgender'
  })
  .success(function(data){
    $scope.genders = data;
  })
  $scope.showSelectValue = function(mySelect) {
    //console.log(mySelect);
    return mySelect.name;
}
})


.controller('TestimoniCtrl', function($http,$scope, $stateParams,$ionicLoading,$state, Footer) {
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  $scope.bisnisTestimoni = function() {
    $ionicLoading.show({
      template: 'Loading'
    })
    $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/gettestimonibisnis', 
      url: 'http://www.gemarsehati.com/api/gettestimonibisnis', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $ionicLoading.hide();
      $scope.testimonis = data;
      $scope.whichtestimoni = $state.params.aId;
    });
  }
  $scope.kesehatanTestimoni = function() {
    $ionicLoading.show({
      template: 'Loading'
    })
    $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/gettestimonikesehatan', 
      url: 'http://www.gemarsehati.com/api/gettestimonikesehatan', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $ionicLoading.hide();
      $scope.testimonis = data;
      $scope.whichtestimoni = $state.params.aId;
    });
  }
})

.controller('ArticlesCtrl', function($http,$scope, $stateParams,$state,$ionicLoading, Footer) {
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/getarticles', 
      url: 'http://www.gemarsehati.com/api/getarticles', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.articles = data;
      $scope.whicharticle = $state.params.aId;
      $ionicLoading.hide();

      $scope.doRefresh = function(){
        $http({
          method: 'get', 
          //url: 'http://www.gemarsehati.com/enagic/api/getarticles'
          url: 'http://www.gemarsehati.com/api/getarticles'
        })
        .success(function(data){
          $scope.articles=data;}
        );
      }
  });
})

.controller('TechnologyCtrl', function($http,$scope, $stateParams,$state,$ionicLoading, Footer) {
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/gettechnology', 
      url: 'http://www.gemarsehati.com/api/gettechnology', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.technologies = data;
      $scope.whichtechnology = $state.params.aId;
      $ionicLoading.hide();
  });
})

.controller('EventCtrl',function($rootScope,$http,$scope, Events,$ionicLoading, Footer) {
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  $scope.events=[];
  $scope.archivedEvents=[];
  $scope.latestEvents=[];
  $scope.showArchived = function() {
    $ionicLoading.show({
    template: 'Loading'
  })
    $scope.archivedEvents=[];
    $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/getevent', 
      url: 'http://www.gemarsehati.com/api/getevent', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $ionicLoading.hide();
      var currentTime = new Date();
      var currentMonth = currentTime.getMonth();
      var currentDate = currentTime.getDate();
      var currentYear = currentTime.getFullYear();

      for(i=0;i<data.length;i++){
        var dateArr=data[i].date.split("-");
        var year = dateArr[0]
        var month = dateArr[1].replace(/(^)0+/g, "$1");
        var date = dateArr[2].replace(/(^)0+/g, "$1");
        //console.log(dateArr);
        if(year>currentYear){
          //console.log(year+"-"+currentYear+" : not archived");
        }
        else{
          if(month>currentMonth){
            //console.log(month+"-"+currentMonth+" : not archived");
          }
          else if(month<=currentMonth){
            //console.log(month+"-"+currentMonth+" : archived");
            $scope.archivedEvents.push(data[i]);
          }
        }
      }
      $scope.events=$scope.archivedEvents;
    });
  }
  $scope.latestEvent = function(){
    $ionicLoading.show({
    template: 'Loading'
  })
    $scope.latestEvents=[];
    $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/getevent', 
      url: 'http://www.gemarsehati.com/api/getevent',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $ionicLoading.hide();
      var currentTime = new Date();
      var currentMonth = currentTime.getMonth();
      var currentDate = currentTime.getDate();
      var currentYear = currentTime.getFullYear();

      for(i=0;i<data.length;i++){
        var dateArr=data[i].date.split("-");
        var year = dateArr[0]
        var month = dateArr[1].replace(/(^)0+/g, "$1");
        var date = dateArr[2].replace(/(^)0+/g, "$1");
        if(year>currentYear){
          //console.log(year+"-"+currentYear+" : not archived");
          $scope.latestEvents.push(data[i]);
        }
        else{
          if(month>currentMonth){
            //console.log(month+"-"+currentMonth+" : not archived");
            $scope.latestEvents.push(data[i]);
          }
          else {
            if(date>currentDate){
              //console.log(date+"-"+currentMonth+" : not archived");
              $scope.latestEvents.push(data[i]);
            }
            
          }
        }        
      }
      $scope.events=$scope.latestEvents;
    });
  }
})
  //calender wannabe
  /*
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
})*/

.controller('MitraFinderCtrl', function($scope, $state, $cordovaGeolocation, GoogleMaps,$ionicLoading , Footer) {
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();

  GoogleMaps.init();

    temp=GoogleMaps.getDetailMitra();
    console.log(temp);

    temp.then(function(data){
      $scope.mitras = data;
      $ionicLoading.hide();
      console.log(data);
      if(!data) window.location.reload(true);
      //console.log(data.nama);
    })
    /*$scope.groups = [];
      for (var i=0; i<10; i++) {
        $scope.groups[i] = {
          name: i,
          items: []
        };
        for (var j=0; j<3; j++) {
          $scope.groups[i].items.push(i + '-' + j);
        }
      }
      
      
       * if given group is the selected group, deselect it
       * else, select the given group
    */ 
      $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
      };
      $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
      };
  })


.controller('ContactCtrl', function($scope, $stateParams, $http, $state,$ionicLoading, Footer) {
  /*$ionicLoading.show({
    template: 'Loading'
  })*/
  $ionicLoading.hide();
  $scope.footerText=Footer.getFooter();

  $scope.SendContact = function(data) {

    //alert(data.nama + data.email + data.nohp + data.title + data.message);
      $http({
        method: 'POST',
        //url: 'http://gemarsehati.com/enagic/api/contactus',
        url: 'http://gemarsehati.com/api/contactus',
        data: {
          'name': data.nama,
          'email': data.email, 
          'nohp': data.nohp, 
          'title': data.title, 
          'message': data.message},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){  

        console.log(data);
        if(data.message=="contactusSuccess") $state.go('app.home');
      })
      .error(function(data) {
        if(data == null){
          alert("Cek kembali inputan anda");
        }
        else{
          alert("Periksa sambungan Internet Anda.");
        }
      });
  };
})

.controller('ForgotCtrl', function($scope, $stateParams, $http, $state, Footer) {
  $scope.footerText=Footer.getFooter();
  $scope.SendResetPass = function(data) {
    //alert(data.email);
    
      $http({
        method: 'POST',
        //url: 'http://gemarsehati.com/enagic/api/resetpass',
        url: 'http://gemarsehati.com/api/resetpass',
        data: {'email': data.email},
        headers: {  'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data, status, headers, config){  
        alert(data.data);
        if(data.message=="resetPassSuccess") $state.go('app.login');
      })
      .error(function(data) {
        if(data == null){
          alert("Masukkan alamat email anda");
        }
        else{
          alert("Periksa sambungan Internet Anda.");
        }
      });
  };
})

/*
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

.controller('InputCtrl', function($scope, Footer) {
      $scope.footerText=Footer.getFooter();
       $scope.fileName='nothing';
        
        $scope.openFileDialog=function() {
            console.log('fire! $scope.openFileDialog()');
            ionic.trigger('click', { target: document.getElementById('file') });
        };

      
        angular.element('#file').on('change',function(event) {
            console.log('fire! angular#element change event');
           
            var file = event.target.files[0];
            $scope.fileName=file.name;
            $scope.$apply();
        });
   
    })  

.controller('AboutCtrl', function($scope, $http, $stateParams, $state,$ionicLoading, Footer){
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/aboutus'
      url: 'http://www.gemarsehati.com/api/aboutus'
    })
    .success(function(data){
      $ionicLoading.hide();
      $scope.aboutus = data;
      $scope.whichabout = $state.params.aId;
    });
  })
  
.controller('SocialMediaCtrl',function($ionicLoading, Footer, $scope){
  $ionicLoading.show({
    template: 'Loading'
  })
  $ionicLoading.hide();
  $scope.footerText=Footer.getFooter();
})

.controller('MitraCityCtrl', function($ionicLoading,$http,$scope,$state, Footer){
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/getcity'
      url: 'http://www.gemarsehati.com/api/getcity'
    })
    .success(function(data){
      $ionicLoading.hide();
      $scope.cities = data;
      //$scope.whichcity = $state.params.aId;
      $id=$state.params.aId;
      $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/getcity/'+$id
      url: 'http://www.gemarsehati.com/api/getcity/'+$id
    })
      .success(function(data){
        $scope.city=data;
      })
      
    });
  })

.controller('ProfilCtrl',function($ionicLoading,$http,$state,$localstorage,$scope, Footer){
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  var id=$localstorage.get('id');
  if(id){
    $scope.isLogin = true;
  }
  else {
    $scope.isLogin = false;
    $state.go('app.home', {}, {reload: true});
  }
  $http({
        method: 'GET',
        //url: 'http://gemarsehati.com/enagic/api/getmitraid/'+id,
        url: 'http://gemarsehati.com/api/getmitraid/'+id,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){  
        $ionicLoading.hide();
        $scope.profil=data;
      })
      .error(function(data) {
        $ionicLoading.hide()
        //alert("Cek koneksi internet anda");
        
      });
})

.controller('ProductCtrl', function($scope, $http, $stateParams, $state,$ionicLoading, Footer){
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/getleveluk'
      url: 'http://www.gemarsehati.com/api/getleveluk'
    })
    .success(function(data){
      $ionicLoading.hide();
      $scope.products = data;
      $scope.whichproduct = $state.params.aId;
    });
  })


.controller('CreditCtrl', function($scope, $http, $stateParams, $state,$ionicLoading, Footer){
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  $http({
      method: 'get', 
      //url: 'http://www.gemarsehati.com/enagic/api/getleveluk'
      url: 'http://www.gemarsehati.com/api/getcredit'
    })
    .success(function(data){
      $ionicLoading.hide();
      $scope.credits = data;
      //console.log(Footer.getFooter());
    });
  })
;