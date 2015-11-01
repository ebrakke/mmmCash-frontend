'use strict';

app.controller('TransactionCtrl', function($scope, $location, Transaction, Geolocation) {
    $scope.loading = false;
    $scope.amount = 0;

    $scope.requestMoney = function() {
        $scope.loading = true;

        var transaction = new Transaction();
        transaction.amount = $scope.getNumber();

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
});
