// JavaScript Document

//获取对象样式
function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
};

//绑定事件，可重复绑定('事件名称'必须加引号)
function bind(obj,evname,fn){
	if(obj.addEventListener){
		obj.addEventListener(evname,fn,false);
	}else{
		obj.attachEvent('on'+evname,function(){
			fn.call(obj);
		});
	}
};

//取消绑定，可重复取消('事件名称'必须加引号)
function unBind(obj,evname,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(evname,fn,false);
	}else{
		obj.detachEvent('on'+evname,fn);
	}
};

//获取到document的位置
function getPos(obj,attr){		
	var value=0;
	var iPos=0;
	var i=0;							
	while(obj){
		iPos=attr=='left'?obj.offsetLeft:iPos=obj.offsetTop;
		value+=iPos;
		obj=obj.offsetParent;	
		i++;
	}		
	return value;
};

//碰撞检测(配合定时器使用)
function collide(obj1,obj2){
	var l1=obj1.offsetLeft;
	var r1=obj1.offsetLeft+obj1.offsetWidth;
	var t1=obj1.offsetTop;
	var b1=obj1.offsetTop+obj1.offsetHeight;
	
		var l2=obj2.offsetLeft;
		var r2=obj2.offsetLeft+obj2.offsetWidth;
		var t2=obj2.offsetTop;
		var b2=obj2.offsetTop+obj2.offsetHeight;
	return r1<l2||l1>r2||b1<t2||t1>b2?false:true;
};

//鼠标拖拽控制物体+事件
function drag(obj,lMin,lMax,tMin,tMax,fn1,fn2,endFn){
	obj.onmousedown=function(ev){
		var ev=ev||event;
		var disX=ev.clientX-obj.offsetLeft;
		var disY=ev.clientY-obj.offsetTop;
		if(obj.setCapture)obj.setCapture;
		fn1&&fn1.call(obj,disX,disY);
		document.onmousemove=function(ev){
			var ev=ev||event;
			var l=ev.clientX-disX;
			var t=ev.clientY-disY;
			if(l<lMin)l=lMin;
			if(l>lMax)l=lMax;
			if(t<tMin)t=tMin;
			if(t>tMax)t=tMax;
			obj.style.left=l+'px';
			obj.style.top=t+'px';
			fn2&&fn2.call(obj,l,t);
		};
		document.onmouseup=function(){
			document.onmousemove=document.onmouseup=null;		
			if(obj.releaseCapture)obj.releaseCapture;
				endFn&&endFn.call(obj);
			};
	return false;
	};
};

//鼠标滚轮控制物体+事件
function mouseWheel(obj,attr,dis,minTarget,maxTarget,fn){
document.onmousewheel=fn1;
bind(document,'DOMMouseScroll',fn1);
	function fn1(ev){
		var ev=ev||event; 
		var up=true;
		var value=0;
		var outcome=0;
		if(ev.wheelDelta){
			up=ev.wheelDelta>0?true:false;
		}else{
			up=ev.detail<0?true:false;
		}	
		value=up?-dis:dis;
		switch(attr){
			case 'left':outcome=obj.offsetLeft+value;break;
			case 'top':outcome=obj.offsetTop+value;break;	
			case 'width':outcome=obj.offsetWidth+value;break;
			case 'height':outcome=obj.offsetHeight+value;break;	
			case 'opacity':outcome=getStyle(obj,attr)*100+value;break;		
		}
		if(outcome<minTarget)outcome=minTarget;
		if(outcome>maxTarget)outcome=maxTarget;
		if(attr=='opacity'){
			obj.style.opacity=outcome/100;
			obj.style.filter='alpha(opacity:'+outcome+')';
		}else{
			obj.style[attr]=outcome+'px';	
		}	
		fn&&fn.call(obj);
		if(ev.preventDefault)ev.preventDefault();
		return false;
	};
};

//时间变成两位数
function toTwo(n){
	return n<10? '0'+n: ''+n;
};

//输入未来时间,返回倒计时json
function getDown(year,month,date,hours,minutes,seconds){
	var future=new Date(year+' '+month+' '+date+' '+hours+':'+minutes+':'+seconds).getTime();
	var now=new Date().getTime();
	var t=Math.floor( (future-now)/1000);
	return {'d':Math.floor(t/86400),'h':Math.floor(t%86400/3600),'m':Math.floor(t%86400%3600/60),'s':t%60};		
};

//匀速链式运动框架
function move(msec,obj,attr,dis,target,endFn){
	clearInterval(obj.move);	
	var arr=[];
	var num=0;
	var onOff=false;
	var position=parseInt(getStyle(obj,attr.split('/').join('')));	
		for(var i=target;i>0;i-=dis) {
			arr.push(i,-i);
		}
		arr.push(0);
		if(attr=='/left'||attr=='/top'){
			onOff=true;			
		}else if(attr=='opacity'){
			var dis=getStyle(obj,attr)*100<target?dis:-dis;
		}else{		
			var dis=parseInt(getStyle(obj,attr))<target?dis:-dis;	
		}	
	obj.move=setInterval(function (){									   
		if(onOff){		
			attr=attr.split('/').join('');			
		}else if(attr=='opacity'){
			var outcome=getStyle(obj,attr)*100+dis;	
		}else{
			var outcome=parseInt(getStyle(obj,attr))+dis;	
		}		
		if(outcome>target&&dis>0||outcome<target&&dis<0)outcome=target;	
		if(onOff){		
			obj.style[attr]=position+arr[num]+'px';
			num++;
			}else if(attr=='opacity'){
			obj.style.opacity=outcome/100;
			obj.style.filter='alpha(opacity:'+outcome+')';
		}else{
			obj.style[attr]=outcome+'px';		
		}
		if(outcome==target||num==arr.length){
			clearInterval(obj.move);
			endFn&&endFn.call(obj);
		}	
	},msec);	
};

