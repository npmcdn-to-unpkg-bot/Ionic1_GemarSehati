var user;
var id;

var app = angular.module('starter.controllers', ['ngSanitize','ionicLazyLoad','ngCordova'])



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
      return $http.get("http://www.gemarsehati.com/api/getevent").then(function(response){
        events = response;
        return events.data;
      });
    },
    getDateEvents: function(id){
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
  }
  //load marker posisi sekarang
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
  //load semua marker
  function loadMarkers(){
    currentLatLng = getCurrentCoordinate();
    //Get all of the markers from our Markers factory
    temp = Markers.getMarkers().then(function(markers){
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
        //variable for coordinate
        var koordinatFix = marker[i].koordinat.split(",");
        var koordinatLat = koordinatFix[0];
        var koordinatLng = koordinatFix[1];
        //set coordinate to markerPos
        var markerPos = new google.maps.LatLng(koordinatLat, koordinatLng);
        //var currentPos = new google.maps.LatLng(currentLatLn)
        //find nearest distance
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
        if(distance<=20000){
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
  }

  function getDataNearestMitra(){
    dataDetailMitra=this.dataDetailMitra;
    return dataDetailMitra;
  }

  function setCurrentCoordinate(currentCoordinate){
    this.currentCoordinate=currentCoordinate;
    return currentCoordinate;
  }

  function getCurrentCoordinate(){
    currentCoordinate=this.currentCoordinate;
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
})


.controller('LoginCtrl', function($rootScope,$ionicHistory,$scope, $state, $http,$ionicLoading,$localstorage, $window, Footer) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
  //load data di localstorage
  $scope.loadData = function(){
    alert("Username "+ ($localstorage.get('username')) +"\n" + 
          "photo " + ($localstorage.get('photo')) +"\n" + 
          "id "+ ($localstorage.get('id')));
  }
  //fungsi login
  $scope.Login = function(data) {
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
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){  
      alert("login success");
      $ionicLoading.hide();
      if(data.message=="loginSuccess") {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        SetDataUser(data.id);
        $state.go('app.home', {}, {reload: true});  
      }
    })
    .error(function(data) {
      $ionicLoading.hide();
      if(data == null){
        alert("Email atau password tidak boleh kosong / cek koneksi anda");
      }
    });
  };

  $scope.Logout = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.home', {}, {reload: true});
    window.localStorage.removeItem("id");
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("photo");    
    alert("Anda berhasil Logout");
    window.location.reload();
  };
  //set data user yang login ke dalam local storage
  function SetDataUser(id){
    var url = 'http://gemarsehati.com/api/getmitraid/'+id;
    $http({
      method: 'get',
      url: url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){ 
      $localstorage.set("id",data.id);
      $localstorage.set('username',data.nama);
      $localstorage.set('photo',data.foto);
      $localstorage.set('cek','true');
      window.location.reload();
      $state.go('app.home', {}, {reload: true});
    })
    return ;
  }
})

.controller('PDFCtrl', function($scope, $http, $state,$ionicLoading,$localstorage,Footer,$cordovaFileTransfer,$cordovaFile,$ionicPopup) {
  //fungsi download
  $scope.download = function (index) {
    // link download
    var url = $scope.pdfs[index].link_pdf;
    // get nama file
    var filename = url.split("/").pop();
    // lokasi menyimpan file
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
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();

  if($localstorage.get('username')){
    //url yang digunakan jika sudah login
    var url = 'http://www.gemarsehati.com/api/getpdfuser';
  }
  else{
    //url yang digunakan jika belum login
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
  })
  .error(function(data) {
    $ionicLoading.hide()   
    $ionicPopup.alert({
      title: 'Connection Error',
      template: 'Check your connection'
    });
  });
})

