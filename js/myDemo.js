;
(function($,window,document,undefined){//传值,多传的忽略
	'use strict'//使用严格模式
	//定义插件名称
	var plugingName = 'slideDownRefresh',
	defaults = {
		//默认 配置项 如果使用者不写自己加上
		'width':'300px'
	}
	// 属性：
	function Plugin(element,options){
		//element 为节点，options是执行的快慢，宽高呀配置项
		//console.log(element);//测试是否正确
		this.element = element;
		// this.options = options;//得检测下看看 使用者是否佳丽参数
		this.options = $.extend({},defaults,options);//如果options没有就用defaults,如果options有就把defaults的给替换
		// console.log(this.options);

		// 执行以下，初始化调用一下
		this.init();
		this.eventHandle();
	}
	//方法：
	Plugin.prototype = {
		init: function(){
			this.$refresh = $(this.element).find('.refresh');//找到标签
			this.$rotate = $(this.element).find('img');//找到旋转标签
			this._start = 0;//旋转的初始值
			this._end = 0;//旋转的结束值
		},

		// 事件主要为移动端touch事件，下面会写到，不懂得可以取查阅资料
		eventHandle: function(){
			this.touchStart(this.element);
		},
		touchStart: function(ele){
			var _self=this;//把this存起来，不用来回反复取(节约性能);
			$(ele).on('touchstart', function(e){
				var touch = e.targetTouches[0];//只允许一个手指触碰
				_self._start = touch.pageY;//获取点上去时的纵坐标
				_self.touchMove(_self.element);//调用移动方法
			})
		},
		touchMove: function(ele){
			var _self=this;//把this存起来，不用来回反复取(节约性能);
			$(ele).on('touchmove', function(e){
				var touch = e.targetTouches[0];//只允许一个手指触碰
				_self._end = _self._start - touch.pageY;//获取移动的纵坐标距离
				_sliding.call(_self,_self._end);
				//这里之所以不用_sliding.()调用是因为，这样传的this为touchmove的this,而我们要的this为：_self
				_self.touchEnd(_self.element);
			});
			// 写个私有方法
			function _sliding(dist){
				// dist为距离
				_self.$refresh.css('transform', 'translate3d(0,'+ -dist + 'px, 0)');//拿到结点 写动画
				_self.$rotate.css('transform','rotate('+ (-dist * 4) + 'deg)');//让load转起来这里的4只是随便写的，可以任意写，怎么好看怎么写
			}
		},
		touchEnd: function(ele){
			var _self=this;//把this存起来，不用来回反复取(节约性能);
			$(ele).on('touchend', function(e){
				if(_self._end < -160){
					// 这个数字可以随便设置 成功时
					_slided.call(_self);
					setTimeout(function(){
						_reset.call(_self);
					},3000);
				}else{
					//距离不够
					_noslide.call(_self);
				}
				// 事件全部执行完以后，把事件全部移除
				$(this).unbind('touchmove');
				$(this).unbind('touchend');
			});
			function _slided(){// 下拉，然后松开，然后执行
				_self.$refresh.addClass('refreshing');
				_self.$rotate.addClass('index');
			};
			// 下滑距离不够时，复原 但是不算新
			function _noslide(){
				_self.$refresh.addClass('refreshing');
				_self.$rotate.addClass('index');
				_self.$refresh.css('transform', 'translate3d(0,0,0)');
				_self.$rotate.css('transform',  'rotate(0deg)');
				// 移除加的class
				setTimeout(function(){
					_self.$refresh.removeClass('refreshing');
					_self.$rotate.removeClass('index');
				},500);
			};
			// 刷新完成，回到原来状态
			function _reset(){
				_self.$refresh.css('transform', 'translate3d(0,0,0)');
				_self.$rotate.css('transform',  'rotate(0deg)');

				setTimeout(function(){
					_self.$refresh.removeClass('refreshing');
					_self.$rotate.removeClass('index');
					// window.location.reload(); //刷新页面，或者执行ajax 调取数据
					
					// 调用数据
					$.ajax({
					    url:,
					    data:url,
					    success:function(data){
					    	var list=defaults.redenr(data);
					    	$("...").append(list);
					    }
					})
				},500);
			}
		}
	}
	// 把插件绑定到Zepto上：
	$.fn[plugingName] = function(options){
		return this.each(function(){//遍历匹配的元素，此处的this表示为jquery对象，而不是dom对象 
			// 因为 应该有多个地方用到这个插件 
			//zepto 的data与jquery的data有区别日后再说
			if( !$(this).data('plugin_' + plugingName)){
				return $(this).data('plugin_' + plugingName, new Plugin(this,options))
			}
		})
	}
})(Zepto,window,document);