//匀速同步运动框架
function manyMove(msec,obj,json,dis,endFn){
	clearInterval(obj.manyMove);	
	obj.manyMove=setInterval(function (){	
	var over=true;								   						   				
		for(var attr in json){
			var target=json[attr];	
			if(attr=='opacity'){
				var speed=getStyle(obj,attr)*100<target?dis:-dis;
				var outcome=getStyle(obj,attr)*100+speed;		
			}else{
				var speed=parseInt(getStyle(obj,attr))<target?dis:-dis;		
				var outcome=parseInt(getStyle(obj,attr))+speed;	
			}
			if(outcome>target&&speed>0||outcome<target&&speed<0)outcome=target;	
			if(attr=='opacity'){				
				obj.style.opacity=outcome/100;
				obj.style.filter='alpha(opacity:'+outcome+')';		
			}else{	
				obj.style[attr]=outcome+'px';		
			}
			if(outcome!=target)over=false;				
		}
		if(over){
			clearInterval(obj.manyMove);
			endFn&&endFn.call(obj);
		}	
	},msec);	
};

//综合类型同步运动框架
function allMove(time,obj,json,type,endFn){
	clearInterval(obj.allMove);
	var Default={};
	var startTime=new Date().getTime();
	for(var attr in json){
	Default[attr]=0; 
	Default[attr]=attr=='opacity'? Math.round(getStyle(obj,attr)*100)
								   :parseInt(getStyle(obj,attr));
	}	
	obj.allMove=setInterval(function(){
		var changeTime=new Date().getTime()-startTime;
		var t=time-Math.max(0,time-changeTime);
		for(var attr in json){
			var value=moveType[type](t,Default[attr],json[attr]-Default[attr],time);			
			if(attr=='opacity'){
				obj.style.opacity=value/100;
				obj.style.filter='alpha(opacity='+value+')';
			} else {
				obj.style[attr]=value+'px';
			}
		}
		if(t==time){
			clearInterval(obj.allMove);
			endFn&&endFn.call(obj);
		}
	},20)
};

var moveType={
	//t:运动消耗的时间 b:初始值 c:目标值 d:设定的总时间 return:返回是随运动变化的结果值
	'linear':function (t,b,c,d){  //匀速运动 
		return c*(t/d)+b;
	},
	'easeIn':function(t,b,c,d){  //加速运动 
		return c*(t/=d)*t+b;
	},
	'easeOut':function(t,b,c,d){  //减速运动
		return c*(t/=d)*(2-t)+b;
	},
	'easeBoth':function(t,b,c,d){  //加速减速运动 
		return (t/=d/2)<1?c/2*t*t+b :c/2*((t-=1)*(2-t)+1)+b;
	},
	'easeInStrong':function(t,b,c,d){  //加加速运动
		return c*(t/=d)*t*t+b;
	},
	'easeOutStrong':function(t,b,c,d){  //减减速运动
		return c*(1-(t=1-t/d)*t*t)+b;
	},
	'easeBothStrong':function(t,b,c,d){  //加加速减减速运动
		return (t/=d/2)<1?c/2*t*t*t+b :c/2*((t-=2)*t*t+2)+b;
	},
	'elasticIn':function(t,b,c,d,a,p){  //弹性加速
		if (t==0) return b;
		if ((t/=d)==1) return b+c; 
		if (!p) p=d*0.3;
		if (!a||a<Math.abs(c)) a=c;
		var s=!a||a<Math.abs(c)?p/4 :s=p/(2*Math.PI)*Math.asin(c/a);	
		return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
	},
	'elasticOut':function(t,b,c,d,a,p){  //加速弹性
		if (t==0) return b;
		if ((t/=d)==1) return b+c;
		if (!p)p=d*0.3;
		if (!a||a<Math.abs(c)) a=c;
		var s=!a||a<Math.abs(c)?p/4 :s=p/(2*Math.PI)*Math.asin(c/a);
		return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;
	},    
	'elasticBoth':function(t,b,c,d,a,p){  //弹性加速弹性
		if(t==0) return b;
		if((t/=d/2)==2) return b+c;
		if (!p) p=d*(0.3*1.5);
		if (!a||a<Math.abs(c)) a=c; 
		var s=!a||a<Math.abs(c)?p/4: s=p/(2*Math.PI)*Math.asin(c/a);
		return 	t<1? -0.5*(a*Math.pow(2,10*(t-=1))* Math.sin( (t*d-s)*(2*Math.PI)/p))+b :a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b;				
	},
	'backIn':function(t,b,c,d){  //回退加速
		var s=1.70158;
		return c*(t/=d)*t*((s+1)*t-s)+b;
	},
	'backOut':function(t,b,c,d){	  //加速回退
		var s=3.70158;
		return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;
	}, 
	'backBoth':function(t,b,c,d){  //回退加速回退
		var s=1.70158; 
		return	(t/=d/2)<1? c/2*(t*t*(((s*=(1.525))+1)*t-s))+b
							:c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s)+2)+b;
	},
	'bounceIn':function(t,b,c,d){  //弹球加速
		return c-moveType['bounceOut'](d-t, 0, c, d)+b;
	},       
	'bounceOut':function(t,b,c,d){  //加速弹球
		if ((t/=d)<(1/2.75)) return c*(7.5625*t*t)+b;			
		if (t<(2/2.75)) return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b;			
		if (t<(2.5/2.75)) return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b;
		return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b;
	},      
	'bounceBoth':function(t,b,c,d){  //弹球加速弹球
		return t<d/2? moveType['bounceIn'](t*2,0,c,d)*0.5+b
					   :moveType['bounceOut'](t*2-d,0,c,d)*0.5+c*0.5+b; 
	}
};

//基于css()函数的运动框架
function tweenMove(time,obj,json,type,endFn){
	var fn=moveType[type];
	var t=0;
	var b={};
	var c={};
	var d=time/24;
	var attr='';
	clearInterval(obj.timer);
	for(attr in json){
		b[attr]=css(obj,attr);
		c[attr]=json[attr]-b[attr];
	}
	if(time<30){
		for(attr in json){
			css(obj,attr,json[attr]);
		}
	}else{
		obj.timer=setInterval(function(){
			if(t<d){
				t++;
				for(attr in json){
					css(obj,attr,fn(t,b[attr],c[attr],d));
				}
			}else{
				for(attr in json){
					css(obj,attr,json[attr]);
				}
				clearInterval(obj.timer);
				endFn&&endFn.call(obj);
			}
		},20);
	}
};

