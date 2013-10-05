var app = angular.module('democenter', ['demoFactory', 'ngRoute'])
		.config(function($routeProvider, $sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		'examples.julienrenaux.fr',
		'connect.facebook.net',
		'localhost',
		'facebook.com',
		'/template'
	]);
	$routeProvider.
			when('/demos', {
		templateUrl: 'template/demo-list.html',
		controller: DemoListCtrl
	}).
			when('/demos/:category', {
		templateUrl: 'template/demo-list.html',
		controller: DemoListCtrl
	}).
			when('/demos/:category/:demoId', {
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

app.service('DemoServices', function() {
	return new (function() {

		this.initializeCategory = function($routeParams) {
			if (typeof $routeParams.category === 'undefined') {
				return '';
			}
			else {
				return ($routeParams.category == 'all') ? '' : $routeParams.category;
			}
		};
		this.getList = function($scope, Demo, NProgress) {
			return  Demo.query(function(results) {
				$scope.loaded = true;
				$scope.afterPartialLoaded();
				var categories = {
					'all': {
						'name': 'all',
						'count': results.length,
						'href': '#demos'
					}
				};
				angular.forEach(results, function(value, key) {
					if (typeof categories[value.category] == 'undefined') {
						categories[value.category] = {
							'name': value.category,
							'count': 0,
							'href': '#demos/' + value.category
						}
					}
					categories[value.category]['count'] += 1;
				});
				$scope.categories = categories;
				NProgress.done();
			});
		}

		this.getFbUri = function(category, uri) {
			return '//www.facebook.com/plugins/like.php?href=' + encodeURIComponent('http://demos.julienrenaux.fr/#/demos/' + category + '/' + uri) + '&amp;width=200&amp;height=30&amp;colorscheme=light&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;send=false';
		}

		this.categoryIsActive = function($scope, category) {
			if (category === $scope.category || ($scope.category == '' && category === 'all')) {
				return 'active';
			}
			return '';
		}

		this.setCategory = function(category) {
			if (category == 'all') {
				return '';
			} else {
				return category;
			}
		}

		this.afterLoading = function($location, $window) {
			var currentPageId = $location.path();
			$window._gaq.push(['_trackPageview', currentPageId]);
			//loadDisqus(currentPageId);
		}
	})();
});

function DemoListCtrl($scope, $location, $window, $routeParams, $log, $filter, Demo, DemoServices) {
	NProgress.start();
	$scope.loaded = false;
	$scope.category = DemoServices.initializeCategory($routeParams);
	$scope.list = DemoServices.getList($scope, Demo, NProgress);

	$scope.getRoute = function() {
		if (typeof $routeParams.category != 'undefined') {
			return  $routeParams.category;
		}
		return '';
	}

	$scope.setCategory = function(category) {
		$scope.category = DemoServices.setCategory(category);
	}

	$scope.categoryIsActive = function(category) {
		return DemoServices.categoryIsActive($scope, category);
	}

	$scope.getFbUri = function(category, uri) {
		return DemoServices.getFbUri(category, uri);
	}

	$scope.afterPartialLoaded = function() {
		DemoServices.afterLoading($location, $window);
	};

//	$scope.$on('$routeChangeStart', function(scope, next, current) {
//		console.log('Changing from ' + angular.toJson(current) + ' to ' + angular.toJson(next));
//	});
//	$scope.$on('$routeChangeSuccess', function(scope, next, current) {
//		console.log('success');
//	});
}

DemoListCtrl.$inject = ['$scope', '$location', '$window', '$routeParams', '$log', '$filter', 'Demo', 'DemoServices'];

function DemoItemCtrl($scope, $location, $window, $routeParams, $timeout, Demo, DemoServices) {
	NProgress.start();
	$scope.loaded = false;
	$scope.category = DemoServices.initializeCategory($routeParams);
	$scope.list = DemoServices.getList($scope, Demo, NProgress);

	$scope.item = Demo.get({
		demoId: $routeParams.demoId
	}, function(demo) {
		$scope.afterPartialLoaded();
		NProgress.done();
	}, function(error) {
		$scope.item = {
			name: 'Oups Something wrong happened'
		};
		NProgress.done();
	});

	$scope.setCategory = function(category) {
		$scope.category = DemoServices.setCategory(category);
	}

	$scope.categoryIsActive = function(category) {
		return DemoServices.categoryIsActive($scope, category);
	}

	$scope.getFbUri = function(category, uri) {
		return DemoServices.getFbUri(category, uri);
	}

	$scope.collapsed = function(index) {
		return (index === 0) ? 'in' : '';
	}

	$scope.afterPartialLoaded = function() {
		DemoServices.afterLoading($location, $window);
		$timeout(function() {
			$("#accordion").collapse();
			$.smoothScroll({
				scrollTarget: '#content',
				offset: -50
			});
		}, 0);
	};
}

DemoItemCtrl.$inject = ['$scope', '$location', '$window', '$routeParams', '$timeout', 'Demo', 'DemoServices'];
