var $scope, $location;
var app = angular.module('example', ['google.places']);
// Setup a basic controller with a scope variable 'place'
app.controller('MainCtrl', function ($filter, $http, $scope, $location, anchorSmoothScroll) {
  $scope.origin = null;
  $scope.destination = null;
  $scope.search = 'Search';
  $scope.departdate = {
         value: new Date()
       };

  $scope.searchresults = null;

  $scope.searchnow = function() {
    $scope.search = 'Searching..'
    $location.hash('bottom');
    var origin = $scope.origin
    var destination = $scope.destination
    var departdate = $scope.departdate
    if(origin == null || destination == null || departdate==null) {
      return;
    }
    olatlong = origin.geometry.location.lat() + ',' + origin.geometry.location.lng();
    dlatlong = destination.geometry.location.lat() + ',' + destination.geometry.location.lng();
    originaddress = origin.formatted_address;
    destinationaddress = destination.formatted_address;
    ddate = $filter('date')(departdate.value, "yyyy-MM-dd");

    var queryurl = '/flightsearch?olatlong=' + olatlong + '&dlatlong=' + dlatlong +
                  '&origin=' + originaddress + '&destination=' + destinationaddress +
                  '&departdate=' + ddate ;

    console.log(queryurl)

      // call $anchorScroll()
    $http({
      method: 'GET',
      url: queryurl
    }).then(function successCallback(response) {
        $scope.searchresults = response.data
        $scope.search = 'Search';
        anchorSmoothScroll.scrollTo('bottom');
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });


  };

});