//设置css样式
function css(obj,attr,value){
	if(arguments.length==2){
		if(attr=='scale'|| attr=='rotate'|| attr=='rotateX'||attr=='rotateY'||attr=='scaleX'||attr=='scaleY'||attr=='translateY'||attr=='translateX'){
			if(!obj.$Transform)obj.$Transform={};
			switch(attr){
				case 'scale':
				case 'scaleX':
				case 'scaleY':
					return typeof(obj.$Transform[attr])=='number'?obj.$Transform[attr]:100;
					break;
				default:
					return obj.$Transform[attr]?obj.$Transform[attr]:0;
			}
		}
		var current=getStyle(obj,attr);
		return attr=='opacity'?Math.round(parseFloat(current)*100):parseInt(current);		
	}else if(arguments.length==3){
		switch(attr){
			case 'scale':
			case 'scaleX':
			case 'scaleY':
			case 'rotate':
			case 'rotateX':
			case 'rotateY':
			case 'translateZ':
			case 'translateX':
			case 'translateY':
				setCss3(obj,attr,value);
				break;
			case 'width':
			case 'height':
			case 'paddingLeft':
			case 'paddingTop':
			case 'paddingRight':
			case 'paddingBottom':
				value=Math.max(value,0);
			case 'left':
			case 'top':
			case 'marginLeft':
			case 'marginTop':
			case 'marginRight':
			case 'marginBottom':
				obj.style[attr]=typeof(value=='string')?value:value+'px';
				break;
			case 'opacity':
				obj.style.filter="alpha(opacity:"+value+")";
				obj.style.opacity=value/100;
				break;
			default:
				obj.style[attr]=value;
		}
	}
	return function(attr_in,value_in){css(obj,attr_in,value_in)};
};

//兼容css3样式
function setCss3(obj, attr, value){
	var str='';
	var val='';
	var arr=['Webkit','Moz','O','ms',''];
	if(!obj['$Transform']){
		obj['$Transform']={};
	}
	obj['$Transform'][attr]=parseInt(value);
	for(str in obj['$Transform']){
		switch(str){
			case 'scale':
			case 'scaleX':
			case 'scaleY':
				val+=str+'('+(obj['$Transform'][str]/100)+')';	
				break;
			case 'rotate':
			case 'rotateX':
			case 'rotateY':
				val+=str+'('+(obj['$Transform'][str])+'deg)';	
				break;
			case 'translateX':
			case 'translateY':
			case 'translateZ':
				val+=str+'('+(obj['$Transform'][str])+'px)';	
				break;
		}
	}
	for(var i=0;i<arr.length;i++){
		obj.style[arr[i]+'Transform']=val;
	}	
};	

//布局转换
function layoutChange(obj){
	for(var i=0;i<obj.length;i++){
		obj[i].style.left=obj[i].offsetLeft+'px';
		obj[i].style.top=obj[i].offsetTop+'px';
	}
	for(var i=0;i<obj.length;i++){
		obj[i].style.position='absolute';
		obj[i].style.margin='0';
	}
};

//数组去重
function noRepeat(array){
	for(var i=0;i<array.length;i++){
		for(var j=i+1;j<array.length;j++){
			if(array[i]==array[j]){
				array.splice(j,1);
				j--;
			}
		}
	}
};

//选中文字兼容
function selectText(){
return 	document.selection? document.selection.createRange().text //ie下
							:window.getSelection().toString(); //标准下
};

//图片上传预览
function preview(oInp,oImg){
	if(oInp.length){
		for(var i=0;i<oInp.length;i++){	
			oInp[i].index=i;
		}
		for(var i=0;i<oInp.length;i++){	
			oInp[i].onchange=function(){	
				oImg[this.index].src=window.URL.createObjectURL(this.files[0]);
			};
		}	
	}else{
		oInp.onchange=function(){	
			oImg.src=window.URL.createObjectURL(this.files[0]);
		};
	}
};

//获取坐标的rgba值
function getXY(obj,x,y){ 	
	var w=obj.width;
	var h=obj.height;
	var d=obj.data;	
	var color=[];	
	color[0]=d[4*(y*w+x)];
	color[1]=d[4*(y*w+x)+1];
	color[2]=d[4*(y*w+x)+2];
	color[3]=d[4*(y*w+x)+3];	
	return color;	
};

//设置坐标的rgba颜色
function setXY(obj,x,y,color){
	var w=obj.width;
	var h=obj.height;
	var d=obj.data;		
	d[4*(y*w+x)]=color[0];
	d[4*(y*w+x)+1]=color[1];
	d[4*(y*w+x)+2]=color[2];
	d[4*(y*w+x)+3]=color[3];	
};

//内核前缀查询
function getPrefix(){
	var style=document.body.style||document.documentElement.style;
	var arr=['webkit','khtml','moz','ms','o'];
	for(var i=0;i<arr.length;i++){
		if (typeof style[arr[i]+'Transition']=='string'){
			document.title='内核前缀：-'+arr[i];
		}
	}		
};

//设置cookie
function setCookie(key,value,t){
	var oDate=new Date();
	oDate.setDate(oDate.getDate()+t);
	document.cookie=key+'='+value+';expires='+oDate.toGMTString();
};

//获取cookie
function getCookie(key){
	var arr1=document.cookie.split('; ');
	for (var i=0;i<arr1.length;i++){
		var arr2=arr1[i].split('=');
		if (arr2[0]==key){
			return decodeURI(arr2[1]);
		}
	}
};

//删除cookie（就是重新设置一遍,让cookie值为空,过期时间为过期）
function removeCookie(key){
	var oDate=new Date();
	oDate.setDate(oDate.getDate()-1);
	document.cookie=key+'='+''+';expires='+oDate.toGMTString();
};

//获取多个任意class(class之间用逗号隔开)
function getClass(parent,tagN,classN){
var allTag=parent.getElementsByTagName(tagN),	
 	arrClass=classN.split(','),
	arr=[];
	for(var i=0;i<allTag.length;i++){
	var aClass=allTag[i].className.split(' ');		
		for(var j=0;j<arrClass.length;j++){
			for(var k=0;k<aClass.length;k++){
				if(aClass[k]==arrClass[j]){
				arr.push(allTag[i]);
				break;
				}	
			}
		}
	}
	return arr;
};

//配合正则获取单个class
function getByClass(parent,tagN,classN){
	var allTag=parent.getElementsByTagName(tagN);
	var arr=[];
	var re=new RegExp('\\b'+classN+'\\b','i');
	var i=0;	
	for(i=0;i<allTag.length;i++){	
		if(re.test(allTag[i].className)){
		arr.push(allTag[i]);
		}
	}	
	return arr;
};

