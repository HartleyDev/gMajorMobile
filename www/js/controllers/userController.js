angular.module('gmajor.userController', [])

.controller('UserController', function ($scope) {

  $scope.logout = function(){
    openFb.logout();
    $scope.user = null;
    window.name = '';
  };

});

// 'http://graph.facebook.com/endpoint?key=' + window.sessionStorage.fbid +'&access_token=' + window.sessionStorage.fbtoken