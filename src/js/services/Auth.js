'use strict';

app.factory('Auth', function(config, $http, $location, $q, $localStorage, User) {
    var api = config.api + '/user/auth';

    var Auth = {};

    Auth.getUser = function() {
        Auth.user = new User($localStorage.user);

        return Auth.user;
    };

    Auth.setUser = function(user) {
        $localStorage.user = user;

        if (Auth.user) {
            Auth.user.update(user);
        } else {
            Auth.user = new User(user);
        }
    };

    Auth.updateUser = function() {
        User.get(Auth.getUser().userID).then(function(user) {
            Auth.setUser(user.toData());
        });
    };

    Auth.setToken = function(token) {
        $localStorage.token = token;
    };

    Auth.isLogged = function() {
        return !!$localStorage.token && !!$localStorage.user;
    };

    Auth.login = function(email, password) {
        var deferred = $q.defer();

        $http.post(api, {
            'email': email,
            'password': password
        }).success(function(response) {
            var data = response.data;
            Auth.setToken(data.authToken);
            Auth.setUser(data);

            deferred.resolve();
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    Auth.logout = function() {
        delete $localStorage.token;
        delete $localStorage.user;

        $location.path('/login');
    };

    return Auth;
});
