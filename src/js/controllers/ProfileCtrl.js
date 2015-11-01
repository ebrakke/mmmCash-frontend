'use strict';

app.controller('ProfileCtrl', function($scope, Auth) {
    $scope.user = Auth.getUser();

    $scope.logout = function() {
        Auth.logout();
    };
});
