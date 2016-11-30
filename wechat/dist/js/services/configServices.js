var app=angular.module('app',['ui.router']);
app.factory('SendRecive',['$rootScope','$stateParams',function($rootScope,$stateParams){
    return{
        /**后台服务器地址*/
        //sercives:'http://192.168.1.4:8089/creditsys/wap/',
        sercives:'http://www.1v1.one:8089/creditsys/wap/',
        //sercives:'http://192.168.26.13/creditsys/wap/',
        //sercives:'http://192.168.26.4/creditsys/wap/',
        //sercives:'json',
        // sercives:'http://1.93.129.124:8299/creditsys/wap/',
        /**前端项目路径地址*/
        myLocal:'http://www.1v1.one:8089/ymj/#/',
        /**
         *
         * @number str 需要转换为对象的字符串
         * 字符串的格式类似ifn=register&organid=16 key与value之间用=分隔 key与key间用&分开
         * @returns 返回一个json对象
         */
        strToObj:function (str){
            str=str.replace(/\+/g," ");
            str=decodeURIComponent(str);
            str = str.replace(/&/g,'","');
            str = str.replace(/=/g,'":"');
            str = '{"'+str +'"}';
            return JSON.parse(str);
        },
        /**
         * @number from 对接系统
         * @object data  需要传送过去的json对象，注意上下顺序要与接口文档里面的顺序对应
         * @boolean [deCodeStr] 可选参数 是否需要进行decodeURL解码的字段
         * @returns 返回一个需要传到后台的json对象
         * 例如用户注册接口：getSendData('register',16,data)
         * 方法的功能返回一个按照接口文档里面定义的数据对象
         */
        getSendData:function(data,deCodeStr,defaultRemove){
            if(defaultRemove==0){
                sendData=data;
            }else{
                sendData={};
                sendData.from='yesmywine';
                sendData.dockMark='YESMYWINE';
                sendData.orgId='99990002';
                if($stateParams.accountNo&&defaultRemove!=1){
                    sendData.accountNo=$stateParams.accountNo;
                }
            }

            $.extend(sendData,data);
            for(var i in sendData){
                sendData[i]=$.trim(sendData[i]);
            }
            if(!deCodeStr){
                sendData.signature=this.objToMd5(sendData);
            }else{
                sendData.signature=this.objToMd5(sendData,deCodeStr);
            }
            return sendData;
        },
        /**
         *
         * @object obj 需要进行MD5加密的对象
         * @boolean [deCodeStr] 可选参数 需要进行decodeURL解码的字段
         * @returns 返回一个MD5加密好的字符串
         */
        objToMd5:function(obj,deCodeStr){
            var str='',sortArr=[];
            for(var i in obj){
                if(obj.hasOwnProperty(i)){
                    sortArr.push(i);
                }
            }
            sortArr.sort();
            for(var j= 0,length=sortArr.length;j<length;j++){
                if(deCodeStr){
                    str+=decodeURIComponent(obj[sortArr[j]]);
                }else{
                    str+=obj[sortArr[j]];
                }
            }
            return $.md5($.trim(str));
        },
        /**
         *
         * @object option 一个对象，包含4个属性
         * compareData表示从后台接受过来的数据，
         * retcodeSuccess表示后台返回成功后的的回调方法，
         * retcodeFails表示后台返回失败的回调方法，
         * md5Error表示MD5验证失败后的回调方法
         *
         */
        returnCompare:function (option){
            var _this=this;
            var defaul={
                compareData:null,
                retcodeSuccess:function(){},
                retcodeFails:function(){},
                md5Error:_this.md5Error
            };
            var option=$.extend(defaul,option);
            if(typeof option.compareData =='string'){
                option.compareData=JSON.parse(option.compareData);
            }
            if($.md5(option.compareData[0])==option.compareData[1]){
                var headData=JSON.parse(option.compareData[0]).head;
                var bodyData=JSON.parse(option.compareData[0]).body;
                if(headData.retcode=='success'){
                    if(typeof option.retcodeSuccess=="function")option.retcodeSuccess(bodyData,headData.msg);
                }else{
                    if(typeof option.retcodeFails=="function")option.retcodeFails(headData.msg,headData.errcode,headData.retcode);
                }
            }else{
                if(typeof option.md5Error=="function")option.md5Error();
            }
        },
        repayPlanCompare:function (option){
            var _this = this;
            var defaul = {
                compareData: null,
                retcodeSuccess: function() {},
                retcodeFails: function() {},
                md5Error: _this.md5Error
            };
            var option = $.extend(defaul, option);
            if (typeof option.compareData == 'string') {
                option.compareData = JSON.parse(option.compareData);
            }
            if ($.md5(option.compareData[0]) == option.compareData[1]) {
                var data = JSON.parse(option.compareData[0]);
                if (data.retcode == 'success') {
                    if (typeof option.retcodeSuccess == "function") option.retcodeSuccess(data.msg, option.compareData);
                } else {
                    if (typeof option.retcodeFails == "function") option.retcodeFails(data.msg, option.compareData);
                }
            } else {
                if (typeof option.md5Error == "function") option.md5Error();
            }
        },
        md5Error:function(){
            layer.open({
                content: 'MD5数据验证失败,请重新请求或者联系客服',
                btn: ['确认']
            });
        },
        showMsg:function(msg){
            layer.open({
                content: msg,
                skin: 'msg',
                anim:'scale',
                time: 3 //3秒后自动关闭
            });
        },
        showFromMsg:function(msg,o){
            if(o.type==3){
                layer.open({
                    content: msg,
                    skin: 'msg',
                    anim:'scale',
                    time: 3 //3秒后自动关闭
                });
            }
        },
        retcodeFails:function(msg,errcode,retcode){
            layer.open({
                content: msg,
                skin: 'msg',
                anim:'scale',
                time: 3 //3秒后自动关闭
            });
            //layer.open({
            //    content: msg,
            //    btn: ['确认']
            //});
        },
        /**
         *
         * @object option 一个对象，包含4个属性
         * compareData表示从后台接受过来的数据，
         * retcodeSuccess表示后台返回成功后的的回调方法，
         * retcodeFails表示后台返回失败的回调方法，
         * md5Error表示MD5验证失败后的回调方法,
         * organid:商户id，
         * data：要发送的数据,
         * deCodeStr 是否需要进行decodeURL解码的字段,
         * ajaxError ajax erro方法,
         * sendFn 后台接口方法
         */
        sendAjax:function(option){
            var _this=this;
            var defaul={
                organid:$rootScope.organid,
                deCodeStr:false,
                repayPlanCompare:false,
                data:{},
                sendFn:'',
                beforeSend:function(){
                    _this.layerIndex=layer.open({
                        type: 2,
                        shadeClose:false
                    });
                },
                retcodeSuccess:function(){},
                retcodeFails:_this.retcodeFails,
                complete:function(){},
                md5Error:_this.md5Error,
                ajaxError:function(xhr,text){
                    layer.close(_this.layerIndex);
                    //layer.closeAll();
                    layer.open({
                        //content: xhr.status+':'+text+'(请刷新重试或者联系管理员)',
                        content: '请刷新重试或者联系管理员',
                        btn: ['确认']
                    });
                }
            };
            var option= $.extend(defaul,option);
            $.ajax({
                type:'post',
                url:_this.sercives+option.sendFn,
                data:this.getSendData(option.data,option.deCodeStr,option.defaultRemove),
                beforeSend:option.beforeSend(),
                success:function(data){
                    //layer.closeAll();
                    layer.close(_this.layerIndex);
                    if(!option.repayPlanCompare){
                        _this.returnCompare({
                            compareData:data,
                            retcodeSuccess:option.retcodeSuccess,
                            retcodeFails:option.retcodeFails,
                            md5Error:option.md5Error
                        })
                    }else{
                        _this.repayPlanCompare({
                            compareData:data,
                            retcodeSuccess:option.retcodeSuccess,
                            retcodeFails:option.retcodeFails,
                            md5Error:option.md5Error
                        })
                    }

                },
                error:option.ajaxError,
                complete:option.complete
            })
        }
    }
}]);
app.factory('Credit',['SendRecive',function(SendRecive){
    return {
        pay: function (api,option,flag,index) {
            if(flag){
                option=SendRecive.getSendData(option,false,1)
            }
            var payFor=$('<form class="payFor" method="post"></form>');
            payFor.prop('action',SendRecive.sercives+api);
            for(var i in option){
                var item=$('<input type="hidden"/>');
                item.attr('name',i).val(option[i]);
                item.appendTo(payFor);
            }
            payFor.appendTo('body').submit().remove();
            if(index||index==0){
                try{
                    layer.close(index)
                }catch (e){}
            }
        }
    }
}]);
app.factory('ValueCache',[function(){
    return{
        getSessionItem:function(key){
            try{
                return JSON.parse(sessionStorage.getItem(key))||false;
            }catch (e){

            }
        },
        setSessionItem:function(key,value){
            try{
                sessionStorage.setItem(key,JSON.stringify(value));
            }catch (e){

            }
        }
    }
}]);
app.factory('PlanStatus',[function(){
    return{
        '0':{
            statusText:'未付款',
        },
        '1':{
            statusText:'已付款',
        },
        '2':{
            statusText:'部分还款',
        },
        '3':{
            statusText:'还完本金',
        }
    }
}]);
app.factory('TipInfo',[function(){
    return{
        '0':{
            title:'分期成功',
            btnText:'完成'
        },
        '1':{
            title:'分期失败',
            btnText:'重新支付'
        },
        '2':{
            title:'还款成功',
            btnText:'确定'
        },
        '3':{
            title:'激活成功',
            btnText:'继续支付'
        },
        '4':{
            title:'激活成功',
            btnText:'查看我的账单'
        }
    }
}]);