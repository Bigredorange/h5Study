/**
 * Created by Administrator on 2016/3/11 0011.
 */
//封装简单的提示效果
app.factory("simplePopUp",function($ionicPopup,$rootScope,$ionicLoading){
    var alertPopup;
    return{
        showLoading:function(msg){
            $ionicLoading.show({
                template: msg,
                duration:1000
            });
        },
        showMsg:function(msg){
            $ionicLoading.show({
                template: msg,
                duration:1000
            });
        },
        hideMsg:function(){
            $ionicLoading.hide();
        },
        showPopup:function(msg,_fun){
            alertPopup = $ionicPopup.alert({
                title: '提示',
                template:msg
            });
            alertPopup.then(_fun);
        },
        confirmPopup:function(msg,_fun,cancelFunc){
            var confirmPopup = $ionicPopup.confirm({
                title: msg,
                subTitle:'' ,
                template:" ",
                buttons: [
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: _fun
                    },{ text: '取消',
                        type: 'button-stable',
                        onTap: cancelFunc
                    }
                ]
            });
            confirmPopup.then(function(res) { });
        },
        confirmDownload:function(fileName,fileSize,_fun,cancelFunc){
            if(fileSize>1024&&fileSize<1024*1024){
                fileSize = (Number(fileSize)/1024).toFixed(2)+"MB";
            }else if(fileSize>1024*1024){
                fileSize = (Number(fileSize)/(1024*1024)).toFixed(2)+"GB";
            }else{
                fileSize = fileSize+"KB";
            }

            var confirmPopup = $ionicPopup.confirm({
                title: '',
                subTitle: "是否下载附件？",
                template:"文件名："+fileName+"<br>大小："+fileSize,
                buttons: [
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: _fun
                    },{ text: '取消',
                        type: 'button-stable',
                        onTap: cancelFunc
                    }
                ]
            });
            confirmPopup.then(function(res) { });
        },
        confirmPopupShowMsg:function(title,msg,_fun,cancelFunc){
            var confirmPopup = $ionicPopup.confirm({
                title: '',
                subTitle: title,
                template:"<div class='confirm-option-div'><span class='confirm-option-span'>意见：</span>"+msg+"</div>",
                buttons: [
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: _fun
                    },{ text: '取消',
                        type: 'button-stable',
                        onTap: cancelFunc
                    }
                ]
            });
            confirmPopup.then(function(res) { });
        },
        inputPopup:function(msg,_fun,cancelFunc,placeholder){
            $rootScope.popupdata = {inputval:""};
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="popupdata.inputval" placeholder="'+placeholder+'">' +
                '<a class="icon ion-close-circled button-stable button-small" ng-click="popupdata.inputval=\'\'"></a>',
                title: '',
                subTitle:msg,
                buttons: [
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if($rootScope.popupdata.inputval==""&&placeholder!=""){
                                e.preventDefault();
                            }else{
                                _fun($rootScope.popupdata.inputval);
                            }
                        }
                    },
                    { text: '取消',
                        type: 'button-stable',
                        onTap:cancelFunc
                    }
                ]
            });
            myPopup.then(function(res) { });
        },
        areaPopup:function(msg,val,_fun,cancelFunc,placeholder){
            $rootScope.popupdata = {areaval:val};
            var myPopup = $ionicPopup.show({
                template: '<textarea ng-model="popupdata.areaval"></textarea>',
                title: '',
                subTitle:msg,
                buttons: [
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if($rootScope.popupdata.areaval==""&&placeholder!=""){
                                //e.preventDefault();
                                _fun($rootScope.popupdata.areaval);
                            }else{
                                _fun($rootScope.popupdata.areaval);
                            }
                        }
                    },
                    { text: '取消',
                        type: 'button-stable',
                        onTap:cancelFunc
                    }
                ]
            });
            myPopup.then(function(res) { });
        }
    }

});
//封装重复的数据访问格式
app.factory("linkDatas",function($http,simplePopUp,$ionicLoading){
    return {
        getKeyAndForm: function (param,successFunc,errorFunc) {
            var linkUrl = vivo_url + getBPMdetail_url;
            //param.url=service_url;
            param.userName=userName;
            param.documentId=hrefdocumentId;
            $ionicLoading.show({template: 'Loading...'});
            $http.post(linkUrl,param
            ).success(
                function(data){
                    $ionicLoading.hide();
                    if(data.exception){
                        $ionicLoading.show({
                            duration: 1500,
                            noBackdrop: true,
                            template:"连接网络失败"

                        });
                        if(errorFunc){
                            errorFunc("连接网络失败");
                        }
                    }else{
                        if(data.key){
                            key = data.key;
                            try{
                                var ret = eval("("+data.ret+")");
                                if(ret.errorCode=="0"){
                                    //格式化form
                                    var result=ret.Data;
                                    var item = eval("("+result+")"),newitem={},files =ret.Files==""?[]:eval("("+ret.Files+")");
                                    if(item.Datas.length>0){
                                        newitem = item.Datas[0];
                                    }
                                    newitem.typeName = document.title;
                                    newitem.files = files;

                                    //格式化审批记录
                                    var retLog = eval("("+data.retLog.replace("Start","拟制")+")");
                                    if(retLog.errorCode=="0"){
                                        newitem.approvalRecord = retLog.Data;
                                    }else{
                                        $ionicLoading.show({
                                            duration: 1500,
                                            noBackdrop: true,
                                            template:retLog.errorContent

                                        });
                                        if(errorFunc){
                                            errorFunc(ret.errorContent);
                                        }
                                        return;
                                    }
                                    //格式化行表
                                    if(data.retList){
                                        var retList = eval("("+data.retList+")");
                                        if(retList.errorCode=="0"){
                                            newitem.lineList = retList.Data;
                                        }else{
                                            $ionicLoading.show({
                                                duration: 1500,
                                                noBackdrop: true,
                                                template:retLog.errorContent

                                            });
                                            if(errorFunc){
                                                errorFunc(ret.errorContent);
                                            }
                                            return;
                                        }
                                    }

                                    if(successFunc){
                                        successFunc(newitem);
                                    }
                                }else{
                                    $ionicLoading.show({
                                        duration: 1500,
                                        noBackdrop: true,
                                        template:ret.errorContent

                                    });
                                    if(errorFunc){
                                        errorFunc(ret.errorContent);
                                    }
                                }
                            }catch (e){
                                simplePopUp.showPopup("数据异常！",function(){
                                    if(errorFunc){
                                        errorFunc(data.ret);
                                    }
                                });

                            }

                        }else{
                            simplePopUp.showPopup("数据异常！",function(){
                                if(errorFunc){
                                    errorFunc(data.ret);
                                }
                            });
                        }

                    }


                }
            ).error(function(e){
                $ionicLoading.show({
                    duration: 1500,
                    noBackdrop: true,
                    template: "连接网络失败"

                });
                if(errorFunc){
                    errorFunc("连接网络失败");
                }
            });
        },
        linkAndLoading: function (url,param,successFunc,errorFunc) {
            $ionicLoading.show({template: 'Loading...'});
            $http.post(url,param
            ).success(
                function(data){
                    $ionicLoading.hide();
                    data.ret = data;
                    if(data.exception||data.ret==""){
                        $ionicLoading.show({
                            duration: 1500,
                            noBackdrop: true,
                            template:"服务器异常"

                        });
                        if(errorFunc){
                            errorFunc("服务器异常");
                        }
                    }else{
                        var ret = data.wbResponse;
                        if(ret.errCode=="S"){
                            if(successFunc){
                                successFunc(ret);
                            }
                        }else{
                            $ionicLoading.show({
                                duration: 1500,
                                noBackdrop: true,
                                template:ret.errorContent

                            });
                            if(errorFunc){
                                errorFunc(ret.errorContent);
                            }
                        }
                    }


                }
            ).error(function(e){
                $ionicLoading.show({
                    duration: 1500,
                    noBackdrop: true,
                    template: "连接网络失败"

                });
                if(errorFunc){
                    errorFunc("连接网络失败");
                }
            });
        },
        linkNoLoading: function (url,param,successFunc,errorFunc) {
            $http.post(url,param
            ).success(
                function(data){
                    if(data.exception||data.ret==""){
                        $ionicLoading.show({
                            duration: 1500,
                            noBackdrop: true,
                            template:"服务器异常"

                        });
                        if(errorFunc){
                            errorFunc("服务器异常");
                        }
                    }else {
                        var ret = eval("("+data.ret+")");
                        if(ret.errorCode=="0"){
                            if(successFunc){
                                successFunc(ret);
                            }
                        }else{
                            $ionicLoading.show({
                                duration: 1500,
                                noBackdrop: true,
                                template:ret.errorContent

                            });
                            if(errorFunc){
                                errorFunc(ret.errorContent);
                            }
                        }
                    }
                }
            ).error(function(e){
                $ionicLoading.show({
                    duration: 1500,
                    noBackdrop: true,
                    template: "连接网络失败"

                });
                if(errorFunc){
                    errorFunc("连接网络失败");
                }
            });
        },
        /*linkAndLoading1: function (url,param,successFunc,errorFunc) {
            $ionicLoading.show({template: 'Loading...'});
            $http.post(url,param
            ).success(
                function(data){
                    $ionicLoading.hide();
                    if(data.exception||data.ret==""){
                        $ionicLoading.show({
                            duration: 1500,
                            noBackdrop: true,
                            template:"服务器异常"

                        });
                        if(errorFunc){
                            errorFunc("服务器异常");
                        }
                    }else{
                        var ret = data ;
                        if(ret){
                            if(successFunc){
                                successFunc(ret);
                            }
                        }else{
                            $ionicLoading.show({
                                duration: 1500,
                                noBackdrop: true,
                                template:ret

                            });
                            if(errorFunc){
                                errorFunc(ret);
                            }
                        }
                    }


                }
            ).error(function(e){
                $ionicLoading.show({
                    duration: 1500,
                    noBackdrop: true,
                    template: "连接网络失败"

                });
                if(errorFunc){
                    errorFunc("连接网络失败");
                }
            });
        }*/
    }
});