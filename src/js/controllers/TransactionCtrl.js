'use strict';

app.controller('TransactionCtrl', function($scope, Transaction, Geolocation) {
    $scope.selected = [];
    $scope.transaction = null;
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
        var transaction = new Transaction();
        transaction.amount = $scope.amount();

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

    $scope.amount = function() {
        if ($scope.transaction) {
            return $scope.transaction.amount;
        } else if ($scope.selected.length === 0) {
            return 0;
        } else {
            return $scope.selected.join('');
        }
    };

    $scope.select = function(selection) {
        if (selection === '.' && $scope.selected.indexOf('.') > -1) {
            return;
        }

        if ($scope.selected.length <= 4) {
            $scope.selected.push(selection);
        }
    };

    $scope.delete = function() {
        $scope.selected.pop();
    };
});