//添加任意class
function addClass(obj,classN){
	if(!obj.className){
	obj.className=classN;
	}else{
	var arrClass=obj.className.split(' '),
		index=arrIndexOf(arrClass,classN);
		if(!index){
		obj.className+=' '+classN;
		}
	}	
};

//移除任意class
function removeClass(obj,classN){
	if(obj.className){
	var arrClass=obj.className.split(' '),
		index=arrIndexOf(arrClass,classN);
		if(index){
		arrClass.splice(index,1);
		obj.className=arrClass.join(' ');
		}
	}
};

//用js修改样式表
//iNum（样式表对象的索引）
//className(想要修改的选择器完整名称)
//json(json格式去写样式)
function jsStyle(iNum,className,json){
	var sheet=document.styleSheets[iNum];//拿到样式表对象
	var rules=sheet.cssRules||shhet.rules;//拿到所有的样式
	var rule=null;
	
	for(var i=0;i<rules.length;i++){
		if(rules[i].selectorText==className){
			rule=rules[i];//拿到想要操作的那条样式
			for(var attr in json){
				rule.style[attr]=json[attr];
			}
		}
	}

	return rule.cssText;
};

//用js修改样式表
//linkHref（样式表完整名称）
//className(想要修改的选择器完整名称)
//json(json格式去写样式)
function jsStyle1(linkHref,className,json){ 
	var sheets=document.styleSheets;//拿到所有样式表
	var sheet=null;

	for(var i=0;i<sheets.length;i++){
		var sHref=sheets[i].href;
		sHref=sHref.substring(sHref.lastIndexOf('/')+1,sHref.length);
		
		if(sHref==linkHref){
			sheet=sheets[i];//拿到样式表对象
		}
	}
	
	var rules=sheet.cssRules||shhet.rules;//拿到所有的样式
	var rule=null;
	
	for(var i=0;i<rules.length;i++){
		if(rules[i].selectorText==className){
			rule=rules[i];//拿到想要操作的那条样式
			for(var attr in json){
				rule.style[attr]=json[attr];
			}
		}
	}
	return rule.cssText;
};

//手机无缝轮播划屏插件
//obj(轮播图的父容器)，obj1（高亮的小点的父容器），styleClass（高亮小点的样式）
//moveType(运动类型)'linear' 'easeIn' 'easeOut' 'easeBoth' 'easeInStrong' 'easeOutStrong' 'easeBothStrong'-
//-'elasticIn' 'elasticOut' 'elasticBoth' 'backIn' 'backOut' 'backBoth' 'bounceIn' 'bounceOut' 'bounceBoth'
//t（轮播间隔），t1(轮播滚动时间)，t2（划屏滚动时间），t3（划屏后轮播延迟时间）
function autoplay(obj,obj1,styleClass,moveType,t,t1,t2,t3){
	var oLi=obj.children;
	var aLi=obj1.children;
	var iW=oLi[0].offsetWidth;
	var iL=oLi.length*2;
	var iLeft=0;
	var iTop=0;
	var lDis=0;
	var oTime=0;
	var iNow=0;
	var	index=0;
	var iOld=0;
	var str='';
	var timer=null;
	var timer1=null;
	
	obj.innerHTML+=obj.innerHTML;
	obj.style.width=iW*iL+'px';
	for(var i=0;i<iL;i++){
		oLi[i].style.width=iW+'px';
	}
	
	for(var i=0;i<iL/2;i++){
		str+='<li></li>';
	}
	obj1.innerHTML=str;	
	var iW1=obj1.offsetWidth;	
	obj1.style.marginLeft=-iW1/2+'px';
	aLi[0].classList.add(styleClass);
	
	if(iNow==0){
		iNow=iL/2;	
		css(obj,'translateX',-iW*iL/2);					
	}
	bind(obj,'touchstart',fn2);
	function fn2(ev){
		var ev=ev||event;
		clearInterval(timer);
		iLeft=ev.changedTouches[0].pageX;
		iTop=ev.changedTouches[0].pageY;
		oTime=Date.now();
	
		iOld=css(obj,'translateX');
		bind(obj,'touchmove',fix);
		bind(obj1,'touchmove',fix);			
	};
	
	bind(obj,'touchmove',fn3);
	function fn3(ev){
		var ev=ev||event;
		lDis=ev.changedTouches[0].pageX-iLeft;
		tDis=ev.changedTouches[0].pageY-iTop;
		var condition=Math.abs(lDis)-Math.abs(tDis);
		
		if(condition<0){
			unBind(obj,'touchmove',fix);
			unBind(obj1,'touchmove',fix);	
		}else{
			css(obj,'translateX',iOld+lDis);
		}
	};
		
	bind(obj,'touchend',fn4);
	function fn4(){			
		var tDis=Date.now()-oTime;
	
		if(Math.abs(lDis/iW)>0.3||tDis<300&&Math.abs(lDis)>30){
			lDis<0?iNow++:iNow--;
			fn();
			lDis=0;		
		}
		
		tweenMove(t2,obj,{'translateX':-iNow*iW},moveType,function(){
			iOld=css(obj,'translateX');
		});
		unBind(obj,'touchmove',fix);
		unBind(obj1,'touchmove',fix);	
	};	
	
	bind(document,'touchmove',goOn);
	bind(document,'touchend',goOn);
	function goOn(){
		clearInterval(timer1);
		timer1=setTimeout(fn1,t3);
	};
	
	fn1();
	function fn1(){
		clearInterval(timer);
		timer=setInterval(function(){
			iNow++;		
			fn();
			tweenMove(t1,obj,{'translateX':-iNow*iW},moveType);
		},t);
	};
	
	function fn(){
		console.log(lDis);
		if(iNow>iL/2){
			iNow%=iL/2;
			css(obj,'translateX',0+lDis);
		}else if(iNow<1){
			iNow=iL/2;
			css(obj,'translateX',-iW*(iL/2+1)+lDis );							
		}
		index=iNow%(iL/2);
		for(var	i=0;i<aLi.length;i++){
			aLi[i].classList.remove(styleClass);
		}
		aLi[index].classList.add(styleClass);
	};	
	
	function fix(ev){
		var ev=ev||event;
		ev.preventDefault();
	};
};

