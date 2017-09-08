/**
 * Created by Administrator on 2015/6/19.
 */

var app =angular.module('ionicApp', ['ionic']);

function loadTheApp() {
// Hide splash screen if any
    try {
        angular.bootstrap(document, ['ionicApp']);
    } catch (e) {
        console.log(e);
    }
   /* if (navigator && navigator.splashscreen) {
        navigator.splashscreen.hide();
    }*/
    /*try{
        cordova.exec(function(data) {
            var tempdata =JSON.parse(data);
            setTimeout(function(){
                user.userId =tempdata.userId;
                user.tel =tempdata.telNo;
                user.name =tempdata.userName;
                user.userCode =tempdata.userCode;
                // Boot AngularJS
                try {
                    angular.bootstrap(document, ['ionicApp']);
                } catch (e) {
                    console.log('errrrrrrrrrrrrrr! ' + e);
                }
            },50)

        }, function(e) {
            if(e){
                alert(e);
            }else{
                alert("获取用户信息失败");
            }
        }, "UsersInfo","getUsersInfo",[]);
    }catch (e){}*/
}
function initScroll() {
    var myScroll;
    myScroll = new IScroll('#wrapper', {
        scrollX: true,
        scrollY: true,
        momentum: false,
        snap: true
    });
}

// Listen to device ready
angular.element(document).ready(function() {
    // initScroll();
    //alert(1);
    if (window.cordova) {
        //alert(1)
        document.addEventListener('deviceready', loadTheApp, false);
        if (window.StatusBar) {
            //StatusBar.styleDefault();
            StatusBar.overlaysWebView(true)
        }
    } else {
        //user.userId ="1";
        //user.tel ="12343545";
        //user.name ="测试";
        //user.userCode ="test";
        try {
            angular.bootstrap(document, ['ionicApp']);
        } catch (e) {
            console.log('error! ' + e);
        }
    }
});


app.config(function($ionicConfigProvider) {
    $ionicConfigProvider.views.swipeBackEnabled(false);
});
app.run(['$rootScope', function ($rootScope) {
    document.addEventListener("backbutton", onBackKeyDown, false);
    function onBackKeyDown(){
        $rootScope.$broadcast('backButton');
    }
}]);

