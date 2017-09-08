/**
 * Created by 34279 on 2016/7/27.
 */
app.controller('orderQueryCtrl',['$scope','$state','$ionicHistory','linkDatas','simplePopUp','$ionicPopover',
function ($scope,$state,$ionicHistory,linkDatas,simplePopUp,$ionicPopover) {
    $scope.goOrderDetail = function (index) {
        var orderId =  $scope.orders[index].orderId;
        $state.go('orderDetail',{id:orderId});

    };


    $scope.$on('backButton',function(event,data){
        simplePopUp.confirmPopup('是否退出应用',function(){
            $scope.close();
        },function(){});
    });
    $scope.back = function () {
        simplePopUp.confirmPopup('是否退出应用',function(){
            $scope.close();
        },function(){});
    };
    //退出
    $scope.close = function(){
        var params = "";

        cordova.exec(function(msg) {
        }, function(e) {
        }, "Activity", "closeApp", [ params ]);
    };


    //获取账套和订单状态类别
    function getData() {
        var param = {
            userId:user.name,
            bizCode:'soblist',
            jsonStr:''
        };
        var paramOrder = {
            userId:user.name,
            bizCode:'dict',
            jsonStr:JSON.stringify({dictTypeId:'so_order_status'})
        };
        var paramSaleT = {
            userId:user.name,
            bizCode:'dict',
            jsonStr:JSON.stringify({dictTypeId:'sales_type'})
        };
        linkDatas.linkAndLoading(url,param,function(data){
            $scope.data = data;
            $scope.popoverItems = JSON.parse(data.result).sobs;
            linkDatas.linkAndLoading(url,paramOrder,function(data){
                $scope.data = data;
                $scope.orderStates = JSON.parse(data.result).eosDictEntryVls
            },function(){});
            linkDatas.linkAndLoading(url,paramSaleT,function(data){
                $scope.data = data;
                $scope.saleTypes = JSON.parse(data.result).eosDictEntryVls
            },function(){});
        },function(){});

    }
    $scope.orders = [];
    $scope.inputVal = {orderNum:'',customerName:''};
    //获取订单列表
    $scope.getOrders = function(index) {
        if($scope.orgId){
            var pramO = {
                orderNum:$scope.inputVal.orderNum,
                customerName:$scope.inputVal.customerName,
                orgId:$scope.orgId,
                orderDate1:$scope.startDate,
                orderDate2:$scope.endDate,
                salesType:$scope.selectOrderItem.saleTypeId,
                orderTypeId:$scope.selectOrderItem.orderTypeId,
                status:$scope.selectOrderItem.status,
                pageIndex:index,
                pageSize:20
            };
            var paramOrder = {

                userId:user.name,
                bizCode:'orderlist',
                jsonStr:JSON.stringify(pramO)
            };
            linkDatas.linkAndLoading(url,paramOrder,function(data){
                $scope.data = data;
                var tempOrders = JSON.parse(data.result).dataobjs;
                if(index){
                    $scope.orders = $scope.orders.concat(tempOrders);
                    $scope.isLast = JSON.parse(data.result).page.isLast;
                    $scope.index++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                else {
                    $scope.orders = tempOrders;
                }

                $scope.isFirst = true;
            },function(){});
        }
        else {
            simplePopUp.showMsg('请先选择账套！');
        }

    };
    function getOrderType() {
            var paramOrderT = {
                userId:user.name,
                bizCode:'orderTypeList',
                jsonStr:JSON.stringify({orgId:$scope.orgId})
            };
            linkDatas.linkAndLoading(url,paramOrderT,function(data){
                $scope.data = data;
                $scope.orderTypes = JSON.parse(data.result).dataobjs;
                $scope
            },function(){});
    }

    getData();

    $ionicPopover.fromTemplateUrl('templates/myPopover.html',{scope:$scope}).then(function(popover){
        $scope.popover = popover;
    });
    $ionicPopover.fromTemplateUrl('templates/myPopover1.html',{scope:$scope}).then(function(popover){
        $scope.popover1 = popover;
    });
    $scope.openPopover = function($event){
        $scope.popover.show($event);
    };
    $scope.closePopover = function($event){
        $scope.popover.hide();
    };
    $scope.openPopover1 = function($event){
        if($scope.orgId){
            getOrderType();
            $scope.popover1.show($event);
        }
        else {
            simplePopUp.showMsg('请先选择账套！');
        }

    };
    $scope.closePopover1 = function($event){
        $scope.popover1.hide();
    };

    $scope.selectItem = function (index) {
        $scope.closePopover();
        $scope.sob =  $scope.popoverItems[index].orgName;
        $scope.orgId = $scope.popoverItems[index].orgId;
    };

    $scope.selectItem1 = function (index) {
        $scope.closePopover1();
        $scope.orderTypeSelect =  $scope.orderTypes[index].orderTypeName;
        $scope.selectOrderItem.orderTypeId = $scope.orderTypes[index].orderTypeId;
    };

    $scope.selectOrderItem = {orderState:'',saleType:'',status:'',orderTypeId:'',saleTypeId:''};

    $scope.selectSaleType = function () {
        var index=0;
        $scope.saleTypes.forEach(function (item,i) {
           if(item.DICTNAME==$scope.selectOrderItem.orderType) {
               index = i
           }
        });
        $scope.selectOrderItem.saleType = $scope.saleTypes[index].DICTNAME;
        $scope.selectOrderItem.saleTypeId = $scope.saleTypes[index].DICTID;
    };
    $scope.selectOrderState = function () {
        var index=0;
        $scope.orderStates.forEach(function (item,i) {
            if(item.DICTNAME==$scope.selectOrderItem.orderState) {
                index = i
            }
        });
        $scope.selectOrderItem.orderState = $scope.orderStates[index].DICTNAME;
        $scope.selectOrderItem.status = $scope.orderStates[index].DICTID;
    };

    $scope.startDate = '',$scope.endDate = '';
    $scope.selectDay = function(i) {

        //可以不传 params会有默认标题
/*        var params = {
            "title" : "选择时间[标题]",
            "message" : "拨动选择时间[信息]"
        };*/

        cordova.exec(function(msg) {
            if(i==1){
                $scope.startDate = msg;
                $scope.$apply(function () {
                    $scope.startDate = msg;
                });
                // alert('start '+$scope.startDate);
            }
            else {
                $scope.endDate = msg;
                // alert('end '+$scope.endDate);
                $scope.$apply(function () {
                    $scope.endDate = msg;
                });
            }
            // alert(msg);
        }, function(e) {
            alert("Error: " + e);
        }, "DateInfo", "selectDay");

    };
    $scope.deleteDate = function (date) {
        if(date=='start'){
            $scope.startDate = '';
        }
        else if(date=='type'){
            $scope.orderTypeSelect = '';
        }
        else{
            $scope.endDate = '';
        }



    };
    $scope.isFirst = false;
    $scope.index = 1;//页签
    $scope.hasMore = true;
    $scope.loadMore = function () {
        if(!$scope.isLast){
            $scope.getOrders($scope.index);
        }
        else {
            $scope.hasMore = false;
            // simplePopUp.showMsg('没有更多数据了');
        }

    };
}]);