//手机弹出菜单插件
//bt(控制按钮)，obj(遮罩层)，obj1（遮罩层包裹的菜单）
//json(菜单弹出时的属性)，json1（菜单收回时的属性）
//moveType（运动形式，推荐easeOut）
//t（遮罩层淡入淡出时间），t1（菜单弹出收回时间）
function menu(bt,obj,obj1,json,json1,moveType,t,t1){
	var oBody=document.getElementsByTagName('body')[0];
	obj.style.height=document.documentElement.clientHeight*2+'px';		
	obj.style.opacity=0;
	obj.style.filter='alpha(opacity:0)';
	
	bind(bt,'touchend',fn);
	function fn(){		
		oBody.style.overflowY='hidden';
		obj.style.display='block';
		for(attr in json1){		
			css(obj1,attr,json1[attr]);
		}		
		tweenMove(t,obj,{'opacity':100},moveType,function(){
			tweenMove(t1,obj1,json,moveType);
		});
	};
	
	bind(obj,'touchstart',fn2);
	function fn2(ev){
		var ev=ev||event;
		var iTop=ev.changedTouches[0].pageY;

		bind(obj,'touchend',fn1);
		function fn1(ev){
			var ev=ev||event;
			var iDis=ev.changedTouches[0].pageY-iTop;
			
			if(ev.target==obj&&Math.abs(iDis)==0){
				tweenMove(t1,obj1,json1,moveType,function(){
					tweenMove(t,obj,{'opacity':0},moveType,function(){
						obj.style.display='none';
						oBody.style.overflowY='auto';
					});					
				});		
			}						
		};
	};		
	
	bind(obj,'touchmove',fix);
	function fix(ev){
		var ev=ev||event;
		ev.preventDefault();
	};		
};

//电脑弹出菜单插件
//bt(控制按钮)，obj(遮罩层)，obj1（遮罩层包裹的菜单）
//json(菜单弹出时的属性)，json1（菜单收回时的属性）
//moveType（运动形式，推荐easeOut）
//t（遮罩层淡入淡出时间），t1（菜单弹出收回时间）
function menu1(bt,obj,obj1,json,json1,moveType,t,t1,Fn){
	var oBody=document.getElementsByTagName('body')[0];
	obj.style.height=document.documentElement.clientHeight*2+'px';		
	obj.style.opacity=0;
	obj.style.filter='alpha(opacity:0)';
	
	bind(bt,'mousedown',fn);
	function fn(){		
		oBody.style.overflowY='hidden';
		obj.style.display='block';
		for(attr in json1){		
			css(obj1,attr,json1[attr]);
		}		
		tweenMove(t,obj,{'opacity':100},moveType,function(){
			tweenMove(t1,obj1,json,moveType);
		});
		Fn&&Fn.call(bt);
	};
	
	bind(obj,'mousedown',fn2);
	function fn2(ev){
		var ev=ev||event;
		var iTop=ev.clientY;
	
		bind(obj,'mouseup',fn1);
		function fn1(ev){
			var ev=ev||event;
			var iDis=ev.clientY-iTop;
			if(ev.target==obj&&Math.abs(iDis)==0){
				tweenMove(t1,obj1,json1,moveType,function(){
					tweenMove(t,obj,{'opacity':0},moveType,function(){
						obj.style.display='none';
						oBody.style.overflowY='auto';
					});					
				});		
			}						
		};
	};		
	
	bind(obj,'mousemove',fix);
	function fix(ev){
		var ev=ev||event;
		ev.preventDefault();
	};		
};

//简单显示隐藏选项卡插件
//obj（选项卡控制按钮）
//obj1（选项卡显示隐藏的一组节点）
//styleClass（选项卡选中高亮的class名称）
function tab(obj,obj1,styleClass){
	for(var i=0;i<obj.length;i++){
		bind(obj[i],'touchend',fn);
	}
	function fn(){		
		for(var i=0;i<obj.length;i++){
			obj[i].classList.remove(styleClass);
			obj1[i].style.display='none';
			obj[i].index=i;
		}
		obj[this.index].classList.add(styleClass);
		obj1[this.index].style.display='block';
	};
};

//全选插件
//obj（全选按钮）
//obj1（所有选项的元素集合）
function allChecked(obj,obj1){
	bind(obj,'change',fn);
	function fn(){
		if(obj.checked==true){
			for(var i=0;i<obj1.length;i++){
				obj1[i].checked=true;
			}
		}else{
			for(var i=0;i<obj1.length;i++){
				obj1[i].checked=false;
			}
		}			
	};
	
	for(var i=0;i<obj1.length;i++){
		bind(obj1[i],'change',fn1);
	}
	fn1();
	function fn1(){
		for(var i=0;i<obj1.length;i++){
			if(obj1[i].checked==false){
				obj.checked=false;
				return;	
			}
			obj.checked=true;
		}
	};
};	

//回到顶部插件
//obj（回到顶部按钮）
//showPos（按钮出现的位置），pos（点击按钮后回到的位置）
//msec（定时器发生频率单位毫秒），dis（滚动一次的距离）
function goTop(obj,showPos,pos,msec,dis){
	var oScrollTop=0;
	var timer=null;
	var onOff=false;
	
	document.onscroll=function(){
		oScrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		var oDisplay=getStyle(obj,'display');
		
		if(oScrollTop>showPos){
			if(oDisplay=='none'){
				obj.style.display='block';
				obj.style.opacity='0';
				obj.style.filter='alpha(opacity:0)';
				allMove(300,obj,{'opacity':100},'linear');	
			}			
		}else{
			if(oDisplay=='block'){
				if(onOff)return;
				onOff=true;
				obj.style.opacity='100';
				obj.style.filter='alpha(opacity:100)';
				allMove(300,obj,{'opacity':0},'linear',function(){
					obj.style.display='none';
					onOff=false;
				});		
			}	
		}
	};
	
	bind(obj,'touchend',fn);
	function fn(){
		unBind(obj,'touchend',fn);
		clearInterval(timer);
		timer=setInterval(function(){
			var outcome=oScrollTop-dis;
			
			if(outcome<pos)outcome=pos;
			document.documentElement.scrollTop=document.body.scrollTop=outcome;
			if(oScrollTop<=pos){
				clearInterval(timer);
				bind(obj,'touchend',fn);
			}
		},msec);
	};
};

