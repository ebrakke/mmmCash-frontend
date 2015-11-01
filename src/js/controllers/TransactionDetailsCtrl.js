'use strict';

app.controller('TransactionDetailsCtrl', function($scope, $routeParams, Transaction, Geolocation, Auth) {
    $scope.loading = false;
    $scope.code = null;
    $scope.verify = false;
    $scope.verifyError = false;
    // $scope.transaction = new Transaction({
    //     'tid': 1,
    //     'amount': 20,
    //     'status': 'pending',
    //     'fulfiller': {
    //         // 'uid': 1,
    //         'name': 'Tyler W',
    //         'lat': 42.3465898,
    //         'lng': -71.1048371
    //     },
    //     'requester': {
    //         // 'uid': 1,
    //         'name': 'Erik B',
    //         'lat': 42.3465898,
    //         'lng': -71.1048371
    //     }
    // });

    $scope.toggleVerify = function() {
        $scope.verify = true;
    };

    $scope.isFulfiller = function() {
        if ($scope.transaction.fulfiller === null) {
            return false;
        } else {
            return $scope.transaction.fulfiller.userID === Auth.getUser().userID;
        }
    };

    $scope.isWaitingToBeAccepted = function() {
        return $scope.transaction.status === 'pending';
    };

    $scope.isWaitingForVerification = function() {
        return $scope.transaction.status === 'accepted';
    };

    $scope.verifyRequest = function() {
        $scope.loading = true;

        $scope.transaction.verify($scope.code).then(function() {
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

    $scope.acceptRequest = function() {
        $scope.loading = true;

        $scope.transaction.accept().then(function() {

        }).finally(function() {
            $scope.loading = false;
        });
    };

    $scope.denyRequest = function() {
        $scope.loading = true;

        $scope.transaction.deny().then(function() {

        }).finally(function() {
            $scope.loading = false;
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

    // Method to continually check transaction status.
    $scope.checkTransaction = true;
    var fetchTransaction = function() {
        Transaction.get($routeParams.id).then(function(t) {
            $scope.transaction = t;

            // Recursively check status.
            if ($scope.checkTransaction) {
                fetchTransaction();
            }
        });
    };

    $scope.$on('$destroy', function() {
        // Stop loading comments when the user
        // leaves the page.
        $scope.checkTransaction = false;
    });

    fetchTransaction();
});