.controller('HomeCtrl', function($cordovaSplashscreen,$localstorage,$ionicHistory,$scope, $stateParams,$ionicLoading,$localstorage,$state,$window,$reload,$timeout, Footer,$ionicPopup) {
  /*$scope.$on('$ionicView.afterEnter', function(){
    setTimeout(function(){
      document.getElementById("custom-overlay").style.display = "none";      
    }, 3000);
  }); */ 
  $ionicLoading.hide();
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

.controller('PhotoCtrl', function($ionicLoading,$ionicPopup,$scope, $http, $state,$sce,$ionicModal, $ionicBackdrop, $ionicSlideBoxDelegate, $ionicScrollDelegate, Footer) {
  $ionicLoading.show({
    template: 'Loading'
  })
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
  //get json album foto
  $http({
    method : 'get',
    url: 'http://www.gemarsehati.com/api/getphotoalbum',
    headers: { 'Content-Type':'application/x-www-form-urlencoded'}
  })
  .success(function(data){
    $scope.photoalbums=data;
  })
  .error(function(data) {
    $ionicLoading.hide() 
    $ionicPopup.alert({
      title: 'Connection Error',
      template: 'Check your connection'
    });
  });
  //get json foto
  $http({
    method: 'get', 
    url: 'http://www.gemarsehati.com/api/getphoto',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
  })
  .success(function(data){
    $scope.length = Object.keys(data).length;
    $scope.halfLength = length/2;
    $scope.photos = data;
    $ionicLoading.hide();
  })
  .error(function(data) {
    $ionicLoading.hide()
    $ionicPopup.alert({
      title: 'Connection Error',
      template: 'Check your connection'
    });
  });
  //fungsi pop up foto
  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/detailphoto.html');
  }
  //fungsi menampilkan modal
  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }
  // fungsi menutup modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove()
  };
  //fungsi slide
  $scope.updateSlideStatus = function(slide) {
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };
  //fungsi menampilkan foto berdasarkan album yang dipilih
  $scope.getPhotoAlbum = function() {
    $scope.selectedPhotos=[];
    var id = $scope.selectedAlbum.id;
    var length = $scope.length;
    for(i = 0; i<length;i++){
      if($scope.photos[i].id_album==id){
        $scope.selectedPhotos.push($scope.photos[i]);
      }
    }
    $ionicLoading.hide();
  }
})
  
.controller('VideoCtrl', function($scope,$ionicPopup,$http, $state,$sce,$ionicLoading, Footer) {
  $ionicLoading.show({
    template: 'Loading'
  })
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
  //fungsi memperbolehkan url eksternal
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
  $http({
    method: 'get',
    url: 'http://www.gemarsehati.com/api/getvideo', 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){
    $scope.videos = data;
    $ionicLoading.hide();
  })
  .error(function(data) {
    $ionicLoading.hide()  
    $ionicPopup.alert({
      title: 'Connection Error',
      template: 'Check your connection'
    });
  });
})

