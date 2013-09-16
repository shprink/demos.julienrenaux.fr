var app = angular.module('democenter', ['demoFactory', 'ngRoute'])
		.config(function($routeProvider, $sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		'examples.julienrenaux.fr',
		'connect.facebook.net',
		'facebook.com',
		'/template'
	]);
	$routeProvider.
			when('/demos', {templateUrl: 'template/demo-list.html', controller: DemoListCtrl}).
			when('/demos-:category', {templateUrl: 'template/demo-list.html', controller: DemoListCtrl}).
			when('/demos/:demoId', {templateUrl: 'template/demo-item.html', controller: DemoItemCtrl}).
			otherwise({redirectTo: '/demos'});
});

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

//app.config(['$httpProvider', function ($httpProvider) {
//    var $http,
//        interceptor = ['$q', '$injector', function ($q, $injector) {
//            var error;
//
//            function success(response) {
//                // get $http via $injector because of circular dependency problem
//                $http = $http || $injector.get('$http');
//                if($http.pendingRequests.length < 1) {
//                    $('#loadingWidget').hide();
//                }
//                return response;
//            }
//
//            function error(response) {
//                // get $http via $injector because of circular dependency problem
//                $http = $http || $injector.get('$http');
//                if($http.pendingRequests.length < 1) {
//                    $('#loadingWidget').hide();
//                }
//                return $q.reject(response);
//            }
//
//            return function (promise) {
//                $('#loadingWidget').show();
//                return promise.then(success, error);
//            }
//        }];
//
//    $httpProvider.responseInterceptors.push(interceptor);
//}]);

// http://jsfiddle.net/moderndegree/yYEXN/
//angular.module('demoCache', []).
//		factory('DemoCache', function($cacheFactory) {
//	return $cacheFactory('someCache', {
//		capacity: 3
//	});
//});

function DemoListCtrl($scope, $filter, $routeParams, $cacheFactory, $log, $http, Demo) {
	//var $httpDefaultCache = $cacheFactory.get('$http');
//	$log.log($httpDefaultCache.removeAll());
	//$cacheFactory.get('$http').removeAll();
	$scope.loaded = false;
	$scope.list = Demo.query();

	$scope.getList = function() {

		// Reload FB like button on newly inserted content
		//window.FB.XFBML.parse();

		return $scope.list;
	}

	$scope.getRoute = function() {
		if (typeof $routeParams.category != 'undefined') {
			return  $routeParams.category;
		}
		return '';
	}

	$scope.isActive = function(category) {
		if (category === $scope.getRoute() || ($scope.getRoute() == '' && category === 'all')) {
			return 'active';
		}
		return '';
	}

	$scope.getFbUri = function(uri) {
		return '//www.facebook.com/plugins/like.php?href=' + encodeURIComponent('http://demos.julienrenaux.fr/#/demos/' + uri) + '&amp;width=200&amp;height=30&amp;colorscheme=light&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;send=false';
	}

	$scope.getCategories = function() {
		var categories = {
			'all': {
				'name': 'all',
				'count': $scope.list.lenght,
				'href': '#demos'
			}
		};
		angular.forEach($scope.list, function(value, key) {
			if (typeof categories[value.category] == 'undefined') {
				categories[value.category] = {
					'name': value.category,
					'count': 0,
					'href': '#demos-' + value.category
				}
			}
			categories[value.category]['count'] += 1;
		});
		return categories
	}
	
	$scope.loaded = true;
	
//	$scope.$on('$routeChangeStart', function(scope, next, current) {
//		console.log('Changing from ' + angular.toJson(current) + ' to ' + angular.toJson(next));
//	});
//	$scope.$on('$routeChangeSuccess', function(scope, next, current) {
//		console.log('success');
//	});
}

DemoListCtrl.$inject = ['$scope', '$filter', '$routeParams', '$cacheFactory', '$log', '$http', 'Demo'];

function DemoItemCtrl($scope, $routeParams, Demo) {
	Demo.get({
		demoId: $routeParams.demoId
	}, function(demo) {
		$scope.item = demo;
	}, function(error) {
		$scope.item = {
			name: 'Oups Something wrong happened'
		};
	});
	$("#accordion").collapse();
}

DemoItemCtrl.$inject = ['$scope', '$routeParams', 'Demo'];