//label自定义样式绑定单选框插件（配合样式）
//obj（一组label标签的元素）
//classStyle（切换后的active样式）
//注意：label标签里面必须要有元素，而且块状化才能支持宽高
function labelFor(obj,classStyle){
	for(var i=0;i<obj.length;i++){
		obj[i].onchange=function(){
			for(var i=0;i<obj.length;i++){
				obj[i].classList.remove(classStyle);
			}
			
			if(this.children[0].checked){
				this.classList.add(classStyle);
			}
		};
	}
};

//label自定义样式绑定复选框框插件（配合样式）
function labelFor1(obj,classStyle){
	for(var i=0;i<obj.length;i++){
		obj[i].onchange=function(){
			this.children[0].checked?this.classList.add(classStyle):this.classList.remove(classStyle);
		};
	}
};

//手机无缝滚动插件（可以不给左右按钮）
//obj（滚动的父容器）
//msec（定时器发生频率单位毫秒），dis（滚动一次的距离）
//lB,rB（左右按钮，可以暂定和控制滚动方向）
function autoplay1(obj,mses,dis,lB,rB){
	var oLi=obj.children;
	var iW=oLi[0].offsetWidth;
	var timer=null;
	
	obj.innerHTML+=obj.innerHTML;
	obj.style.width=oLi[0].offsetWidth*oLi.length+'px';
	fn();
	function fn(){
		timer=setInterval(function(){	
			if(obj.offsetLeft<-obj.offsetWidth/2){
				obj.style.left=0+'px';
			}else if(obj.offsetLeft>0){
				obj.style.left=-obj.offsetWidth/2+'px';
			}
			obj.style.left=obj.offsetLeft+dis+'px';
		},mses);
	};	
			
	if(lB&&rB){
		bind(lB,'touchend',fn1);
		function fn1(){
			dis=-Math.abs(dis);
			fn3();
		};
		bind(rB,'touchend',fn2);
		function fn2(){
			dis=Math.abs(dis);
			fn3();
		};
	}	
	function fn3(){
		if(timer){
			clearInterval(timer);
			timer=null;
		}else{
			fn();
		}
	};
};

//电脑无缝滚动插件
//obj(轮播的父容器)
//prev(上一张的按钮)
//next(下一张的按钮)
//moveType(运动形式)
//t(轮播的间隔时间)
//t1(轮播一次的时间)
function autoplay2(obj,prev,next,moveType,t,t1){
	var oLi=obj.children;
	var iW=oLi[0].offsetWidth;
	var iNow=0;
	var over=false;
	var timer=null;
		
	obj.innerHTML+=obj.innerHTML;
	obj.style.width=oLi.length*iW+'px';
	prev.onclick=function(){
		if(over)return;
		over=true;
		iNow++;
		fn();
	};
	next.onclick=function(){
		if(over)return;
		over=true;
		iNow--;
		fn();		
	};
	obj.onmouseover=prev.onmouseover=next.onmouseover=function(){
		clearInterval(timer);
	};
	obj.onmouseout=prev.onmouseout=next.onmouseout=function(){
		fn1();
	};
	
	fn1();
	function fn1(){
		clearInterval(timer);
		timer=setInterval(prev.onclick,t);
	};
	function fn(){
		if(iNow>oLi.length/2){
			iNow%=oLi.length/2;
			css(obj,'translateX',0);
		}else if(iNow<0){
			iNow=oLi.length/2-1;
			css(obj,'translateX',-iW*oLi.length/2);							
		}
		tweenMove(t1,obj,{'translateX':-iW*iNow},moveType,function(){
			over=false;
		});
	};
};

//提示框插件
//str（提示的字符串）
//msec（提示框消失的时间）
function alert1(str,msec){
	var oQ=document.createElement('q');
	var msec=msec||1000;
	
	oQ.style.cssText='position:fixed; top:100px; left:50%; margin-left:-75px; min-width:140px; max-width:100%; height:50px; text-align:center; line-height:50px; padding:0 20px; border-radius:10px; box-sizing:border-box; background:rgba(0,0,0,0.6); color:#fff; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';
	oQ.innerHTML=str;
	document.body.appendChild(oQ);

	oQ.style.marginLeft=-oQ.offsetWidth/2+'px';
	setTimeout(function(){
		document.body.removeChild(oQ);
	},msec);
};

//导航栏滑动插件
//obj（要滑动的容器）
//styleClass（高亮选中样式的类名）
//moveType（滑动的运动形式）
//t（每次滑动到达目标的运动时间）
function slide(obj,styleClass,moveType,t){
	var oA=obj.children;
	var iW=oA[0].offsetWidth;
	
	obj.style.width=iW*oA.length+'px';
	for(var i=0;i<oA.length;i++){
		oA[i].style.width=iW+'px';
	}
	var iMin=-(obj.offsetWidth-document.documentElement.clientWidth);
	
	for(var i=0;i<oA.length;i++){
		if(oA[i].className==styleClass){
			var iNowLeft=-oA[i].offsetLeft;
			
			if(iNowLeft<iMin)iNowLeft=iMin;
			tweenMove(t,obj,{'translateX':iNowLeft},moveType);
		}
	}
	bind(obj,'touchstart',fn);
	function fn(ev){
		var ev=ev||event;
		var iLeft=ev.changedTouches[0].pageX-css(obj,'translateX');
		
		bind(obj,'touchmove',fn1);
		function fn1(ev){
			var ev=ev||event;
			var iDis=ev.changedTouches[0].pageX-iLeft;
			
			if(iDis>0)iDis=0;
			if(iDis<iMin)iDis=iMin;
			tweenMove(t,obj,{'translateX':iDis},moveType);
		};		
	};
	bind(obj,'touchmove',fix);
	function fix(ev){
		var ev=ev||event;
		ev.preventDefault();
	};
};

