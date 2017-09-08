/**
 * Created by 34279 on 2016/7/27.
 */
app.directive('back',['$rootScope',function($rootScope){
    'use strict';
    return {
        restrict : 'A, E',
        controller:function($scope,$attrs,$element){
            $scope.commonBack =function(){
                $rootScope.$broadcast('backButton');
            }
        },
        template:'<button class="button button-icon head-color ion-ios-arrow-left" ng-click="commonBack()"/></button>'
    }
}]).directive('onFinishRender',['$timeout', '$parse', function ($timeout, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished'); //事件通知
                    var fun = scope.$eval(attr.onFinishRender);
                    if(fun && typeof(fun)=='function'){
                        fun();  //回调函数
                    }
                });
            }
        }
    }
}]);