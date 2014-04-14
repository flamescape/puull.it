
angular.module('app', ['restangular'])

    .controller('ListCtrl', function($scope, Restangular){
        $scope.load = function(){
            Restangular.all('puushes').getList().then(function(puushes){
                $scope.puushes = puushes.map(function(p){
                    p.link = 'http://puu.sh/' + bases.toBase62(p.pid);
                    return p;
                });
            });
        };
        
        $scope.load();
    })
    
;