//模拟水印效果插件
//msec(水印运动的频率)
//obj(产生水印效果的容器)
//iDis(水印每步运动的距离)
//color(水印的颜色)
//color1(水印背景颜色)
//endFn(回调函数用来触发链接)
/*配置waterWave(20,oLi,5,'#ddd','#eee');*/
function waterWave(msec,obj,iDis,color,color1,endFn){	
	var timer=null;
	var timer1=null;
	var iLeft=0;
	var iTop=0;
	var iNum1=0;
	var iNum2=0;
	var iDate=0;
	var click=false;
	
	bind(obj,'touchstart',fn1);	
	function fn1(ev){
		clearInterval(timer);
		var ev=ev||event;
		click=false;
		
		iNum1=0;
		iNum2=0;		
		iLeft=ev.changedTouches[0].pageX-getPos(obj,'left');
		iTop=ev.changedTouches[0].pageY-getPos(obj,'top')-50;

		timer=setInterval(function(){							
			iNum1+=iDis;		
			obj.style.background='radial-gradient(circle at '+iLeft+'px '+iTop+'px,'+color+' '+(iNum1)+'%, #eee 0%) no-repeat ';	
			if(iNum1>=100){
				clearInterval(timer);
				setTimeout(function(){
					obj.style.background='none';
				},1000);
			}
		},msec);

		bind(obj,'contextmenu',fix);
	};
	
	bind(obj,'touchmove',function(){
		clearInterval(timer);
		obj.style.background='none';
	});
	
	bind(obj,'touchend',fn2);	
	function fn2(){
		clearInterval(timer);
		clearInterval(timer1);	
		iNum2=100-iNum1;
		timer1=setInterval(function(){
			iNum1+=Math.floor(iNum2/5);	
			
			obj.style.background='radial-gradient(circle at '+iLeft+'px '+iTop+'px,'+color+' '+(iNum1)+'%, '+color1+' 0%) no-repeat ';	
			if(iNum1>=100){
				clearInterval(timer);
				clearInterval(timer1);	
				obj.style.background='none';
				if(click){
					setTimeout(function(){
						endFn&&endFn.call(obj);
					},50);								
				}
			}
		},20);	
	};	
	
	bind(obj,'click',function(){
		click=true;
		fn2();
	});
	
	function fix(ev){
		var ev=ev||event;
		ev.preventDefault();
	};
};

//Fly插件
//Fly插件参数设置参考 
var defaultSetting={  
	//要飞的元素，一般是每次点击创建并定义样式
	obj: null,  
	//起点位置			
	startOffset: [0, 0],	
	//起点元素，这时就会自动获取该元素的left、top，设置了这个参数，startOffset将失效  
	startObj: this,		
	//终点位置  			
	endOffset: [0, 0],  
	//终点元素，这时就会自动获取该元素的left、top，设置了这个参数，endOffset将失效  
	targetObj: null,  
	//运动的时间，默认500毫秒  
	duration: 500,  
	//抛物线曲率，就是弯曲的程度，越接近于0越像直线，默认0.001  
	curvature: 0.001,
	// 是否自动开始，默认为false  
	autostart: false,    
	//运动后执行的回调函数  
	callback: null,    
	//运动过程中执行的回调函数  
	stepCallback: null 
	//最后记得执行定时器
	//new Fly().start(); 
}; 
function Fly(options){  
	this.initialize(options);  
};  
Fly.prototype={  
	initialize:function(options){
		this.options=options;  
		var ops=this.options;
		 
		this.obj=ops.obj;  
		this.timerId=null;  		
		
		if(ops.startObj){
			this.ObjLeft=getPos(ops.startObj,'left');  
			this.ObjTop=getPos(ops.startObj,'top');  
		}else{
			this.ObjLeft=ops.startOffset[0];
			this.ObjTop=ops.startOffset[1];
		}
		//this.driftX X轴的偏移总量  
		//this.driftY Y轴的偏移总量  
		if(ops.targetObj){  
			this.driftX=getPos(ops.targetObj,'left')-this.ObjLeft;  
			this.driftY=getPos(ops.targetObj,'top')-this.ObjTop;  
		}else{  
			this.driftX=ops.endOffset[0];  
			this.driftY=ops.endOffset[1];  
		}
		
		this.duration=ops.duration?ops.duration:500;

		this.curvature=ops.curvature?ops.curvature:0.001;
		  
		// 根据两点坐标以及曲率确定运动曲线函数（也就是确定a, b的值）  
		//a=this.curvature  
		// 公式： y = a*x*x + b*x + c; 
		//因为经过(0, 0), 因此c = 0 
		// y = a * x*x + b*x; 
		// y1 = a * x1*x1 + b*x1; 
		// y2 = a * x2*x2 + b*x2; 
		// 利用第二个坐标： 
		// b = (y2+ a*x2*x2) / x2 
		this.b = ( this.driftY - this.curvature * this.driftX * this.driftX ) / this.driftX;    
		//自动开始  
		if(ops.autostart)this.start(); 
	},  

	domove:function(x,y){  		
		this.obj.style.position='absolute';
		this.obj.style.left=this.ObjLeft+x+'px';
		this.obj.style.top=this.ObjTop+y+'px';
		return this;  
	},  

	step:function(now){  
		var ops=this.options;  
		var x=0;
		var y=0;
		  
		if (now>this.end) {  
			x=this.driftX;  
			y=this.driftY;  
			this.domove(x, y);  
			this.stop();  
			ops.callback&&ops.callback.call(this);  
		} else {  
			//x 每一步的X轴的位置  
			x=this.driftX*( (now-this.begin)/this.duration);  
			//每一步的Y轴的位置y = a*x*x + b*x + c;   c==0;  
			y=this.curvature*x*x + this.b*x;  

			this.domove(x,y);   
			ops.stepCallback&&ops.stepCallback.call(this,x,y);  
		}  
		return this;  
	},  
	
	start:function(){  
		var This=this;  
		// 设置起止时间  
		this.begin=+new Date();  
		this.end=this.begin+this.duration;
		
		// 原地踏步就别浪费性能了  
		if(this.driftX==0&&this.driftY==0)return; 
		
		if(this.timerId){  
			clearInterval(this.timerId);  
			this.stop();  
		}  
		this.timerId=setInterval(function(){  
			var t=+new Date();  
			This.step(t);  
		},10);  
		return this;  
	},  

	reset:function (x,y){  
		this.stop();  
		x = x ? x : 0;  
		y = y ? y : 0;  
		this.domove(x,y);  
		return this;  
	},  
	
	stop:function(){  
		if (this.timerId)clearInterval(this.timerId);  
		return this;  
	}  
};  
 


