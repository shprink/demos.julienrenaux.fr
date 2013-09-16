angular.module('democenter', ['demoFactory', 'ngRoute'])
		.config(function($routeProvider, $sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		'examples.julienrenaux.fr',
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
	
	$scope.list = Demo.query();
	
	$scope.getRoute = function(){
		if (typeof $routeParams.category != 'undefined'){
			return  $routeParams.category;
		}
		return '';
	}

	$scope.isActive = function(category){
		$log.log(category);
		if (category === $scope.getRoute){
			return 'active';
		}
		return '';
	}
	
	$scope.getCategories = function(){
		var categories = {};
		angular.forEach($scope.list, function(value, key){
			if (typeof categories[value.category] == 'undefined'){
				categories[value.category] = {
					'name' : value.category,
					'count' : 0
				}
			}
			categories[value.category]['count']  += 1;
		});
		return categories
	}

	$scope.$on('$routeChangeStart', function(scope, next, current) {
		console.log('Changing from ' + angular.toJson(current) + ' to ' + angular.toJson(next));
	});
	$scope.$on('$routeChangeSuccess', function(scope, next, current) {
		console.log('success');
	});
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
