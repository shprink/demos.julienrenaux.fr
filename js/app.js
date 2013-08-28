angular.module('democenter', ['demoFactory', 'ngRoute'])
		.config(function($routeProvider) {
	$routeProvider.
			when('/demos', {templateUrl: 'template/demo-list.html', controller: DemoListCtrl}).
			when('/demos/:demoId', {templateUrl: 'template/demo-item.html', controller: DemoItemCtrl}).
			otherwise({redirectTo: '/demos'});
});

angular.module('demoFactory', ['ngResource'])
		.factory('Demo', function($resource) {
	return $resource('data/:demoId.json', {}, {
		query: {method: 'GET', params: {demoId: 'demos'}, isArray: true}
	});
});

function DemoListCtrl($scope, Demo) {
	$scope.list = Demo.query()
}

function DemoItemCtrl($scope, Demo, $routeParams) {
	Demo.get({
		demoId: $routeParams.demoId
	}, function(demo) {
		$scope.item = demo;
	}, function(error) {
		$scope.item = {name: 'Oups Something wrong happened'};
	});
}