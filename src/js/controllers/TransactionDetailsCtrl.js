'use strict';

app.controller('TransactionDetailsCtrl', function($scope, $location, $routeParams, Transaction, Geolocation, Auth) {
    $scope.loading = false;
    $scope.code = 0;
    $scope.verify = false;
    $scope.verifyError = false;

    $scope.toggleVerify = function() {
        $scope.verify = true;
    };

    $scope.isRequester = function() {
        if (!$scope.transaction.requester) {
            return false;
        } else {
            return $scope.transaction.requester.userID === Auth.getUser().userID;
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
            $location.path('/');
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
            $location.path('/');
        }).finally(function() {
            $scope.loading = false;
        });
    };

    $scope.cancelRequest = function() {
        $scope.loading = true;

        $scope.transaction.cancel().then(function() {
            $scope.transaction = null;
            $location.path('/');
        }).finally(function() {
            $scope.loading = false;
        });
    };

    // Method to continually check transaction status.
    $scope.checkTransaction = true;
    var fetchTransaction = function() {
        Transaction.get($routeParams.id).then(function(t) {
            $scope.transaction = t;

            if ($scope.transaction.status === 'completed') {
                $location.path('/');
            }

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
