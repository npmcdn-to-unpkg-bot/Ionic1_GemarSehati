angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('Pass', function($scope, $ionicPopup, $http, $ionicLoading, $state) {
  $scope.data = {};
  $scope.ganti = function(data){
     $ionicLoading.show({
      template: 'Harap Tunggu'
    })
    var string = cordova.plugins.uid.IMEI;
    if(data.nik == null || data.password == null ){
      $ionicLoading.hide()
      alert("Ada data Anda yang kosong atau anda menggunakan karakter yang tidak diijinkan, mohon dicek kembali");
    }
    else{
      var nik = data.nik.replace(/\W/g, '')
      var pass = data.password.replace(/\W/g, '')
      var length_nik = nik.length;
      var length_pass = pass.length;

      if(length_nik > 20 || length_pass > 20)
      {
        $ionicLoading.hide()
        alert("Password atau NIK terlalu panjang");
      }
      else if(length_nik < 5 || length_pass < 5){
        $ionicLoading.hide()
        alert("Password atau NIK terlalu pendek"); 
      }
      else{
         $http({
              method: 'POST',
              url: 'http://ptyasida.com/index.php/hp/gantipass',
              data: {'nik': nik,'password': pass,'imei': string},
              timeout: 10000
          })
          .success(function(data, status, headers, config){
            // alert("inserted Successfully");
            if(data['status'] == "200" ){
                $ionicLoading.hide()
                alert("Password Anda telah berhasil diubah");
                $state.go('tab.login', {}, {reload: true});
            }
            else if(data['status'] == "400" ){
              $ionicLoading.hide()
                alert("HP yang Anda gunakan belum terdaftar!");
                // $state.go('tab.pass', {}, {reload: true});
            }
            else if(data['status'] == "401" ){
              $ionicLoading.hide()
                alert("Apakah NIK anda benar? Silahkan cek sekali lagi!");
                // $state.go('tab.pass', {}, {reload: true});
            }
            else if(data['status'] == "402" ){
              $ionicLoading.hide()
                alert("Proses pengubahan password gagal, mohon dicek apakah NIK dan HP yang anda gunakan sama?");
                // $state.go('tab.pass', {}, {reload: true});
            }
            else{
                $ionicLoading.hide()
                alert("Terdapat Kesalahan pada komunikasi dengan server");
              }
          }).
          error(function(data, status, headers, config) {
                        
            if(data == null){
              $ionicLoading.hide()
                alert("periksa sambungan Internet dan GPS Anda!");
                $state.go('tab.pass', {}, {reload: true});
            }
            else{
              $ionicLoading.hide()
                alert("Terdapat Kesalahan pada komunikasi dengan server");
                $state.go('tab.pass', {}, {reload: true}); 
            }
          });
      }
    }

  };
  $scope.kembali = function(){
    $state.go('tab.login', {}, {reload: true});
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})




.controller('LoginCtrl', function($rootScope, $scope, $state, $ionicPopup, $http, $ionicLoading) {
  $scope.data = {};

  $scope.login = function(data) {
    $ionicLoading.show({
      template: 'Harap Tunggu'
    })
    $rootScope.nik = data.nik;
    var string = cordova.plugins.uid.IMEI;
    if(data.nik == null || data.password == null){
        $ionicLoading.hide()
        alert("Password atau Username Anda kosong, mohon dicek kembali");
        $state.go('tab.login', {}, {reload: true});
    }
    else{

      var nik = data.nik.replace(/\W/g, '')
      var pass = data.password.replace(/\W/g, '')
      var length_nik = nik.length;
      var length_pass = pass.length;

      if(length_nik > 20 || length_pass > 20)
      {
        $ionicLoading.hide()
        alert("Password atau NIK terlalu panjang");
      }
      else if(length_nik < 5 || length_pass < 5){
       $ionicLoading.hide()
        alert("Password atau NIK terlalu pendek"); 
      }
      else{
          $http({
              method: 'POST',
              url: 'http://ptyasida.com/index.php/hp/login',
              data: {'nik': nik,'password': pass,'imei': string},
              timeout: 10000
          })
          .success(function(data, status, headers, config){
            // alert("inserted Successfully");
            if(data['status'] == "616" ){
                $ionicLoading.hide()
                alert("Anda berhasil login Sebagai Penanda!");
                alert("Jangan lupa aktifkan fungsi location Anda");
                $state.go('tab.penanda', {}, {reload: true});
            }
            else if(data['status'] == "0000" ){
              $ionicLoading.hide()
                alert("Anda berhasil login!");
                alert("Jangan lupa aktifkan fungsi location Anda");
                $state.go('tab.dash', {}, {reload: true});
            }

            else if(data['status'] == "111" ){
              $ionicLoading.hide()
                alert("Akun Anda masih belum diaktifkan, silahkan menghubungi bagian HRD");
                $state.go('tab.login', {}, {reload: true});
            }
           
            else if(data['status'] == "212"){
              $ionicLoading.hide()
                alert("Password atau Username yang Anda masukkan salah!");
                $state.go('tab.login', {}, {reload: true});
            }
            else{
                $ionicLoading.hide()
                alert("Terdapat Kesalahan pada komunikasi dengan server");
              }
          }).
          error(function(data, status, headers, config) {
                        
            if(data == null){
              $ionicLoading.hide()
                alert("periksa sambungan Internet dan GPS Anda!");
                $state.go('tab.login', {}, {reload: true});
            }
            else{
              $ionicLoading.hide()
                alert("Terdapat Kesalahan pada komunikasi dengan server");
                $state.go('tab.login', {}, {reload: true}); 
            }
          });
      }
  }
    
  
  };
  $scope.regis = function(){
    $state.go('tab.register', {}, {reload: true});
  };
  $scope.ganti = function(){
    $state.go('tab.pass', {}, {reload: true});
  };
})



.controller('RegisCtrl', function($scope, $state, $ionicPopup, $http, $ionicLoading) {
  $scope.data = {};

  $scope.register = function(data) {
    $ionicLoading.show({
      template: 'Harap Tunggu'
    })

    var string = cordova.plugins.uid.IMEI;
    var res = data.nik.toLowerCase();
    if(data.nik == null || data.password == null || data.nama == null || data.jabatan == null || data.alamat == null ){
      $ionicLoading.hide()
      alert("Ada data Anda yang kosong atau anda menggunakan karakter yang tidak diijinkan, mohon dicek kembali");
      $state.go('tab.register', {}, {reload: true});
    }
    else if(res == "kustomerbaru"){
      $ionicLoading.hide()
      alert("Anda tidak dapat menggunakan NIK dengan nama akun ini");
      $state.go('tab.register', {}, {reload: true}); 
    }
    else{
      var nik = data.nik.replace(/\W/g, '')
      var pass = data.password.replace(/\W/g, '')
      var length_nik = nik.length;
      var length_pass = pass.length;

      if(length_nik > 20 || length_pass > 20)
      {
        $ionicLoading.hide()
        alert("Password atau NIK terlalu panjang, Maksimal 20 karakter Minimal 5 karakter");
        
      }
      else if(length_nik < 5 || length_pass < 5){
       $ionicLoading.hide()
        alert("Password atau NIK terlalu pendek Maksimal 20 karakter Minimal 5 karakter"); 
        
      }
      else{
        $http({
                  method: 'POST',
                  url: 'http://ptyasida.com/index.php/hp/daftar',
                  data: {'imei':string, 'option': 'daftar', 'NIK': nik, 'nama': data.nama, 'password': pass, 'jabatan': data.jabatan, 'alamat': data.alamat},
                  timeout: 10000
              })
      .success(function(data, status, headers, config){
        if(data['status'] == "0000"){
          $ionicLoading.hide()    
            alert("Anda telah berhasil registrasi");            
            alert("Jangan lupa aktifkan fungsi location anda");
            $state.go('tab.login', {}, {reload: true});
        }
       
        else{
          $ionicLoading.hide()
          alert("Terdapat Kesalahan pada komunikasi dengan server");
        }
      }).
      error(function(data, status, headers, config) {
        if(data == null){
          $ionicLoading.hide()
          alert("Waktu komunikasi dengan server habis, silahkan coba lagi");
        }
        else{
          $ionicLoading.hide()
          alert("registrasi gagal periksa sambungan Internet dan GPS anda.");
        }
     });
      }       

    }
   
  };
  $scope.log = function(){
    $state.go('tab.login', {}, {reload: true});
  };
})


.controller('MasukanCtrl', function($rootScope, $ionicPlatform, $scope, $http, $state, $ionicLoading){
  $ionicLoading.show({
      template: 'Harap Tunggu'
    })
  $scope.data = {};
  $scope.kantor = {};
  $rootScope.kntor={};
  $scope.kendaraan = {};
  $rootScope.kndraan = {};
  $http({
      method: 'POST',
      url: 'http://ptyasida.com/index.php/hp/get_kendaraan',
      data: {'nama': 'option'},
      timeout: 10000
  })
  .success(function(data, status, headers, config){
      $ionicLoading.hide()
      $scope.kendaraan = data;
  }).
  error(function(data, status, headers, config) {
        $ionicLoading.hide()
        alert("data belum lengkap, beberapa field akan kosong. mohon coba lagi dari awal");
        ionic.Platform.exitApp();
  });
  $scope.cari=function(data){
    $ionicLoading.show({
      template: 'Harap Tunggu'
    })
    var kantor = data.kantor.replace(/[^\w\s]/gi, '')
    var length_kantor = kantor.length;
    if(length_kantor > 40){
      $ionicLoading.hide()
      alert("nama kantor yang anda isikan terlalu panjang");
    }else{
    if(data.kantor == null){
      $ionicLoading.hide()
      alert("nama kantor yang anda isikan kosong");
    }
    else {
        $http({
        method: 'POST',
        url: 'http://ptyasida.com/index.php/hp/get_kantor',
        data: {'nama':kantor},
        timeout: 10000
      })
      .success(function(data, status, headers, config){
        if(data['status'] == "212"){
          $ionicLoading.hide()    
          alert("Nama Kantor yang Anda cari tidak dapat ditemukan");
        }else{
          $ionicLoading.hide()
          $scope.kantor = data;
        } 
      }).
      error(function(data, status, headers, config) {
          $ionicLoading.hide()
          alert("data belum lengkap, beberapa field akan kosong. mohon coba lagi");
          
      });
    }
  }
  };
  
  $scope.kirim=function(data){
    if(data.kendaraan == null || data.asal == null ){
          $ionicLoading.hide()
      alert("Terdapat data Anda yang kosong");
    }
    else{
      $rootScope.kndraan = data.kendaraan;
      $rootScope.kntor = data.asal;
     $state.go('tab.review', {}, {reload: true});
    }
  };
    
})


.controller('Send', function($rootScope, $ionicPlatform, $scope, $http, $state, $ionicLoading){
  $scope.data = {};
  $scope.pengguna = $rootScope.user;

    $scope.kirim = function(user){

          $ionicLoading.show({
          template: 'Harap Tunggu'
          })
   
    var panjang = $scope.pengguna; 
    var pilihan = new Array();
  
    var string = cordova.plugins.uid.IMEI;
    
    for (var i = 0 ; i < panjang.length ; i++) {
          
          if(user[i].pilihan == true){
            // fruits.push("Kiwi");
         
            pilihan.push(user[i].nama_pilihan);
          }
        };
     for (var i = 0; i < panjang.length; i++) {
        if(user[i].komen != null){
            // fruits.push("Kiwi");
            pilihan.push(user[i].nama_pilihan + ": " + user[i].komen);
          }
     };
    if(pilihan == null){
        $ionicLoading.hide()
        alert("Pilihan review anda masih kosong, tolong diisi");            
    } 
    else
    {
        $http({
          method: 'POST',
          url: 'http://ptyasida.com/index.php/hp/report_masuk',
          data: {'lng': $rootScope.lng,'lat': $rootScope.lat,'message': $rootScope.message,'imei': string,'nik':$rootScope.nik, 'review': pilihan, 'kode_kantor_asal': $rootScope.kntor, 'kendaraan': $rootScope.kndraan},
          timeout: 15000
        })
        .success(function(data, status, headers, config){
          if(data['status'] == "515"){
          $ionicLoading.hide()
            alert("Lat Lang Toko Baru telah berhasil Anda Tambahkan");            
            ionic.Platform.exitApp();
        }
       
          else if(data['status'] == "0000"){
          $ionicLoading.hide()    
            alert("Absensi Berhasil");
            ionic.Platform.exitApp();
        }
          else if(data['status'] == "212"){
          $ionicLoading.hide()    
            alert("Absensi Gagal, silahkan ulang lagi");
            ionic.Platform.exitApp();
        }
        else if(data['status'] == "717"){
        $ionicLoading.hide()    
            alert("Terdapat data yang kosong, mohon diulang kembali");
            ionic.Platform.exitApp();
        }
        else{
          $ionicLoading.hide()
          alert("Terdapat Kesalahan pada komunikasi dengan server");
        }
    
        }).
        error(function(data, status, headers, config) {
          $ionicLoading.hide()
          alert("Absensi Gagal, Silahkan coba lagi");
        }); 
    }
    
    };  
})

.controller("PenCtrl", function($scope,$rootScope, $ionicPlatform, $cordovaBarcodeScanner, $state, $http, $ionicLoading ) {
    $scope.data = {};
    var map = L.map('map');
    $scope.scanBarcode = function() {
    
        // map.off('locationfound', onLocationFound);
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            $ionicLoading.show({
              template: 'Harap Tunggu'
            })
            $scope.data=imageData.text;
            if(imageData.text == ""){
              $ionicLoading.hide()
              alert("data QR Code kosong, mohon coba lagi");
              
            }
            else{
              $http({
                    method : 'POST',
                    url : 'http://ptyasida.com/index.php/hp/cek_kantor',
                    data: {'kode': $scope.data},
                    timeout: 10000  
              })
               .success(function(data, status, headers, config){
                    if(data['status'] == "2121"){
                      $ionicLoading.hide()
                      alert('Toko yang anda cari tidak terdapat di database')     
                      $state.go('tab.penanda', {}, {reload: true});
                    }
                    else if(data['status'] == "1010"){
                      $scope.data=imageData.text;
                      $rootScope.message = imageData.text;
                      map.locate({setView: true, timeout: 10000, maxZoom: 16, enableHighAccuracy: true});
                      function onLocationError(e){
                        $ionicLoading.hide()
                          alert('tolong hidupkan fungsi Location HP anda');
                          map.off('locationfound', onLocationFound);
                      }
                      function onLocationFound(e) {
                          var radius = e.accuracy / 2;
                          $scope.pos=e.latlng;
                          $http({
                            method: 'POST',
                            url: 'http://ptyasida.com/index.php/hp/report_masuk',
                            data: {'lng': e.latlng.lng,'lat': e.latlng.lat,'message': imageData.text, 'nik' : 'kustomerbaru'},
                            timeout: 10000
                          })
                      // $http.post('http://10.151.43.101/test/index.php', {data})
                          .success(function(data, status, headers, config){
                            if(data['status'] == "515"){
                              $ionicLoading.hide()
                                alert("Lat Lang Toko Baru telah berhasil Anda Tambahkan");            
                                ionic.Platform.exitApp();
                            }
                            else{
                              $ionicLoading.hide()
                              alert("Terdapat Kesalahan pada komunikasi dengan server");
                            }
                          }).
                          error(function(data, status, headers, config) {
                            $ionicLoading.hide()
                            alert("Proses memasukkan Lat Lang baru Gagal, Silahkan coba lagi");
                            ionic.Platform.exitApp();
                          });
                      }
                      map.on('locationfound', onLocationFound);
                      map.on('locationerror', onLocationError);
                    }
                    else{
                      $ionicLoading.hide()
                      $state.go('tab.penanda', {}, {reload: true});
                    }
                  }).
              error(function(data, status, headers, config) {
                    $ionicLoading.hide()
                    alert("Pengambilan data kantor Gagal, Silahkan coba lagi");
                    map.off('locationfound', onLocationFound);
                  });   
          }
        },
        function(error) {
            $ionicLoading.hide()
            alert("Terdapat Sebuah error pada sistem mohon di coba lagi ");

        });
    };
 
})

