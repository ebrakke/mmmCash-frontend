'use strict';

app.controller('TransactionCtrl', function($scope, Transaction, Geolocation) {
    $scope.selected = [];
    $scope.transaction = null;
    $scope.amount = 0;
    // $scope.transaction = new Transaction({
    //     'tid': 1,
    //     'amount': 20,
    //     'status': 'accepted',
    //     'fulfiller': {
    //         'name': 'Tyler W',
    //         'lat': 42.3465898,
    //         'lng': -71.1048371
    //     }
    // });

    $scope.requestMoney = function() {
        var transaction = new Transaction();
        transaction.amount = $scope.getNumber();

        Geolocation.getLocation().then(function() {
            transaction.lat = Geolocation.getLatitude();
            transaction.lng = Geolocation.getLongitude();

            transaction.create().then(function(transaction) {
                $scope.transaction = new Transaction(transaction);
            });
        });
    };

    $scope.cancelRequest = function() {
        $scope.transaction.cancel().then(function() {
            $scope.transaction = null;
        });
    };
});