//懒加载插件(图片无地址时)
//img(页面上需要懒加载图片的集合))
//dataSrc(后台调的路径)
//dis(页面滚动到距离图片多少开始加载，默认0
function lazyLoading(img,dataSrc,dis){
	var dis=dis||0;
	
	document.onscroll=fn;
	fn();
	function fn(){
		var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		var dH=document.documentElement.clientHeight+scrollTop;
		var lH=0;
		var index=0;
		
		for(var i=0;i<img.length;i++){
			lH=getPos(img[i],'top');
			if(dH>lH-dis){
				index=i;				
			}
		}
		for(var i=0;i<index+1;i++){
			img[i].src=img[i].getAttribute(dataSrc);
		}
	};
};

//懒加载插件(图片有地址时)
//img(页面上需要懒加载图片的集合)
//dis(页面滚动到距离图片多少开始加载，默认0)
function lazyLoading1(img,dis){
	var dis=dis||0;
	
	for(var i=0;i<img.length;i++){
		img[i].setAttribute('dataSrc',img[i].src);
		img[i].src='';
	}
	document.onscroll=fn;
	fn();
	function fn(){
		var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		var dH=document.documentElement.clientHeight+scrollTop;
		var lH=0;
		var index=0;
		
		for(var i=0;i<img.length;i++){				
			lH=getPos(img[i],'top');
			if(dH>lH-dis){
				index=i;				
			}
		}
		for(var i=0;i<index+1;i++){
			img[i].src=img[i].getAttribute('dataSrc');
		}
	};
};

//ajax
function ajax(method,url,data,success){
	var xhr=null;
	try{
		xhr=new XMLHttpRequest();
	} catch(e){
		xhr=new ActiveXObject('Microsoft.XMLHTTP');
	}	
	if (method=='get'&&data)url+='?'+data;
	xhr.open(method,url,true);
	if(method=='get'){
		xhr.send();
	}else{
		xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
		xhr.send(data);
	}
	
	xhr.onreadystatechange=function(){	
		if(xhr.readyState==4){
			xhr.status==200?success&&success(xhr.responseText):console.log('出错了,Err'+xhr.status);
		}	
	}
};

//obj（存放加载列表元素的父容器）
//url（定义好echo json格式字符串的php文件）
//page（所有页的数据，问号后面到=iNum前面的一串字符）
//dis（下拉时滚动条与底部的距离数值为多少开始加载）
//endFn（没有数据时的返还函数）
function ajaxLoad(obj,url,page,dis,endFn){
	var aLi=obj.children;
	var iNum=0;
	var over=true;
	
	//初始化数据处理
	getList();	
	function getList(){
		ajax('get',url,page+'='+iNum,function(data){	
			var data=JSON.parse(data);
			//console.log(data);
			
			if(!data.length ){
				//后续没有数据了
				endFn&&endFn.call(obj);
				return;
			}		
			for (var i=0;i<data.length;i++){				
				//获取高度最短的li
				var _index=getShort();
				
				//瀑布流写法
				/*var oDiv=document.createElement('div');

				oDiv.innerHTML+='<a href="'+data[i].url+'"><img src="'+data[i].image+'"/><p>'+data[i].title+'</p>';	
				aLi[_index].appendChild(oDiv);*/	
				
				//普通写法
				obj.innerHTML+='<li><a href="'+data[i].url+'"><img src="'+data[i].img+'"/><div><h3>'+data[i].title+'</h3><p>'+data[i].time+'</p></div></a></li>';
			}	
			over=true;	
		});
	};
	
	document.onscroll=function(){	
		var _index=getShort();
		var oLi=aLi[_index];	
		var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		var dH=document.documentElement.clientHeight+scrollTop;
		var lH=oLi.offsetHeight+getPos(oLi,'top');

		if (dH>lH-dis){		
			if (over){
				over=false;
				iNum++;
				getList();
			}	
		}	
	};
	
	//获取最短li的索引值
	function getShort(){
		var index=0;
		var ih=aLi[index].offsetHeight;
		for (var i=1;i<aLi.length;i++) {
			if(aLi[i].offsetHeight<ih) {
				index=i;
				ih=aLi[i].offsetHeight;
			}
		}
		return index;
	}
};

function promptBox(obj,evname,condition,str,msec){
	var over=false;
	
	bind(obj,evname,fn);
	function fn(){
		if(condition){
			if(over)return;
			over=true;
			var oQ=document.createElement('q');	
			
			oQ.style.cssText='position:fixed; top:100px; left:50%; margin-left:-75px; min-width:140px; max-width:100%; height:50px; text-align:center; line-height:50px; padding:0 20px; border-radius:10px; box-sizing:border-box; background:rgba(0,0,0,0.6); color:#fff; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';
			oQ.innerHTML=str;
			document.body.appendChild(oQ);
			oQ.style.marginLeft=-oQ.offsetWidth/2+'px';
			setTimeout(function(){
				document.body.removeChild(oQ);
				over=false;
			},msec);
		}		
	};
};

function promptBox1(condition,str,msec){
	var over=false;
	
	fn();
	function fn(){
		if(condition){
			if(over)return;
			over=true;
			var oQ=document.createElement('q');	
			
			oQ.style.cssText='position:fixed; top:100px; left:50%; margin-left:-75px; min-width:140px; max-width:100%; height:50px; text-align:center; line-height:50px; padding:0 20px; border-radius:10px; box-sizing:border-box; background:rgba(0,0,0,0.6); color:#fff; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';
			oQ.innerHTML=str;
			document.body.appendChild(oQ);
			oQ.style.marginLeft=-oQ.offsetWidth/2+'px';
			setTimeout(function(){
				document.body.removeChild(oQ);
				over=false;
			},msec);
		}		
	};
};

function alerts(str,msec){
	var oQ=document.createElement('q');
	var msec=msec||1000;
	oQ.style.cssText='position:fixed; top:100px; left:50%; margin-left:-75px; min-width:140px; max-width:100%; height:50px; text-align:center; line-height:50px; padding:0 20px; border-radius:10px; box-sizing:border-box; background:rgba(0,0,0,0.6); color:#fff; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';
	oQ.innerHTML = str;
	document.body.appendChild(oQ);
	oQ.style.marginLeft=-oQ.offsetWidth/2+'px';
	setTimeout(function(){
		document.body.removeChild(oQ);
	},msec);
};
