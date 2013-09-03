angular.module('democenter', ['demoFactory', 'ngRoute'])
	.config(function($routeProvider) {
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
				isArray: true
			}
		});
	});

function DemoListCtrl($scope, Demo) {
	$scope.$on('$routeChangeStart', function(scope, next, current){
		console.log('Changing from '+angular.toJson(current)+' to '+angular.toJson(next));
	});
	$scope.$on('$routeChangeSuccess', function(scope, next, current){
		console.log('success');
	})
	$scope.list = Demo.query()
}

function DemoItemCtrl($scope, Demo, $routeParams) {
	$scope.$on('$routeChangeStart', function(scope, next, current){
		console.log('Changing from '+angular.toJson(current)+' to '+angular.toJson(next));
	});
	$scope.$on('$routeChangeSuccess', function(scope, next, current){
		console.log('success');
	});
	Demo.get({
		demoId: $routeParams.demoId
	}, function(demo) {
		$scope.item = demo;
	}, function(error) {
		$scope.item = {
			name: 'Oups Something wrong happened'
		};
	});
}