.controller("DashCtrl", function($scope,$rootScope, $ionicPlatform, $cordovaBarcodeScanner, $state, $http, $ionicLoading ) {
    $scope.data = {};
    $ionicLoading.show({
      template: 'Harap Tunggu, Sedang mengambil data pilihan review'
    })
    $rootScope.user = {};
    $http({
          method : 'POST',
          url : 'http://ptyasida.com/index.php/hp/get_choice',
          data: {'option':'option'},
          timeout: 10000  
    })
    .success(function(data, status, headers, config){
          $ionicLoading.hide()
          $rootScope.user=data;
        }).
    error(function(data, status, headers, config) {
          $ionicLoading.hide()
          alert("Pengambilan data pilihan review Gagal, Silahkan coba lagi");
          ionic.Platform.exitApp();
        });
    var map = L.map('map');
    $scope.scanBarcode = function() {
     
        // map.off('locationfound', onLocationFound);
        $cordovaBarcodeScanner.scan().then(function(imageData) {
           $ionicLoading.show({
              template: 'Harap Tunggu'
            })
            $scope.data=imageData.text;
            if(imageData.text == ""){
              $ionicLoading.hide()
              alert("data QR Code kosong, mohon coba lagi");
            }
            else{
              $http({
                    method : 'POST',
                    url : 'http://ptyasida.com/index.php/hp/cek_kantor',
                    data: {'kode': $scope.data},
                    timeout: 10000  
              })
              .success(function(data, status, headers, config){
                    if(data['status'] == "2121"){
                      $ionicLoading.hide()
                      alert('Toko yang anda cari tidak terdapat di database')     
                      $state.go('tab.dash', {}, {reload: true});
                    }
                    else if(data['status'] == "1010"){
                          $rootScope.message = imageData.text;
                          map.locate({setView: true, timeout: 10000, maxZoom: 16, enableHighAccuracy: true});
                          function onLocationError(e){
                            $ionicLoading.hide()
                              alert('tolong hidupkan fungsi Location HP anda');
                              map.off('locationfound', onLocationFound);
                          }
                          function onLocationFound(e) {
                              var radius = e.accuracy / 2;
                              $scope.pos=e.latlng;
                              $rootScope.lat= e.latlng.lat;
                              $rootScope.lng= e.latlng.lng;                                        
                              $ionicLoading.hide()

                              $state.go('tab.masukan', {}, {reload: true});
                          }
                          map.on('locationfound', onLocationFound);
                          map.on('locationerror', onLocationError);  
                    }
                    
                    else{
                      $ionicLoading.hide()
                      $state.go('tab.dash', {}, {reload: true});
                    }
                  }).
              error(function(data, status, headers, config) {
                    $ionicLoading.hide()
                    alert("Pengambilan data kantor Gagal, Silahkan coba lagi");
                    map.off('locationfound', onLocationFound);
                  }); 
            }
              
        },
        function(error) {
            $ionicLoading.hide()
            alert("Terdapat Sebuah error mohon di coba lagi "); 
        });
    };
 
});


