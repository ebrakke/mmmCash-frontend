'use strict';

app.controller('RootCtrl', function($scope, $location, Auth) {
    console.log('[isLogged]', Auth.isLogged());

    if (Auth.isLogged()) {
        Auth.loadUser();
        Auth.updateUser();
        $location.path('/home');
    } else {
        $location.path('/login');
    }
});
