
angular.module('app', ['restangular'])

    .controller('ListCtrl', function($scope, Restangular){
        $scope.load = function(){
            Restangular.one('puush').get().then(function(puush){
                $scope.puushes = [];
                for (var i = 500; i < 550; i++) {
                    $scope.puushes.push({img: Bases.toBase62(puush.end - i)});
                }
            });
        };
        
        $scope.load();
    })
    
;