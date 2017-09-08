/**
 * Created by 34279 on 2016/7/27.
 */
app.controller('orderDetailCtrl',['$scope','$state','$ionicHistory','linkDatas','simplePopUp','$stateParams',
    function ($scope,$state,$ionicHistory,linkDatas,simplePopUp,$stateParams) {
        $scope.$on('backButton',function(event,data){
            $scope.back();
        });
        $scope.back = function () {
            $ionicHistory.goBack();
        };
        $scope.goMine = function() {
            $state.go('mine');
        };

        var orderId =  $stateParams.id;
        function getData() {
            var param = {
                userId:user.name,
                bizCode:'orderdetail',
                jsonStr:JSON.stringify({orderId:orderId})
            };

            linkDatas.linkAndLoading(url,param,function(data){
                $scope.data = data;
                $scope.order = JSON.parse(data.result).crmSoOrderHeaderMv;
                $scope.orders = JSON.parse(data.result).CrmSoOrderLineMvs;
                $scope.orders.sumAmountTotal=0,$scope.orders.approveAmountTotal=0,$scope.orders.orderQuantityTotal=0;
                $scope.orders.approvalQtyTotal=0,$scope.orders.totalVolumeTotal=0;
                $scope.orders.forEach(function (item) {
                    if(item.sumAmount){
                        $scope.orders.sumAmountTotal+=item.sumAmount;
                    }
                    if(item.approveAmount){
                        $scope.orders.approveAmountTotal+=item.approveAmount;
                    }
                    if(item.orderQuantity){
                        $scope.orders.orderQuantityTotal+=item.orderQuantity;
                    }
                    if(item.approvalQty){
                        $scope.orders.approvalQtyTotal+=item.approvalQty;
                    }
                    if(item.totalVolume){
                        $scope.orders.totalVolumeTotal+=item.totalVolume
                    }


                })
            },function(){});

        }
        getData();
    }]);