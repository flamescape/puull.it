
angular.module('app', [])

    .controller('ListCtrl', function($scope){
    
        var rint = (Math.random() * 10000) << 0;
        
        var ps = [];
        for (var i = 0; i < 50; i++) {
            ps.push({img: Bases.toBase62(i+118420000 + rint)});
        }
    
        $scope.puushes = ps;
    
    })
    
;