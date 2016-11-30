;(function(win,newName){

	var config = {
        defaultClass:'bombBox',//默认容器样式
        /*
        * 0:toast提示
        * 1:loading 提示
        * */ 
        type: 0 , //提示种类
        shade: true ,//是否显示遮罩
        shadeColor:'rgba(0,0,0,0.7)',//遮罩颜色
        shadeClose: true ,//点击遮罩关闭弹框
        contentShade:false,//是否显示内容背景
        contentShadeColor:'rgba(0,0,0,0.7)',//内容背景颜色
        animate: '' ,//提示动画class 默认为空 (可设为'bouncein/scale/opacity')
        time: 0 ,//延迟关闭弹窗时间,
        loadType: 0,//load效果种类(默认有6种,7为登录成功，8为登录失败),
        msg:'',//弹框显示文字信息,
        header:'',//在msg上面显示的内容,
        footer:'',//在msg下面显示的内容,
        top:'',  //弹框定位距离上面的位置,
        left:'', //弹框定位距离左边的位置,
        btn:'', //按钮
        yes:'' , //点击确定按钮的回调函数,如： yes:function(){}
        end: '', //弹框层彻底销毁的回调函数,如： end:function(){}
    };

    //loadType loding效果种类
    var loadType = {
    	0:'<div class="spinner5"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>',
        1:'<div class="spinner1"></div>',
        2:'<div class="spinner2"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>',
        3:'<div class="spinner3"><div class="dot1"></div><div class="dot2"></div></div>',
        4:'<div class="spinner4"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
        5:'<div class="spinner0"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
        6:'<div class="circle"><div class="iconfont icon-roundcheck"></div></div>',
        7:'<div class="circle"><div class="iconfont icon-shibai"></div></div>',
	}

	function bombBox(options,index){
        var $this=this;
        $this.config=$.extend({},config,options);
        $this.index=index;
        $this.init();
    };

	//初始化弹框
    bombBox.prototype.init = function(){
    	var $this = this;
    	var closeTime = this.config.time;

    	$this.bombBoxDom=$('<div class='+$this.config.defaultClass+'></div>');
    	$this.boxShade = $('<div class="m-box-shade"></div>');
    	$this.boxSection = $('<div class="m-box-section"></div>');

    	$this.getContent(this.config.type);
    	
    	$this.boxSection.append($this.contentDom)
		$this.bombBoxDom.append($this.boxShade);
    	$this.bombBoxDom.append($this.boxSection);
    	$("body").append($this.bombBoxDom);

    	
		$this.config.shade && $this.boxShade.css({'backgroundColor':$this.config.shadeColor});
        $this.config.contentShade && $this.contentDom.css({'backgroundColor':$this.config.contentShadeColor,'top':$this.config.top,'left':$this.config.left});

    	//关闭动画的时间
    	if(closeTime>0){
            $this.timeOut=setTimeout(function(){
               bomb.close($this.index);
            },closeTime)
        }

        //添加btn按钮
        $this.btnDom= $this.config.btn? $('<p class="content-btn">'+$this.config.btn+'</p>'):"";
        if($this.btnDom){
        	$this.btnDom.appendTo($this.contentDom);
        }
       
        var type= this.config.type;

        //yes的回调函数
        var sureBtn= function(){
        	if(type == 0){
        		if($this.config.yes){
					$this.config.yes($this.index)
        		}else{
        			bomb.close($this.index);
        		}
        	}
        }

       	//end的回调函数.
       	var endBtn= function(){      		
   			if($this.config.end){
   				$this.config.end($this.index);
       		}
       	}

        //btn按钮的点击
        if($this.config.btn){
        	$this.btnDom.on('touched click',function(){
        		sureBtn();
        	})
        }

        //如果shadeClose为true,点击关闭bombBox
        if($this.config.shadeClose){
            $this.bombBoxDom.on('touched click',function(){
                bomb.close($this.index);
                endBtn();
            });
            $this.contentDom.on('touched click',function(e){
                e.stopPropagation();
            })
        }
    }

	//弹框内容的生成
	bombBox.prototype.getContent = function(type){
		var $this = this;
        var header=$this.config.header?'<header class="content-remain">'+$this.config.header+'</header>':'',
    		footer=$this.config.footer?'<footer class=" content-remain">'+$this.config.footer+'</footer>':'';
    	switch(type){
    		case 0:
    			$this.contentDom= $('<div class="m-box-content '+ $this.config.animate +' "></div>');
                $this.contentDom.append(header+'<p class="content-text content-remain">'+$this.config.msg+'</p>'+footer);
                break;
            case 1:
            	$this.contentDom= $('<div class="m-box-child '+ $this.config.animate +'" style="top:'+ $this.config.top + '; left:'+ $this.config.left + ' ; " ></div>');
                $this.contentDom.append(header+loadType[$this.config.loadType]+footer);
                break;
            default: 
                break; 
    	}
	}

	//弹框内容的删除
	bombBox.prototype.remove=function(){
        var $this=this;
        if($this.timeOut) clearTimeout($this.timeOut);
        $this.bombBoxDom.off();
        $this.contentDom.off();
        $this.bombBoxDom.remove();
    };

    var bomb = {
    	currentIndex:0,//弹窗个数，标记每个新建弹窗 通过domArr定位将其删除
        domArr:{},//用来存放生成的弹框元素
        open: function (options) {
            this.domArr[this.currentIndex]= new bombBox(options || {},this.currentIndex);
            return this.currentIndex++;
        },
        msg: function(msg,top,left){
            this.domArr[this.currentIndex]= new bombBox({
                shade: false ,
                shadeClose: false,
                contentShade: true,     
                animate: 'bouncein',
                time: 2500,
                msg:msg,
                top:top,
                left:left,
            },this.currentIndex);
            return this.currentIndex++;
        },
        close: function(index){  
            this.domArr[index].remove();
            this.domArr[index]=null;
            delete this.domArr[index];
        },
        closeAll: function(){
            var $this=this;
            for(var i in $this.domArr){
                $this.close(i);
            }
        }
    }

    if(!win.bomb)win.bomb=bomb;
    win[newName]=bomb;
}(window,'$H'))