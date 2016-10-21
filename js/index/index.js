;(function($){
	var Dialog = function(config){
		var _this_ = this;

		//默认参数配置

		this.config = {
			//对话框提示信息
			message:null,
			//对话框宽度,高
			width:'auto',
			height:'auto',
			//对话框类型
			type:"waiting",
			//按钮配置
			buttons:null,
			//弹出框延迟多久关闭
			delay:null,
			//对话框遮罩层透明度
			maskOpacity:null,
			//是否启用动画
			effect:false

		}

		//默认参数扩展
		if(config && $.isPlainObject(config)){
			$.extend(this.config,config);
		} else {
			this.isConfig = true;
		}

		//创建基本的DOM
		this.body = $('body');
		//创建遮罩层
		this.mask = $(' <div class="g-dialog-container">');
		//创建弹出框
		this.win = $('<div class="dialog-window">');
		//创建弹出框头部
		this.winHeader = $('<div class="dialog-header">');
		//创建提示信息
		this.winContent = $('<div class="dialog-content">');
		//创建弹出框按钮组
		this.winFooter = $('<div class="dialog-footer">');

		//渲染dom
		this.create();
	
	}
	//记录弹窗层级
	Dialog.zIndex = 10000;
	Dialog.prototype = {
		//动画函数
		animate:function(){
			var _this_ = this;
				//this.win.style.WebkitTransform = "scale(0,0)";
				this.win.css("-webkit-transform","scale(0,0)");
				window.setTimeout(function(){
					//this.win.style.WebkitTransform = "scale(1,1)";
					_this_.win.css("-webkit-transform","scale(1,1)");

				},100);
		},
		//创建弹出框
		create:function(){
			var _this_ = this,
			 	config = this.config,
			 	mask = this.mask,
			 	win = this.win,
			 	header = this.winHeader,
			 	content = this.winContent,
			 	footer = this.winFooter,
			 	body = this.body;

			//增加弹窗的层级
			Dialog.zIndex++;
			this.mask.css('zIndex',Dialog.zIndex);
			//如果没有传递任何参数，就弹出一个等待图标形式的弹窗
			if(this.isConfig){
				win.append(header.addClass('waiting'));

				if (config.effect) {
					this.animate();
				};

				mask.append(win);
				body.append(mask);
			} else {
				//根据配置参数创建相应的弹框
				header.addClass(config.type);
				win.append(header);
				//如果传了文本
				if (config.message) {
					win.append(content.html(config.message));
				};
				//如果传了按钮组
				if (config.buttons) {
					//c创建buttons数组					
					this.createButtons(footer,config.buttons);


					win.append(footer)
				};
				//插入到页面
				mask.append(win);
				body.append(mask);

				//设置对话框的宽高
				if (config.width != 'auto') {
					win.width(config.width);
				};
				if (config.height != 'auto') {
					win.height(config.height);
				};
				//设置对话框透明度
				if (config.maskOpacity) {
					mask.css('backgroundColor','rgba(0,0,0,'+config.maskOpacity+')');
				};
				//设置弹出框多久关闭
				if (config.delay && config.delay!=0) {
					window.setTimeout(function(){
						//关闭弹窗
						_this_.close();

					},config.delay)
				};
				if (config.effect) {
					this.animate();
				};
			}
		},
		//根据配置参数的buttons创建按钮列表
		createButtons: function (footer,buttons) {
			var _this_ = this;
			$(buttons).each(function(){
				//获取按钮样式和回掉 文本
				var type = this.type?" class='"+this.type+"'":"";
				var btnText = this.text?this.text:'按钮' + '++i';
				var callback = this.callback?this.callback:null;

				var button = $('<button'+type+'>'+btnText+'</button>');

				if (callback) {
					button.click(function(){
						var isClose = callback();

						if (isClose != false) {

							_this_.close();

						};
					})
				} else {
					button.click(function(){
						_this_.close();
					})
				};

				footer.append(button);
			})
		},
		//关闭弹窗
		close: function () {
			this.mask.remove();
		}

	}

	window.Dialog = Dialog;

	$.dialog = function(config){
		return new Dialog(config);
	}

})(Zepto);