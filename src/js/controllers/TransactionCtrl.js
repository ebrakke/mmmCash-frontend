'use strict';

app.controller('TransactionCtrl', function($scope, $location, Transaction, Geolocation, Auth) {
    $scope.loading = false;
    $scope.amount = 0;
    $scope.user = Auth.getUser();

    $scope.requestMoney = function() {
        $scope.loading = true;

        var transaction = new Transaction();
        transaction.amount = $scope.amount;

        Geolocation.getLocation().then(function() {
            transaction.lat = Geolocation.getLatitude();
            transaction.lng = Geolocation.getLongitude();

            transaction.create().then(function(transaction) {
                $location.path('/transaction/' + transaction.tID);
            }).finally(function() {
                $scope.loading = false;
            });
        });
    };

    $scope.goOnline = function() {
        $scope.loading = true;

        $scope.user.goOnline($scope.amount).then(function() {
            $scope.startSearchForTransactions();
        }).finally(function() {
            $scope.loading = false;
        });
    };

    $scope.goOffline = function() {
        $scope.loading = true;

        $scope.user.goOffline().then(function() {
            $scope.stopSearchForTransactions();
        }).finally(function() {
            $scope.loading = false;
        });
    };

    $scope.startSearchForTransactions = function() {
        $scope.findTransaction = true;

        searchForTransaction();
    };

    $scope.stopSearchForTransactions = function() {
        $scope.findTransaction = false;
    };

    // Method to continually search for a transaction.
    var searchForTransaction = function() {
        Geolocation.getLocation().then(function() {
            var lat = Geolocation.getLatitude();
            var lng = Geolocation.getLongitude();

            Transaction.search(lat, lng).then(function(t) {
                if (t) {
                    $location.path('/transaction/' + t.tID);
                }

                // Recursively search.
                if ($scope.findTransaction) {
                    searchForTransaction();
                }
            });
        });
    };

    $scope.$on('$destroy', function() {
        // Stop searching when the user
        // leaves the page.
        $scope.findTransaction = false;
    });

    if ($scope.user.online) {
        $scope.startSearchForTransactions();
    }
});
