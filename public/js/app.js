
angular.module('app', ['restangular'])

    .controller('ListCtrl', function($scope, Restangular){
        $scope.load = function(){
            Restangular.all('puushes').getList().then(function(puushes){
                $scope.puushes = puushes;
            });
        };
        
        $scope.load();
    })
    
;