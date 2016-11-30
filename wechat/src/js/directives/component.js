//分期数选择
app.directive('periods', function() {
    return {
        restrict: 'EA',
        scope: "=",
        templateUrl: 'views/tem-periods.html',
        replace: true
    };
});
app.directive('getcode',['$interval','SendRecive',function($interval,SendRecive){
    return{
        restrict:'A',
        link:function(scope,ele,attr){
            $(ele).on('click',function(e){
                e.preventDefault();
                var checkArr=attr.phoneitem.split(",");
                var flag=(function(){
                    for(var i= 0,len=checkArr.length;i<len;i++){
                        if (!scope.valiForm.check(false,checkArr[i])) {
                            return false
                        }
                    }
                    return true
                }());
                if(flag){
                    var _this=$(this),time=60;scope.ckP=false;
                    scope.reSend=$interval(function(){
                        if(--time>=0){
                            _this.html(time+'秒');
                        }else{
                            $interval.cancel(scope.reSend);
                            _this.html('重新获取');
                            scope.ckP=true;
                        }
                    },1000);
                    var data={};
                    var option={
                        sendFn:attr.fn,
                        data:scope[attr.codedata],
                        beforeSend:function(){},
                        defaultRemove:1,
                        retcodeFails:function(msg,retcode){
                            SendRecive.showMsg(msg);
                            $interval.cancel(scope.reSend);
                            _this.html('重新获取');
                            scope.ckP=true;
                        },
                        ajaxError:function(xhr,text){
                            layer.closeAll();
                            layer.open({
                                content: xhr.status+':'+text+'(请刷新重试或者联系管理员)',
                                btn: ['确认']
                            });
                            $interval.cancel(scope.reSend);
                            _this.html('重新获取');
                            scope.ckP=true;
                        }
                    };
                    SendRecive.sendAjax(option);
                }

            })
        }
    }
}]);