.controller('RegisterCtrl', function($scope,$ionicPopup, $http, $state, Footer) {
  $scope.footerText=Footer.getFooter();
  //get gender
  $http({
    method: 'get',
    url: 'http://www.gemarsehati.com/api/getgender'
  })
  .success(function(data){
    $scope.genders = data;
  })

  //getcity
  $http({
    method: 'get',
    url: 'http://www.gemarsehati.com/api/getcity'
  })
  .success(function(data){
    $scope.cities = data;
  })
  $scope.showSelectValue = function(mySelect) {
    return mySelect.name;}
  //fungsi register
  $scope.SendRegister = function(data) {
    if(data.selectedGender){
      var genderId = data.selectedGender.id;
      if(data.selectedCity){
        var cityId = data.selectedCity.id;
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



.controller('CityCtrl', function($http,$ionicPopup, $scope,$state) {
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


.controller('TestimoniCtrl', function($http,$ionicPopup,$scope,$ionicLoading, Footer) {
  $ionicLoading.show({
    template: 'Loading'
  })
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
  //get testimoni bisnis
  $scope.bisnisTestimoni = function() {
    $ionicLoading.show({
      template: 'Loading'
    })
    $http({
      method: 'get', 
      url: 'http://www.gemarsehati.com/api/gettestimonibisnis', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $ionicLoading.hide();
      $scope.testimonis = data;
    })
    .error(function(data) {
      $ionicLoading.hide()  
      $ionicPopup.alert({
        title: 'Connection Error',
        template: 'Check your connection'
      });
    });
  }
  //get testimoni kesehatan
  $scope.kesehatanTestimoni = function() {
    $ionicLoading.show({
      template: 'Loading'
    })
    $http({
      method: 'get', 
      url: 'http://www.gemarsehati.com/api/gettestimonikesehatan', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $ionicLoading.hide();
      $scope.testimonis = data;   
    });
  }
})

.controller('ArticlesCtrl', function($http,$ionicPopup,$scope, $stateParams,$state,$ionicLoading, Footer) {
  $ionicLoading.show({
    template: 'Loading'
  })
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
  $http({
    method: 'get', 
    url: 'http://www.gemarsehati.com/api/getarticles', 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){
    $scope.articles = data;
    //parsing data ke detailarticle
    $scope.whicharticle = $state.params.aId;
    $ionicLoading.hide();
  })
  .error(function(data) {
    $ionicLoading.hide()  
    $ionicPopup.alert({
      title: 'Connection Error',
      template: 'Check your connection'
    });
  });
})

.controller('TechnologyCtrl', function($http,$ionicPopup,$scope, $stateParams,$state,$ionicLoading, Footer) {
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
    })
    .error(function(data) {
      $ionicLoading.hide()
      //alert("Cek koneksi internet anda");    
      $ionicPopup.alert({
        title: 'Connection Error',
        template: 'Check your connection'
      });
    });
})

.controller('EventCtrl',function($rootScope,$ionicPopup,$http,$scope, Events,$ionicLoading, Footer) {
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.footerText=Footer.getFooter();
  $scope.events=[];
  $scope.archivedEvents=[];
  $scope.latestEvents=[];
  //get event yang telah selesai
  $scope.showArchived = function() {
    $ionicLoading.show({
    template: 'Loading'
  })
    $scope.archivedEvents=[];
    $http({
      method: 'get', 
      url: 'http://www.gemarsehati.com/api/getevent', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $ionicLoading.hide();
      var currentTime = new Date();
      var currentMonth = currentTime.getMonth()+1;
      var currentDate = currentTime.getDate();
      var currentYear = currentTime.getFullYear();

      for(i=0;i<data.length;i++){
        var dateArr=data[i].date.split("-");
        var year = dateArr[0]
        var month = dateArr[1].replace(/(^)0+/g, "$1");
        var date = dateArr[2].replace(/(^)0+/g, "$1");
        if(year>currentYear){
        }
        else{
          if(month>currentMonth){
          }
          else if(month<=currentMonth){
            $scope.archivedEvents.push(data[i]);
          }
        }
      }
      $scope.events=$scope.archivedEvents;
    })
    .error(function(data) {
      $ionicLoading.hide()
      $ionicPopup.alert({
        title: 'Connection Error',
        template: 'Check your connection'
      });
    });
  }
  //get event yang terbaru
  $scope.latestEvent = function(){
    $ionicLoading.show({
    template: 'Loading'
  })
    $scope.latestEvents=[];
    $http({
      method: 'get', 
      url: 'http://www.gemarsehati.com/api/getevent',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $ionicLoading.hide();
      var currentTime = new Date();
      var currentMonth = currentTime.getMonth()+1;
      var currentDate = currentTime.getDate();
      var currentYear = currentTime.getFullYear();

      for(i=0;i<data.length;i++){
        var dateArr=data[i].date.split("-");
        var year = dateArr[0]
        var month = dateArr[1].replace(/(^)0+/g, "$1");
        var date = dateArr[2].replace(/(^)0+/g, "$1");
        if(year>currentYear){
          $scope.latestEvents.push(data[i]);
        }
        else{
          if(month>currentMonth){
            $scope.latestEvents.push(data[i]);
          }
          else {
            if(date>currentDate && month>=currentMonth){
              $scope.latestEvents.push(data[i]);
            }
          }
        }        
      }
      $scope.events=$scope.latestEvents;
    })
    .error(function(data) {
      $ionicLoading.hide()
      $ionicPopup.alert({
        title: 'Connection Error',
        template: 'Check your connection'
      });
    });
  }
})

.controller('MitraFinderCtrl', function($scope,$ionicPopup, $state, $cordovaGeolocation, GoogleMaps,$ionicLoading , Footer,$timeout) {
  $ionicLoading.show();
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
  //fungsi reload halaman
  $scope.reloadPage = function(){window.location.reload();}
  //memanggil fungsi google map
  GoogleMaps.init();
  //ngambil data mitra
  temp=GoogleMaps.getDetailMitra();

  temp.then(function(data){
    $scope.mitras = data;
    $timeout(function() {
      $ionicLoading.hide();
    },5000);
    if(!data) window.location.reload(true);
  })
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


.controller('ContactCtrl', function($scope,$http,$state,$ionicLoading, Footer) {
  /*$ionicLoading.show({
    template: 'Loading'
  })*/
  $ionicLoading.hide();
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
  //kirim kontak
  $scope.SendContact = function(data) {
    $http({
      method: 'POST',
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

.controller('ForgotCtrl', function($scope,$ionicPopup, $http, $state, Footer) {
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
  //fungsi reset pass
  $scope.SendResetPass = function(data) {
    $http({
      method: 'POST',
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

.controller('InputCtrl', function($scope,$ionicPopup, Footer) {
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

.controller('AboutCtrl', function($scope,$ionicPopup, $http, $stateParams, $state,$ionicLoading, Footer){
  $ionicLoading.show({
    template: 'Loading'
  })
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
  $http({
    method: 'get', 
    url: 'http://www.gemarsehati.com/api/aboutus'
  })
  .success(function(data){
    $ionicLoading.hide();
    $scope.aboutus = data;
    //parsing data ke detail about us
    $scope.whichabout = $state.params.aId;
  })
  .error(function(data) {
    $ionicLoading.hide() 
    $ionicPopup.alert({
      title: 'Connection Error',
      template: 'Check your connection'
    });
  });
})
  
.controller('SocialMediaCtrl',function($ionicLoading,$ionicPopup, Footer, $scope){
  $ionicLoading.show({
    template: 'Loading'
  })
  $ionicLoading.hide();
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
})

.controller('MitraCityCtrl', function($ionicLoading,$ionicPopup,$http,$scope,$state, Footer){
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

.controller('ProfilCtrl',function($ionicLoading,$ionicPopup,$http,$state,$localstorage,$scope, Footer,$ionicPopup){
  $ionicLoading.show({
    template: 'Loading'
  })
  //fungsi menampilkan footer
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
    url: 'http://gemarsehati.com/api/getmitraid/'+id,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){  
    $ionicLoading.hide();
    $scope.profil=data;
  })
  .error(function(data) {
    $ionicLoading.hide()    
    $ionicPopup.alert({
      title: 'Connection Error',
      template: 'Check your connection'
    });
  });
})

.controller('ProductCtrl', function($scope,$ionicPopup, $http, $stateParams, $state,$ionicLoading, Footer){
  $ionicLoading.show({
    template: 'Loading'
  })
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
  $http({
    method: 'get', 
    url: 'http://www.gemarsehati.com/api/getleveluk'
  })
  .success(function(data){
    $ionicLoading.hide();
    $scope.products = data;
    //parsing data ke detailabout.html
    $scope.whichproduct = $state.params.aId;
  })
  .error(function(data) {
    $ionicLoading.hide() 
    $ionicPopup.alert({
      title: 'Connection Error',
      template: 'Check your connection'
    });
  });
})

.controller('CreditCtrl', function($scope,$ionicPopup, $http,$state,$ionicLoading, Footer){
  $ionicLoading.show({
    template: 'Loading'
  })
  //fungsi menampilkan footer
  $scope.footerText=Footer.getFooter();
  $http({
    method: 'get', 
    url: 'http://www.gemarsehati.com/api/getcredit'
  })
  .success(function(data){
    $ionicLoading.hide();
    $scope.credits = data;
  })
  .error(function(data) {
    $ionicLoading.hide()
    $ionicPopup.alert({
      title: 'Connection Error',
      template: 'Check your connection'
    });
  });
})

.controller('SplashCtrl', function($scope,$ionicPopup, $ionicLoading,$timeout, $state,$ionicHistory, $rootScope){
  $timeout(function() {
      $ionicLoading.show();
    }, 3000);
  
  console.log("awal "+$rootScope.flag);

  if($rootScope.flag==false){
    console.log("1 - ke notif");
    console.log($rootScope.flag);
    $timeout(function() {
      $ionicLoading.hide();
      $state.go('app.notif');
    },3000);
    $ionicLoading.hide();
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
  }
  else if($rootScope.flag==true){
    console.log("2 - ke home");
    console.log($rootScope.flag);
    $timeout(function() {
      $ionicLoading.hide();
      $state.go('app.home');
    },5000);
    $ionicLoading.hide();
    $rootScope.flag = false;
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
  }
  document.addEventListener('batchPushReceived', function(e) {
    $rootScope.flag = false;
    var pushPayload = e.payload;
    $rootScope.message = pushPayload.msg;
    console.log("1 - ke notif");
    console.log($rootScope.flag);
    $timeout(function() {
      $ionicLoading.hide();
      $state.go('app.notif');
    },3000);
    $ionicLoading.hide();
  })
})
    
.controller('NotifCtrl',function(Footer,$scope, $ionicLoading, $rootScope){
  $ionicLoading.show({
    template: 'Loading'
  })
  $scope.message = $rootScope.message;
  $scope.footerText=Footer.getFooter();
  $ionicLoading.hide();
})
;