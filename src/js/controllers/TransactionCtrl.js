'use strict';

app.controller('TransactionCtrl', function($scope, $location, Transaction, Geolocation, Auth) {
    $scope.loading = false;
    $scope.user = Auth.user;
    console.log('user', Auth.user);

    $scope.requestMoney = function() {
        $scope.loading = true;

        var transaction = new Transaction();
        transaction.amount = Auth.amount;

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

        Auth.getUser().goOnline(Auth.user.amount).then(function() {
            Auth.set('online', true);
            console.log('online', Auth.user.online);
            $scope.startSearchForTransactions();
        }).finally(function() {
            $scope.loading = false;
        });
    };

    $scope.goOffline = function() {
        $scope.loading = true;

        Auth.getUser().goOffline().then(function() {
            Auth.set('online', false);
            console.log('offline', Auth.user);
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
        console.log('[searching]');

        Geolocation.getLocation().then(function() {
            var lat = Geolocation.getLatitude();
            var lng = Geolocation.getLongitude();

            console.log(lat, lng);

            // Recursively search.
            if ($scope.findTransaction) {
                searchForTransaction();
            }
        });
    };

    $scope.$on('$destroy', function() {
        // Stop searching when the user
        // leaves the page.
        $scope.findTransaction = false;
    });
});
