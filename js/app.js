angular.module('democenter', [
    'demoFactory',
    'ngRoute',
    'ngProgress',
    'ui.bootstrap'
]).run(['$rootScope', '$sce','Demo', '$routeParams', '$location', '$window',
    function($rootScope, $sce, Demo, $routeParams, $location, $window) {
        $rootScope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }

        $rootScope.list = (function() {
            return Demo.query(function(results) {
                var categories = {
                    'all': {
                        'name': 'all',
                        'value': '',
                        'count': results.length,
                        'href': '#demos'
                    }
                };
                angular.forEach(results, function(value, key) {
                    if (typeof categories[value.category] == 'undefined') {
                        categories[value.category] = {
                            'name': value.category,
                            'count': 0,
                            'value': value.category,
                            'href': '#demos/' + value.category
                        }
                    }
                    categories[value.category]['count'] += 1;
                });
                $rootScope.categories = categories;
            })
        })();

        $rootScope.$on('$routeChangeSuccess', function(scope, next, current) {
            if (typeof next.params.category !== 'undefined') {
                $rootScope.currentCategory = next.params.category;
            } else {
                $rootScope.currentCategory = '';
            }
            $window.ga('send', 'pageview', { page: $location.path() });
        });

        $rootScope.getFbUri = function(category, uri) {
            return '//www.facebook.com/plugins/like.php?href=' + encodeURIComponent(
                    'http://demos.julienrenaux.fr/#/demos/' + category + '/' + uri) +
                    '&amp;width=200&amp;height=30&amp;colorscheme=light&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;send=false';
        }
    }
]);

angular.module('demoFactory', ['ngResource'])
    .factory('Demo', function($resource) {
        return $resource('data/:demoId.json', {}, {
            query: {
                method: 'GET',
                params: {
                    demoId: 'demos'
                },
                isArray: true,
                cache: false
            }
        });
    });

angular.module('democenter').config(['$sceDelegateProvider',
    function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'examples.julienrenaux.fr',
            'connect.facebook.net',
            'www.facebook.com',
            'self'
        ]);

    }
]);

angular.module('democenter').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/demos', {
            templateUrl: 'template/demo-list.html'
        }).
        when('/demos/:category', {
            templateUrl: 'template/demo-list.html'
        }).
        when('/demos/:category/:demoId', {
            templateUrl: 'template/demo-item.html',
            controller: DemoItemCtrl
        }).
        otherwise({
            redirectTo: '/demos'
        });
    }
]);

function DemoItemCtrl($scope, $location, $routeParams, Demo, ngProgress) {
    ngProgress.start();

    $scope.item = Demo.get({
        demoId: $routeParams.demoId
    }, function(demo) {
        ngProgress.complete();
    }, function(error) {
        $scope.item = {
            name: 'Oups Something wrong happened'
        };
        ngProgress.complete();
    });
}

DemoItemCtrl.$inject = ['$scope', '$location', '$routeParams', 'Demo', 'ngProgress'];
