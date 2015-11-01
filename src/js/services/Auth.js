'use strict';

app.factory('Auth', function(config, $http, $location, $q, $localStorage, User) {
    var api = config.api + '/user/auth';

    var Auth = {};

    Auth.user = null;

    Auth.getUser = function() {
        return Auth.user;
    };

    Auth.setUser = function(user) {
        $localStorage.user = user;
        Auth.user = new User($localStorage.user);
    };

    Auth.loadUser = function() {
        Auth.user = new User($localStorage.user);
    };

    Auth.set = function(field, value) {
        Auth.user[field] = value;
        Auth.setUser(Auth.user.toData());
    };

    Auth.updateUser = function() {
        var user = Auth.getUser();

        User.get(user.userID).then(function(user) {
            Auth.setUser(user.toData());
        });
    };

    Auth.setToken = function(token) {
        $localStorage.token = token;
    };

    Auth.isLogged = function() {
        if (!!$localStorage.token && !!$localStorage.user) {
            Auth.loadUser();
            return true;
        } else {
            Auth.user = null;
            return false;
        }
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
