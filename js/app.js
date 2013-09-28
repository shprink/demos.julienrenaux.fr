var app = angular.module('democenter', ['demoFactory', 'ngRoute'])
		.config(function($routeProvider, $sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		'examples.julienrenaux.fr',
		'connect.facebook.net',
		'facebook.com',
		'/template'
	]);
	$routeProvider.
			when('/demos', {
		templateUrl: 'template/demo-list.html',
		controller: DemoListCtrl
	}).
			when('/demos/:demoId', {
		templateUrl: 'template/demo-item.html',
		controller: DemoItemCtrl
	}).
			otherwise({
		redirectTo: '/demos'
	});
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

// Register the After loading function to load Google Analitycs and Discus
window.afterLoading = function($location, $window, callback) {
	var currentPageId = $location.path();
	$window._gaq.push(['_trackPageview', currentPageId]);
	//loadDisqus(currentPageId);
	if (typeof callback == 'function') {
		callback();
	}
}

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

function DemoListCtrl($scope, $location, $window, $routeParams, $log, $filter, Demo) {
	//var $httpDefaultCache = $cacheFactory.get('$http');
	//	$log.log($httpDefaultCache.removeAll());
	//$cacheFactory.get('$http').removeAll();
	$scope.loaded = false;
	$scope.category = '';
	$scope.list = [];
	NProgress.start();

	$scope.list = Demo.query(function() {
		$scope.loaded = true;
		$scope.afterPartialLoaded();
		NProgress.done();
	});

	$scope.getRoute = function() {
		if (typeof $routeParams.category != 'undefined') {
			return  $routeParams.category;
		}
		return '';
	}

	$scope.setCategory = function(category) {
		if (category == 'all') {
			$scope.category = '';
		} else {
			$scope.category = category;
		}
	}

	$scope.isActive = function(category) {
		if (category === $scope.category || ($scope.category == '' && category === 'all')) {
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

	$scope.afterPartialLoaded = function() {
		afterLoading($location, $window);
	};

//	$scope.$on('$routeChangeStart', function(scope, next, current) {
//		console.log('Changing from ' + angular.toJson(current) + ' to ' + angular.toJson(next));
//	});
//	$scope.$on('$routeChangeSuccess', function(scope, next, current) {
//		console.log('success');
//	});
}

DemoListCtrl.$inject = ['$scope', '$location', '$window', '$routeParams', '$log', '$filter', 'Demo'];

function DemoItemCtrl($scope, $location, $window, $routeParams, Demo) {
	NProgress.start();
	Demo.get({
		demoId: $routeParams.demoId
	}, function(demo) {
		$scope.item = demo;
		$scope.afterPartialLoaded();
		NProgress.done();
	}, function(error) {
		$scope.item = {
			name: 'Oups Something wrong happened'
		};
		NProgress.done();
	});

	$scope.getFbUri = function(uri) {
		return '//www.facebook.com/plugins/like.php?href=' + encodeURIComponent('http://demos.julienrenaux.fr/#/demos/' + uri) + '&amp;width=200&amp;height=30&amp;colorscheme=light&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;send=false';
	}
	
	$scope.collapsed = function(index) {
		return (index === 0)? 'in' : '';
	}

	$scope.afterPartialLoaded = function() {
		afterLoading($location, $window, function() {
			$("#accordion").collapse();

			// Delay the first collapsible opening a bit to wait the collapse instanciation
			setTimeout(function() {
				$.smoothScroll({
					scrollTarget: '#content',
					offset: -50
				});
			}, 500);
		});
	};
}

DemoItemCtrl.$inject = ['$scope', '$location', '$window', '$routeParams', 'Demo'];
