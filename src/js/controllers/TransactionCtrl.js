'use strict';

app.controller('TransactionCtrl', function($scope, $location, Transaction, Geolocation, Auth) {
    $scope.loading = false;
    $scope.amount = 0;
    $scope.online = false;

    $scope.requestMoney = function() {
        $scope.loading = true;

        var transaction = new Transaction();
        transaction.amount = $scope.amount;

        Geolocation.getLocation().then(function() {
            transaction.lat = Geolocation.getLatitude();
            transaction.lng = Geolocation.getLongitude();

            transaction.create().then(function(transaction) {
                $location.path('/transaction/' + transaction.tid);
            }).finally(function() {
                $scope.loading = false;
            });
        });
    };

    $scope.goOnline = function() {
        $scope.loading = true;

        Auth.getUser().goOnline($scope.amount).then(function() {
            $scope.online = true;
        }).finally(function() {
            $scope.loading = false;
        });
    };

    $scope.goOffline = function() {
        $scope.loading = true;

        Auth.getUser.goOffline().then(function() {
            $scope.online = false;
        }).finally(function() {
            $scope.loading = false;
        });
    };
});
