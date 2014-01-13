'use strict';
/* jshint camelcase:false */

angular.module('crmApp')
  .controller('UserEditCtrl', ['$rootScope', '$scope', 'UserResource', '$location', '$http', '$routeParams', 'mongosailsHelper', '$resource', 'lookupCacheUser', function($rootScope, $scope, UserResource, $location, $http, $routeParams, mongosailsHelper, $resource, lookupCacheUser) {

    $scope.param = $routeParams.id;//POID;

    console.log(' UserEditCtrl ', $scope.param, $routeParams.id);

    $scope.cancel = function() {
      //var poPromise = lookupCachePO.resetPO();
      $location.path('/user');

    };
    $scope.table_properties = {
      client_status: ['Morning', 'Afternoon', 'Evening']
    };

    // 1,2,3,4

    $scope.roles = {
      role_status: ['clerk', 'user', 'supervisor', 'admin']
    };


    $scope.roles2 = [
      { name: 'clerk', id: 1},
      { name: 'user', id: 2 },
      { name: 'supervisor', id: 3 },
      { name: 'admin', id: 4 }
    ];


    if ($scope.param !== 0) {
      console.log(' before UserEditCtrl in  find1 ', $routeParams.id !== 0);
      $scope.user = UserResource.find1({id: $routeParams.id});
      console.log(' after find1   ', $scope.user);
    } else {
      console.log('new');
      $scope.user = {};

    }

    $scope.cancel = function() {
      $location.path('/user');
    };
    $scope.save = function(success, error) {
      console.log('in save  ', $scope.user, $scope.param, $scope.param === 0, $scope.param === '0');
      var hUser = {};// do a depp copy
      angular.copy($scope.user, hUser);
      if ($scope.param === 0) {
        UserResource.create($scope.user, function(success, error) {

          console.log('success:create: ', success);
          if (success) {
            var userPromise = lookupCacheUser.pushUser(success.data);// push created object with key and not hUser);

          }
        });

      } else {

        var id = $scope.user.id;



        UserResource.update({id: id}, $scope.user, function(success, error) {
          if (success) {
            var userPromise = lookupCacheUser.updateUsers(hUser);

          }
        });



      }


      $location.path('/user');

    };
  }])


  .controller('UserCtrl', ['$rootScope', '$scope', 'UserResource', '$location', '$modal', '$log', 'lookupCacheUser' , function($rootScope, $scope, UserResource, $location, $modal, $log, lookupCacheUser) {
    console.log(' UserCtrl js home ');



    $scope.edit = function(user) {
      $rootScope.userid = user.id;
      console.log('  controllerUser | $rootScope.userid  ', $rootScope.userid);
      $location.path('/user/' + $rootScope.userid);
      UserResource.find1(function(res) {
        console.log('controllerUser res ', res);

        $scope.loading = false;
      }, function(err) {
        $rootScope.error = 'Failed to fetch users.';
        $scope.loading = false;
      });
    };
// http://localhost:1337/user/destroy/522e1a34784c1d1c5d000001 manual way to delete
    $scope.delete = function(user) {
      console.log('delete user  ', user, user.id);// user[0]);//.id);
      $scope.items = user.username + ' ' + user.id;//'You are about to delete ',
      //alert( 'user  '+ user.id)
      // UserResource.destroy( {id:user.id}, user, function (success, error) {
      var modalInstance = $modal.open({
        templateUrl: '/partials/myModalContent',
        controller: ModalInstanceCtrl,
        resolve: {
          items: function() {
            return $scope.items;
          }
        }
      });
      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
        UserResource.destroy({id: user.id}, function(success, error) {

          if (success) {
            console.log('success ', success, success.data === 'success');
            $scope.reset();




          }
        });
        //alert('Record is deleted: ' + result);

      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.new = function(user) {
      $rootScope.userid = 0;//user.id;
      $scope.users.push({'username': 'fillname'});
      console.log('  controllerUser | $rootScope.userid  ', $rootScope.userid);
      $location.path('/user/' + $rootScope.userid);
      $scope.reset();

    };


    $scope.reset = function() {
      lookupCacheUser.resetUsers();
      var userPromise = lookupCacheUser.getUsers();
      userPromise.then(function(cache) {
        $scope.users = cache.data;
        //$scope.accountIndex = cache.combo;
        //console.log(' $scope.account ', $scope.account)
      })
        .catch (function(err) {
        console.error('users', err);
      });
    };
    var userPromise = lookupCacheUser.getUsers();
    userPromise.then(function(cache) {
      $scope.users = cache.data;
      //$scope.accountIndex = cache.combo;
      //console.log(' $scope.account ', $scope.account)
    })
      .catch (function(err) {
      console.error('users', err);
    });


    var displayDateTemplate = ' <div style="width:75;text-align: left" class="ngCellText colt{{$index}}">{{row.getProperty(col.field)}}</div>';
    var editrowTemplate = '<a class="icon-edit edit" href="{{\'/user/\'+row.entity.id}}"></a>';
//
//
    $scope.filterOptions = {
      filterText: '',          //filteringText
      useExternalFilter: false
    };

  }]);


// TODO: refactor this function
//Application.Controllers.controller('ModalInstanceCtrl' ['$scope', '$modalInstance', 'item', function ($scope, $modalInstance, items) {
var ModalInstanceCtrl = function($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function() {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
};
// }]);



