/**
 * Created by Administrator on 2015/6/19.
 */
app.config(function($stateProvider,$urlRouterProvider,$ionicConfigProvider){
    //$ionicConfigProvider.scrolling.jsScrolling(true);
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');
    $stateProvider.state('orderQuery',{
        url:'/orderQuery',
        templateUrl:'page/templates/orderQuery.html',
        controller:'orderQueryCtrl'
    }).state('orderDetail',{
        url:'/orderDetail?id',
        templateUrl:'page/templates/orderDetail.html',
        controller:'orderDetailCtrl'
    });

    $urlRouterProvider.otherwise('orderQuery');
});