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
        animate: '' ,//提示动画class 默认为空 (可设为'bouncein')
        time: 0 ,//延迟关闭弹窗时间,
        loadType: 0,//load效果种类,
        msg:'',//弹框显示文字信息,
        header:'',//在msg上面显示的内容,
        footer:'',//在msg下面显示的内容,
        top:'',  //弹框定位距离上面的位置,
        left:'', //弹框定位距离左边的位置,
        btn:'', //按钮
    };

    //loadType loding效果种类
    var loadType = {
    	0:'<div class="spinner0"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>',
        1:'<div class="spinner1"></div>',
        2:'<div class="spinner2"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>',
        3:'<div class="spinner3"><div class="dot1"></div><div class="dot2"></div></div>',
        4:'<div class="spinner4"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
        5:'<div class="spinner5"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>',
	}

	function bombBox(options,index){
        var $this=this;
        $this.config=$.extend({},config,options);
        $this.index=index;
        $this.init();
    }

	//初始化弹框
    bombBox.prototype.init = function(){
    	var $this = this;
    	var closeTime = this.config.time;

    	$this.bombBoxDom=$('<div class='+$this.config.defaultClass+'></div>');

    	$this.getContent(this.config.type);




    	$this.bombBoxDom.append.append($this.contentDom);
    	$("body").append($this.bombBoxDom);


    	//关闭动画的时间
    	if(closeTime>0){
            $this.timeOut=setTimeout(function(){
               bombBox.close($this.index);
            },closeTime)
        }

    }

	//弹框内容的生成
	bombBox.prototype.getContent = function(type){
		var $this = this;
		$this.contentDom= $('<section class="m-box-main"><div class="m-box-section"><div class="m-box-child '+ $this.config.animate +' "></div></div></section>');
        var header=$this.config.header?'<header>'+$this.config.header+'</header>':'',
    	footer=$this.config.footer?'<footer>'+$this.config.footer+'</footer>':'';
    	switch(type){
    		case 0:
                $this.contentDom.html(header+'<p class="tipMsg">'+$this.config.msg+'</p>'+footer);
                break;
            case 1:
                $this.contentDom.html(header+loadType[$this.config.loadType]+footer);
                break;
            default:
                break;
    	}
	}

	//弹框内容的删除
	bombBox.prototype.remove=function(){
        var $this=this;
        if($this.timeOut) clearTimeout($this.timeOut);
        $this.bombBox.off();
        $this.contentDom.off();
        $this.bombBoxDom.remove();
    };

    var bombBox = {
    	currentIndex:0,//弹窗个数，标记每个新建弹窗 通过domArr定位将其删除
        domArr:{},//用来存放生成的弹框元素
        open: function (options) {
            this.domArr[this.currentIndex]= new bombBox(options || {},this.currentIndex);
            return this.currentIndex++;
        },
        msg: function(msg){
            this.domArr[this.currentIndex]= new bombBox({
                shade: false ,
                shadeClose: false,
                contentShade: true,
                time: 2500 ,
                animate: 'bouncein',
                msg:msg
            },this.currentIndex);
            return this.currentIndex++;
        },
        close: function(index){
            this.domArr[index].remove();
            this.domArr[index]=null;
            delete this.domArr[index]
        },
        closeAll: function(){
            var $this=this;
            for(var i in $this.domArr){
                $this.close(i);
            }
        }
    }



    if(!win.bombBox)win.bombBox=bombBox;
    win[newName]=bombBox;
}(window,'$H'))