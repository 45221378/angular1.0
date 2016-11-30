// 函数自执行
! function(a) {
	"use strict";
	var b = document,
		c = "querySelectorAll",
		d = "getElementsByClassName",
		e = function(a) {
			return b[c](a)
		},
		// !0 true  !1 false 
		f = {
			type: 1,
			shade: !0,
			shadeClose: !0,
			fixed: !0,
			anim: "scale"
		},
		g = {
			// extend 插件扩展  相同的合并 
			extend: function(a) {
				var b = JSON.parse(JSON.stringify(f));
				for (var c in a) b[c] = a[c];
				return b
			},
			timer: {},
			end: {}
		};
		//回掉函数,调用click事件去执行其他的回掉函数
	g.touch = function(a, b) {
		a.addEventListener("click", function(a) {
			b.call(this, a)
		}, !1)
	};
	var h = 0,
		i = ["m-layer-box"],
		j = function(a) {
			var b = this;
			b.config = g.extend(a), b.view()
		};
	j.prototype.view = function() {
		var a = this,
			c = a.config,
			f = b.createElement("div");
			//id 页面每个弹框都给id,便于 delete
		a.id = f.id = i[0] + h, f.setAttribute("class", i[0] + " " + i[0] + (c.type || 0)), f.setAttribute("index", h);
		var div = '<div class="circle1"></div> <div class="circle2"></div><div class="circle3"></div><div class="circle4"></div>';
		var dong1= '<div class="m-spinner-box"><div class="spinner"><div class="spinner-container container1">'+div+'</div><div class="spinner-container container2">'+div+'</div><div class="spinner-container container3">'+div+'</div></div></div>';
		var dong2= "<div class='circle'><i class='iconfont icon-loading3'></i></div>";
		var dong3= "<div class='circle'><i class='iconfont icon-loading1'></i></div>";
		var dong4= "<div class='circle'><i class='iconfont icon-loading2'></i></div>";
		var sdiv = "<div class='circle'><i class='iconfont icon-roundcheck'></i></div>";
		var fdiv = "<div class='circle'><i class='iconfont icon-shibai'></i></div>";
		var p = '<div class="content-remain ' + (c.className ? c.className : "") +'  '+(c.type==2?"content-text":"")+' " >' + (c.content?'<p>'+c.content+'</p>' : "") + ( c.btn? '<p class="content-btn"> '+c.btn+'</p>'  :"") +' </div>';
		var oChild = null;
		
		if(c.spinner){
			switch(c.spinner){
				case 1:oChild=dong1;break;
				case 2:oChild=sdiv;break;
				case 3:oChild=fdiv;break;
				case 4:oChild=dong2;break;
				case 5:oChild=dong3;break;
				case 6:oChild=dong4;break;
				default:;
			}
		}
		f.innerHTML = (c.shade ? "<div " + ("string" == typeof c.shade ? 'style="' + c.shade + '"' : "") +' class="m-box-shade"></div>' : "") + '<div class="m-box-main"><div class="m-box-section"><div class="'+(c.type==1?"m-box-child "+ (c.childName ? c.childName : "") + " " +c.anim+" ":"m-box-content "+ (c.childName ? c.childName : "") +" "+c.anim + " ")+'"  '+("string" == typeof c.shadeChild ? 'style="' + c.shadeChild + '"' : "")+'>'+(c.type==1?oChild:"")+p+'</div></div></div>';
		document.body.appendChild(f);
		var m = a.elem = e("#" + a.id)[0];
		c.success && c.success(m), a.index = h++, a.action(c, m)
	}, 
	j.prototype.action = function(a, b) {
		var c = this;


		// time 参数存在才会进行延迟隐藏
		a.time && (g.timer[c.index] = setTimeout(function() {
			bombBox.close(c.index);
		}, 1e3 * a.time));

		var e = function() {
			var b = this.getAttribute("type");
			0 == b ? (a.no && a.no(), bombBox.close(c.index)) : a.yes ? a.yes(c.index) : bombBox.close(c.index)
		};

		//点击btn按钮出现的回调函数，
		if (a.btn)
			for (var f = b[d]("content-btn"), h = f.length, i = 0; h > i; i++) g.touch(f[i], e);

		//点遮罩关闭,改了，不是关闭小遮罩，而是关闭大遮罩；
		if (a.shade && a.shadeClose) {
			var j = b[d]("m-box-shade")[0];		
			// 传入end参数
			g.touch(j, function() {
				bombBox.close(c.index, a.end)
			})
		}
		a.end && (g.end[c.index] = a.end)
	},
	a.bombBox = {
		index: h,
		open: function(a) {
			var b = new j(a || {});
			return b.index
		},
		close: function(a) {

			var c = e("#" + i[0] + a)[0];
			
			c && (c.innerHTML = "", b.body.removeChild(c), clearTimeout(g.timer[a]), delete g.timer[a], "function" 
				== typeof g.end[a] && g.end[a](), delete g.end[a])
		},
		closeAll: function() {
			for (var a = b[d](i[0]), c = 0, e = a.length; e > c; c++) bombBox.close(0 | a[0].getAttribute("index"))
		}
	}, "function" == typeof define ? define(function() {
		return bombBox
	}) : function() {
		var a = document.scripts,
			c = a[a.length - 1],
			d = c.src,
			e = d.substring(0, d.lastIndexOf("/") + 1);
		c.getAttribute("merge") || document.head.appendChild(function() {
			var a = b.createElement("link");
			return a.href = e + "bombBox.css", a.type = "text/css", a.rel = "styleSheet", a.id = "bombBox", a
		}())
	}()
}(window);