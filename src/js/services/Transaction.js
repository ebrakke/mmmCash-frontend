'use strict';

app.factory('Transaction', function(config, $q, $http) {
    var api = config.api + '/transaction';

    var Transaction = function(data) {
        angular.extend(this, data);
    };

    Transaction.prototype.create = function() {
        var transaction = this;
        var deferred = $q.defer();

        $http.post(api, transaction).success(function(response) {
            var data = response.data;
            transaction.tID = data.tID;

            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    Transaction.prototype.cancel = function() {
        var deferred = $q.defer();

        $http.delete(api + '/' + this.tID).success(function(response) {
            var data = response.data;

            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    Transaction.prototype.accept = function() {
        var deferred = $q.defer();

        $http.post(api + '/' + this.tID + '/accept').success(function(response) {
            var data = response.data;

            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    Transaction.prototype.deny = function() {
        var deferred = $q.defer();

        $http.post(api + '/' + this.tID + '/deny').success(function(response) {
            var data = response.data;

            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    Transaction.prototype.verify = function(code) {
        var deferred = $q.defer();

        $http.post(api + '/' + this.tID + '/verify', {
            'code': code
        }).success(function(response) {
            var data = response.data;

            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    Transaction.search = function(lat, lng) {
        var deferred = $q.defer();

        $http.get(api + '/search?lat=' + lat + '&lng=' + lng).success(function(response) {
            if (response.data) {
                deferred.resolve(new Transaction(response.data));
            } else {
                deferred.resolve(null);
            }
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    Transaction.get = function(id) {
        var deferred = $q.defer();

        $http.get(api + '/' + id).success(function(response) {
            deferred.resolve(new Transaction(response.data));
        }).error(function(error) {
            deferred.reject(error.meta.err);
        });

        return deferred.promise;
    };

    return Transaction;
});
