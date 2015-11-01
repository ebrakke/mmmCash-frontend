'use strict';

app.factory('User', function(config, $q, $http) {
    var api = config.api + '/user';

    var User = function(data) {
        angular.extend(this, data);
    };

    User.prototype.toData = function() {
        return {
            'userID': this.userID,
            'name': this.name,
            'email': this.email,
            'phoneNumber': this.phoneNumber,
            'amount': this.amount,
            'online': this.online,
            'credit': this.credit
        };
    };

    User.prototype.create = function() {
        var user = this;
        var deferred = $q.defer();

        $http.post(api, user).success(function(response) {
            var data = response.data;
            user.userID = data.userID;

            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    User.prototype.goOnline = function(amount) {
        var deferred = $q.defer();
        var self = this;

        $http.post(api + '/' + this.userID + '/online', {
            'amount': amount
        }).success(function(response) {
            var data = response.data;
            self.online = true;
            self.amount = amount;

            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    User.prototype.goOffline = function() {
        var deferred = $q.defer();
        var self = this;

        $http.post(api + '/' + this.userID + '/offline').success(function(response) {
            var data = response.data;
            self.online = false;
            self.amount = 0;

            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    User.get = function(id) {
        var deferred = $q.defer();

        $http.get(api + '/' + id).success(function(response) {
            deferred.resolve(new User(response.data));
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    return User;
});
