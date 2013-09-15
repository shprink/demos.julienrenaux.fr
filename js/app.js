angular.module('democenter', ['demoFactory', 'ngRoute'])
		.config(function($routeProvider, $sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		'examples.julienrenaux.fr',
		'/template'
	]);
	$routeProvider.
			when('/demos', {templateUrl: 'template/demo-list.html', controller: DemoListCtrl}).
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

// http://jsfiddle.net/moderndegree/yYEXN/
//angular.module('demoCache', []).
//		factory('DemoCache', function($cacheFactory) {
//	return $cacheFactory('someCache', {
//		capacity: 3
//	});
//});

function DemoListCtrl($scope, $cacheFactory, $log, $http, Demo) {
	var $httpDefaultCache = $cacheFactory.get('$http');
	$log.log($httpDefaultCache.removeAll());
	//$cacheFactory.get('$http').removeAll();
	$scope.list = Demo.query();

	$scope.$on('$routeChangeStart', function(scope, next, current) {
		console.log('Changing from ' + angular.toJson(current) + ' to ' + angular.toJson(next));
	});
	$scope.$on('$routeChangeSuccess', function(scope, next, current) {
		console.log('success');
	});
}

DemoListCtrl.$inject = ['$scope', '$cacheFactory', '$log', '$http', 'Demo'];

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
