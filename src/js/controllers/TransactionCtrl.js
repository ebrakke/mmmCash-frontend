'use strict';

app.controller('TransactionCtrl', function($scope, Transaction, Geolocation) {
    $scope.loading = false;
    $scope.selected = [];
    $scope.transaction = null;
    $scope.amount = 20;
    $scope.code = null;
    $scope.verify = false;
    $scope.verifyError = false;
    $scope.transaction = new Transaction({
        'tid': 1,
        'amount': 20,
        'status': 'accepted',
        'fulfiller': {
            'name': 'Tyler W',
            'lat': 42.3465898,
            'lng': -71.1048371
        }
    });

    $scope.requestMoney = function() {
        $scope.loading = true;

        var transaction = new Transaction();
        transaction.amount = $scope.getNumber();

        Geolocation.getLocation().then(function() {
            transaction.lat = Geolocation.getLatitude();
            transaction.lng = Geolocation.getLongitude();

            transaction.create().then(function(transaction) {
                $scope.transaction = new Transaction(transaction);
            }).finally(function() {
                $scope.loading = false;
            });
        });
    };

    $scope.cancelRequest = function() {
        $scope.loading = true;

        $scope.transaction.cancel().then(function() {
            $scope.transaction = null;
        }).finally(function() {
            $scope.loading = false;
        });
    };

    $scope.toggleVerify = function() {
        $scope.verify = true;
    };

    $scope.verifyRequest = function() {
        $scope.loading = true;

        $scope.transaction.verify().then(function() {
            $scope.transaction = null;
            $scope.verify = false;
            $scope.code = null;
            $scope.amount = 0;
        }, function() {
            $scope.verifyError = true;
        }).finally(function() {
            $scope.loading = false;
        });
    };
});
