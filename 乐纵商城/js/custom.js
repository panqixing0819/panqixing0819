$(document).ready(function(){
	
	//返回
	$(".return-btn,.return-prev").click(function(){
		window.history.go(-1);
	});
	
	//广告栏无缝滚动
	$(function(){
		var $scroll = $(".ad-txt");
		var $Length = $scroll.find('a').length;
		var $moveto;
		if($Length > 1){
			$scroll.hover(
				function (){
					clearInterval($moveto);
				},
				function (){
					$moveto = setInterval(function () {
						var $height = $scroll.find('a').height()+1;
						$scroll.find("a:first").animate({ marginTop: -$height + 'px' }, 600, 
					function () {
						$scroll.find("a:first").css('marginTop', 0).appendTo($scroll); 
					});}, 5000);
				}
			).trigger('mouseleave');
		}
	});
	
	//左侧菜单导航
	$(".menu-a").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		
		var _index = $(this).index();
		$(".date-content-inner").eq(_index).fadeIn().siblings().fadeOut();
	});
	
	//全部 销量 价格选项
	$(".cun-a").click(function(){
		var par = $(this).parent(".max-min-cun");
		var sib = $(par).siblings(".max-min-cun");
		var chi = $(sib).find(".cun-a");
		$(this).addClass("active").parent(par).siblings(sib).find(chi).removeClass("active");
	});
	
	var EQ1 = $(".max-min-cun").eq(0).find(".cun-a");
	var EQ2 = $(".max-min-cun").eq(1).find(".cun-a");
	var EQ3 = $(".max-min-cun").eq(2).find(".cun-a");
	
	var ELE1 = $(".price-null");
	var ELE2 = $(".price-max");
	var ELE3 = $(".price-min");
	var ELE4 = $(".sales-null");
	var ELE5 = $(".sales-max");
	var ELE6 = $(".sales-min");
	
	$(EQ1).click(function(){
		$(ELE2).hide().removeClass("active");
		$(ELE3).hide().removeClass("active");
		$(ELE5).hide().removeClass("active");
		$(ELE6).hide().removeClass("active");
		$(ELE1).show().removeClass("active");
		$(ELE4).show().removeClass("active");
	});
	
	$(EQ2).click(function(){
		$(ELE2).hide().removeClass("active");
		$(ELE3).hide().removeClass("active");
		$(ELE4).hide().removeClass("active");
		$(ELE6).hide().removeClass("active");
		$(ELE1).show().removeClass("active");
		$(ELE5).show().removeClass("active");
	});
	
	$(EQ3).click(function(){
		$(ELE1).hide().removeClass("active");
		$(ELE3).hide().removeClass("active");
		$(ELE5).hide().removeClass("active");
		$(ELE6).hide().removeClass("active");
		$(ELE2).show().removeClass("active");
		$(ELE4).show().removeClass("active");
	});
	
	
	$(ELE1).click(function(){
		$(ELE1).hide().removeClass("active");
		$(ELE2).show().addClass("active");
	});
	
	$(ELE2).click(function(){
		$(ELE1).hide().removeClass("active");
		$(ELE2).hide().removeClass("active");
		$(ELE3).show().addClass("active");
	});
	
	$(ELE3).click(function(){
		$(ELE1).hide().removeClass("active");
		$(ELE3).hide().removeClass("active");
		$(ELE2).show().addClass("active");
	});
	
	$(ELE4).click(function(){
		$(ELE4).hide().removeClass("active");
		$(ELE5).show().addClass("active");
	});
	
	$(ELE5).click(function(){
		$(ELE4).hide().removeClass("active");
		$(ELE5).hide().removeClass("active");
		$(ELE6).show().addClass("active");
	});
	
	$(ELE6).click(function(){
		$(ELE4).hide().removeClass("active");
		$(ELE6).hide().removeClass("active");
		$(ELE5).show().addClass("active");
	});
	
	//协议选项
	$(".checkbox-box input").click(function(){
		
		if($(this).attr("checked")){
			$(this).parent(".checkbox-box").addClass("checkbox-bg");
		}else{
			$(this).parent(".checkbox-box").removeClass("checkbox-bg");
		}
	});
	
	//表单动效
	$(".form-input input").focus(function(){
		var par = $(this).parent(".form-input");
		var sibi = $(par).siblings(".focus-line");
		$(sibi).css({"width":"100%"});
	});
	$(".form-input input").blur(function(){
		var par = $(this).parent(".form-input");
		var sibi = $(par).siblings(".focus-line");
		$(sibi).css({"width":"0"});
	});
	
	//商家列表选项状态
	$(".select-state li a").click(function(){
		var chi = $(this).find(".select-state-p,.select-state-span");
		var par = $(chi).parents(".select-state li");
		var sib = $(par).siblings("li");
		var chia = $(sib).find("a").find(".select-state-p,.select-state-span");
		
		$(chi).addClass("active");
		$(chia).removeClass("active");
	});
	
	//广告轮播
	$(function(){
    	var swiper = new Swiper('.banner_inner_box', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay:3000,
        autoplayDisableOnInteraction:false
    	});
	});
	
	//商品详情图片
	$(function(){
    	var swiper = new Swiper('.commodity-image', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        slidesPerView: 1,
        spaceBetween: 0,
        autoplayDisableOnInteraction:false
    	});
	});
	
	//收藏状态
	$(".collecting-a").click(function(){
		$(this).addClass("active");
	});
	
	//购物数量加
	$(".append").click(function(){
		var num = $(this).siblings(".in-number");
		var _val = $(num).val();
		var inp = parseInt(_val)+1;
		$(num).val(inp);
	});
	
	//购物数量减
	$(".subtract").click(function(){
		var num = $(this).siblings(".in-number");
		var _val = $(num).val();
		var inp = parseInt(_val)-1;
		if(_val > 0){
			$(num).val(inp);
		}else{
			return;
		}
	});
	
	//全选-取消全选
	var input_number = $("input:checkbox[name='check']");
	_number = 0;
	
	$("input[name='check-switch']").click(function(){
//		$('input[name="check"]').attr("checked",this.checked);
		if(this.checked){
		    $("input:checkbox[name='check']").prop("checked", 'true');
		    $("input:checkbox[name='check']").each(function(){
		    	$(this).parent(".commodity-sele-input").addClass("active");
		    });
		    $(this).parent(".settle-check-box").addClass("active");
		    
		    _number = input_number.length;
		}else{
		    $("input:checkbox[name='check']").removeAttr("checked");
		    $(this).parent(".settle-check-box").removeClass("active");
		    $("input:checkbox[name='check']").each(function(){
		    	$(this).parent(".commodity-sele-input").removeClass("active");
		    });
		    
		    _number = 0;
		}
	});
	
	//单个选择
	$("input:checkbox[name='check']").click(function(){
		if(this.checked){
		    $(this).parent(".commodity-sele-input").addClass("active");
		}else{
		    $(this).parent(".commodity-sele-input").removeClass("active");
		}
	});
	
	for ( var i = 0; i < input_number.length; i++)
        {
            input_number[i].onclick = function ()
            {

                if (this.checked)
                {
                    _number++;
                }else{
                   if(num == 0){
                        _number = 0;
                   }else{
                    _number--;
                   } 
                }

                if(_number == input_number.length){
                   $("input[name='check-switch']").prop("checked", 'true');
                  $("input[name='check-switch']").parent(".settle-check-box").addClass("active");
                }else{
                    $("input[name='check-switch']").prop("checked", 'false');
                  $("input[name='check-switch']").parent(".settle-check-box").removeClass("active");
                }
                
            };
        }
	
	//设置默认地址
	$("input[name='set']").click(function(){
		var par = $(this).parents(".IP-tier");
		var chi = $(par).find(".IP-name");
		var hint = "<span>【默认地址】</span>";
		var sib = $(par).siblings(".IP-tier");
		var child = $(sib).find(".IP-name");
		var setChi = $(sib).find(".set-input"); 
		
		if(this.checked){
		    $(this).parent(".set-input").addClass("active");
		    if($(chi).find("span").length == 0 ){
		    	$(chi).prepend(hint);
		    }else{
		    	return;
		    }
		    
		}else{
		    $(this).parent(".set-input").removeClass("active");
		    $(chi).find("span").remove();
		}
		
		$(child).find("span").remove();
		$(setChi).removeClass("active");
	});
	
	//删除地址
	$(".delete-btn").click(function(){
		var txt = confirm("您确定要删除地址吗？");
		if(txt == true){
			$(this).parents(".IP-tier").remove();
		}else{
			return;
		}
		
	});
	
	//选择默认
	$("input[name='default']").click(function(){
		if(this.checked){
		    $(this).parent(".click-check").addClass("active");
		}else{
		    $(this).parent(".click-check").removeClass("active");
		}
	});
	
	//编辑没有输入和已输入
	var 
	LINKMAN = $(".linkman").eq(0).find("input").val(),
	PHONE = $(".linkman").eq(1).find("input").val(),
	LOCATION = $(".linkman").eq(2).find("input").val();

	//明细导航
	$(".detail-nav li").click(function(){
		var _index = $(this).index();
		var _width = $(this).width();
		var _win = "-" + $(window).width();
		$(this).addClass("active").siblings().removeClass("active");
		
		$(".detail-nav-line").animate({"left":_index*_width},200);
		$(".information-inner").animate({marginLeft:_index*_win},200);
	});
	
	//充值按钮
	$(".how-many-btn").click(function(){
		var _par = $(this).parent(".how-many-tier");
		var _sib = $(_par).siblings(".how-many-tier");
		var _chi = $(_sib).find(".how-many-btn");
		$(this).addClass("active");
		$(_chi).removeClass("active");
	});
	
	//弹出拍照遮罩层
	$(".click-shade").click(function(){
		$(".camera-box").animate({"top":0},200);
	});
	
	//取消拍照
	$(".abolish-btn").click(function(){
		$(".camera-box").animate({"top":"100%"},200);
	});
	
	//商家状态开关
	$(".center-btn input").click(function(){
		if(this.checked){
		   $(".center-box").addClass("active");
		   $(".center-btn").addClass("active");
		}else{
		   $(".center-box").removeClass("active");
		   $(".center-btn").removeClass("active");
		}
	});
	
	
	
	//选择银行卡
	$(".select-bank-li").click(function(){
		$(this).find(".add-width-i").addClass("active");
		
		var par = $(this).siblings(".select-bank-li");
		$(par).find(".add-width-i").removeClass("active");
	});
	
	//安全设置表单效果
	$(".mobile-input input").focus(function(){
		$(this).parent(".mobile-input").css({
			"border-bottom":"1px solid #1e82d2"
		});
		
		var _par = $(this).parent(".mobile-input");
		var _sib = $(_par).siblings(".mobile-verify");
		$(_sib).css({"border-bottom":"1px solid #1e82d2"});
	});
	
	$(".mobile-input input").blur(function(){
		$(this).parent(".mobile-input").css({
			"border-bottom":"1px solid #E1E1E1"
		});
		
		var _par = $(this).parent(".mobile-input");
		var _sib = $(_par).siblings(".mobile-verify");
		$(_sib).css({"border-bottom":"1px solid #E1E1E1"});
	});
	
	//删除订单
	$(".delete-button").click(function(){
		var txt = confirm("您确定要删除订单吗？");
		if(txt == true){
			$(this).parents(".serial-number").remove();
		}else{
			return;
		}
	});
	
	//我的评价
	$(".star-li").click(function(){
		$(this).find(".star-p").toggleClass("active");
		$(this).find(".star-span").toggleClass("active");
	});
	
	//选择银行卡
	$(".bank-box button").click(function(){
		$(this).css({"outline":"#1e82d2 solid thin"})
		.siblings().css({"outline":"none"});
	});
	
	//我要退货
	$(".recede-p").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
	});
	
	//购物车删除订单
	$(".delete-indent").click(function(){
		var txt = confirm("您确定要删除订单吗？");
		if(txt == true){
			$(this).parents(".commodity-dier").remove();
		}else{
			return;
		}
	});
	
	//清空购物车
	$(".empty").click(function(){
		var txt = confirm("您确定要清空购物车吗？");
		if(txt == true){
			$(".commodity-dier").remove();
		}else{
			return;
		}
	});
	
	//详情购物数量加
	$(".money-btn-add").click(function(){
		var _val = $(".gw-num").text();
		var inp = parseInt(_val)+1;
		$(".gw-num").text(inp);
		$(".sp-number").text(inp);
		num();
	});
	
	//详情购物数量减
	$(".money-btn-subtract").click(function(){
		var _val = $(".gw-num").text();
		var inp = parseInt(_val)-1;
		if(_val > 0){
			$(".gw-num").text(inp);
			$(".sp-number").text(inp);
		}else{
			return;
		}
		num();
	});
	
	var VAL = $(".gw-num").text();
	var INP = parseInt(VAL);
	
	function num(){
		var VAL = $(".gw-num").text();
		var INP = parseInt(VAL);
		
		if(INP == 0){
			$(".money-btn-subtract").addClass("active");
			$(".sp-number").addClass("active");
		}else{
			$(".money-btn-subtract").removeClass("active");
			$(".sp-number").removeClass("active");
		}
	}
	
	//支付密码
	var INP_LENGTH = 0;
	var _inp = $(".six-number-input input");
	var _btn = $(".six-number-btn button");
	var btn_delete = $(_btn).eq(11);
	
	$(_btn).click(function(){
		var btn_val = $(this).val();
		
		if(btn_val != null && btn_val != ""){
			INP_LENGTH++;
			if(INP_LENGTH == 1){
				$(_inp).eq(0).val(btn_val);
				$(btn_delete).prop('disabled', false);
			}else if(INP_LENGTH == 2){
				$(_inp).eq(1).val(btn_val);
				$(btn_delete).prop('disabled', false);
			}else if(INP_LENGTH == 3){
				$(_inp).eq(2).val(btn_val);
				$(btn_delete).prop('disabled', false);
			}else if(INP_LENGTH == 4){
				$(_inp).eq(3).val(btn_val);
				$(btn_delete).prop('disabled', false);
			}else if(INP_LENGTH == 5){
				$(_inp).eq(4).val(btn_val);
				$(btn_delete).prop('disabled', false);
			}else if(INP_LENGTH == 6){
				$(_inp).eq(5).val(btn_val);
				$(_btn).prop('disabled', true);
				$(btn_delete).prop('disabled', false);
			}else if(INP_LENGTH >= 6){
				return false;
			}
		}else{
			return false;
		}
	});
	
	$(btn_delete).click(function(){//删除密码
		INP_LENGTH--;
		
		if(INP_LENGTH == 5){
			$(_inp).eq(5).val("");
			$(_btn).prop('disabled', false);
		}else if(INP_LENGTH == 4){
			$(_inp).eq(4).val("");
		}else if(INP_LENGTH == 3){
			$(_inp).eq(3).val("");
		}else if(INP_LENGTH == 2){
			$(_inp).eq(2).val("");
		}else if(INP_LENGTH == 1){
			$(_inp).eq(1).val("");
		}else if(INP_LENGTH == 0){
			$(_inp).eq(0).val("");
			$(btn_delete).prop('disabled', true);
		}
	});
	
	//提现按钮-支付密码
	$(".add-IP-btn button").click(function(){
		$(".pay-passwrod").animate({"top":0},200);
	});
	
	$(".submit-btn2").click(function(){
		$(".pay-passwrod").animate({"top":"100%"},200);
		$(_inp).val("");
		$(_btn).prop('disabled', false);
		$(btn_delete).prop('disabled', true);
		INP_LENGTH = 0;
		$(".password").removeClass("active");
	});
	
});

