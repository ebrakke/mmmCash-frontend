'use strict';

app.directive('numberPad', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            'number': '='
        },
        templateUrl: 'partials/templates/number-pad.html',
        link: function(scope) {
            scope.selected = [];

            scope.select = function(selection) {
                if (selection === '.' && scope.selected.indexOf('.') > -1) {
                    return;
                }

                if (scope.selected.length <= 4) {
                    scope.selected.push(selection);
                    scope.number = scope.getNumber();
                }
            };

            scope.delete = function() {
                scope.selected.pop();
                scope.number = scope.getNumber();
            };

            scope.getNumber = function() {
                if (scope.selected.length === 0) {
                    return 0;
                } else {
                    return scope.selected.join('');
                }
            };
        }
    };
});
