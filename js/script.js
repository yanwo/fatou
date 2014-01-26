(function($){
// JavaScript Document;
var $win = $(window);
var $doc = $(document);
var maxscale = 1 ,minscale = 1;
var $FF = $.browser.mozilla;
var $webkit = $.browser.webkit;
var $safari = $.browser.safari;
var $msie = $.browser.msie,$ie8 = $msie&&parseFloat($.browser.version)<9,$ie9 = $msie&&parseFloat($.browser.version)<=9;
var $winplatform = (navigator.platform.toLowerCase().indexOf("win")>-1)?true:false ;
var $ios = (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/));
var _w,_h,_iw=1000,_ih=600,_all=6790,_cur=0,_step=!$ios?30:15;
var $t = true;
var _am,_ao,_new;
$f = window.$f || {
	init:function(){
		var self = this;
		self.cssInit();
	},
	dirSlide:function(tars,dir,call){
			var size = $(tars).size(),cur = $(tars).index($(tars).filter('.current')),tar = cur+dir<0?size-1:cur+dir>=size?0:cur+dir;
			$(tars).eq(cur).stop().removeClass('current').css({left:"0%"}).animate({left:dir>0?'-100%':'100%'},750,function(){
				$(this).hide();
			});
			$(tars).eq(tar).stop().addClass('current').css({left:dir>0?'100%':'-100%',display:'block'}).animate({left:'0%',opacity:1},750,call);
	},
	slideRender:function(tar,f,t,dur,flag,c,dir){
		var $tar = $(tar),t_start = {'display':'block','z-index':1},t_end={},f_end={};
		t_start[!dir?'left':'top']=!!flag?(f>t?"100%":"-100%"):(f>t?"-100%":"100%");
		t_end[!dir?'left':'top']='0%';
		f_end[!dir?'left':'top']=!!flag?(f>t?"-100%":"100%"):(f>t?"100%":"-100%");

		$tar.eq(t).stop(true,false).trigger("slideIn").css(t_start).animate(t_end,dur,"easeOutSine",c);

		$tar.eq(f).stop(true,false).trigger("slideOut").css({"display":"block","z-index":0}).animate(f_end,dur+50,"easeOutSine",function(){
			$(this).hide();
			$(this).trigger("slideOutEnd");
			$(tar).eq(t).trigger("slideInEnd");
		});
		$tar.eq(f).removeClass("current");$tar.eq(t).addClass("current");
	},
	cssInit:function(){
		var _ = this;
		_.renderPoint();
	 },
	 
	//point
	renderPoint:function(){
		var _ = this,_tpl = '<a href="javascript:;" class="TM_point" style="left:{l}px;top:0px" data-year="{y}" data-left="{l}"><span class="TM_span"></span><img class="TM_cur" src="img/page_1/timeline/s.png"><span class="TM_text">{y}</span></a>';
		
		var $b = $('<div class="v3_points"></div>').appendTo($('#v3_body'));
		for(var i in _P){
			var o = _P[i];
			$b.append(_tpl.replace('{l}',o.x).replace(/{t}/g,o.y).replace('{y}',i));
			if(o.r){
				$b.children().last().addClass('R');
			}
		}
		var $b = $('#TM_points');
		var _S = 1915,_E = 1915 ,_W = $('#TM_drag').parent().width()-$('#TM_drag').width(), _C = 0 ,$TM = $('#TM_body'),$TMC = $('#timeline'),$drag = $('#TM_drag'),_blank = 40,_A = [];
		for(var i in _P){
			var o = _P[i];
			_A.push(i);
			$b.append(_tpl.replace(/{l}/g,(i-_S)*_blank).replace(/{t}/g,0).replace(/{y}/g,i));
			_E = i;
		}
		$b.width((_E-_S)*_blank);
		//points
		_.Ps = $b ;
		
		var $year = $('.v3_year'),$text = $('.v3_txt p'),_size = $('.TM_point').size(),$more = $('.v3_more');
		
		$('#TM_drag').draggable({
			axis:"x",containment:"parent",
			start:function(e){},
			drag:function(e){
				_C = _.pxToInt($(this).css('left'));
				var _R = _C/_W,_left = _R*($TM.outerWidth()-$TMC.width());
				$TM.css({left:-_left});
				var _r = _left+(_R)*$TMC.width()/2,_temp = Math.floor(_r/_blank)+_S,_i = _.findArrIndexEx(_A,_temp),_cur = _A[_i];
				if($year.data('index')!=_i){
					$('.TM_point').eq(_i).trigger('click',true);
				}
			},
			stop:function(e){}
		});
		
		
		$('.TM_point').bind('click',function(e,_nRender){
			var _y = $(this).data('year'),_temp = $year.data('index'),_i =$('.TM_point').index(this),_l=$(this).data('left');
			$year.data('index',_i);
			$('.TM_point').removeClass('current').trigger('currentOut');
			$(this).addClass('current').trigger('currentIn');
			if(!_nRender){
				var _r = (_y-_S)/(_E-_S);
				$TM.stop().animate({left:-(_l-$TMC.width()*_r/2)},350);
				$drag.stop().animate({left:_W*_r},350);
			}
			if(!!$E&&!!$E[_y]){
				var _t = $E[_y];
				$year.text(_y);
				$text.empty();
				if(!_.isObject(_t)){
					$text.append('<span>'+_t+'</span>');
					$more.hide();
					$year.data('o',0);
				}else{
					if(!_t.t)return;
					var _s = _t.s ,_a = _t.t;
					for(var i=0;i<_a.length;i++){
						$text.append('<span class="'+(_s==i?'':'hide')+'">'+_a[i]+'</span>');
					}
					$more.show();
					$year.data('o',1);
				}
			}
		}).bind('mouseenter',function(e){
			$(this).find('.TM_text').stop().css({'display':'block'}).animate({opacity:1,top:-85},750,'swing');
		}).bind('mouseleave',function(e){
			$(this).find('.TM_text').stop().animate({opacity:0,top:-76},750,'easeOutExpo',function(){
				$(this).css({display:'none'});
			});
		}).bind('currentIn',function(e){
			$(this).find('.TM_cur').css({visibility:'visible'}).css({width:33,height:44,left:-17,top:-15});
		}).bind('currentOut',function(e){
			$(this).find('.TM_cur').css({'visibility':'hidden',width:18,height:24,left:-9,top:-8});
		}).eq(0).trigger('click');
		$('.v3_btn').bind('click',function(){
			var _dir = !$('.v3_btn').index(this)?-1:1,_cur = $year.data('index'),_tar = _cur+_dir<0?_size-1:_cur+_dir>=_size?0:_cur+_dir;
			$('.TM_point').eq(_tar).trigger('click');
		})
		$('.v3_txt').bind('mouseenter',function(){
			$(this).find('.hide').stop(true,true).css({display:'block'}).animate({color:"#5d4809"},1200);
			$more.hide();	
		}).bind('mouseleave',function(){
			$(this).find('.hide').stop(true,true).css({color:'#ffd148',display:'none'});
			if(!!$year.data('o')){
				$more.show();
			}
		});
	},
	//tools 
	CSS3:function(a,b){
		var property = {};
		property[a]=property["-moz-"+a]=property["-webkit-"+a]=property["-ms-"+a]=property["-o-"+a]=b;
		return property;
	},
	pxToInt:function(str){
		return str.toString().indexOf("px")>-1?Math.round(parseFloat(str.split('px')[0])):str;
	},
	shuffleArray: function(arr){
		for(var j, x, i = arr.length; i; j = parseInt(Math.random()* i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
		return arr;
	},
	sizeOf:function(o){
		var counter = 0;for(var i in o)counter++;
		return counter;
	},
	objString:function(obj,f) {
		if(f == undefined){f = true;}
        var str = f?'{':'';for (var i in obj) {str += i + ':' + obj[i] + ';' ;}return str + (f?'}':'');
    },
	arraySuffix:function(arr,suff){
		for(var i=0;i<arr.length;/^-?\d+$/.test(arr[i])?arr[i]+=suff:arr[i]=arr[i],i++);
		return arr;
	},
	findArrIndex:function(_arr,reg){
		for(var i=0;i<_arr.length;i++){
			if(reg.test(_arr[i])){return i;}
		}
		return -1;
	},
	findArrIndexEx:function(_arr,val){
		var s = _arr.length;
		for(var i=0;i<_arr.length;i++){
			if(val==_arr[i]||(i+1<=s&&val<_arr[i+1])){return i;}
		}
		return -1;
	},
	TPL:function(template, data) {
	  return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
		var keys = key.split("."), v = data[keys.shift()];
		for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
		return (typeof v !== "undefined" && v !== null) ? v : "";
	  });
	},
	is: function(A, _) {
		var $ = Object.prototype.toString.call(_).slice(8, -1).toLowerCase();
		return _ !== undefined && _ !== null && $ === A.toLowerCase()
	},
	isObject:function(o){return this.is('object',o);},
	//cookie
	Ac : function(){
		var str = document.cookie ;
		//alert(unescape(str));
	},
	Sc : function(objName,objValue,objHours){
		var str = objName + "=" + escape(objValue);
		!!(objHours==undefined)&&(objHours=24);
		if(objHours > 0){
			var date = new Date();
			var ms = objHours*3600*1000;
			date.setTime(date.getTime() + ms);
			str += "; expires=" + date.toGMTString();
		}
		document.cookie = str;
	},
	Gc : function(objName){
		var arrStr = document.cookie.split("; ");
		for(var i = 0;i < arrStr.length;i ++){
			var temp = arrStr[i].split("=");
			if(temp[0] == objName) return unescape(decodeURIComponent(temp[1]));
		}
   	},
   	Dc:function(name){
		var date = new Date();
		date.setTime(date.getTime() - 10000);
		document.cookie = name + "=; expires=" + date.toGMTString();
   	}
};
function log(msg){
	if(!$t){return};
	if (window.console && window.console.log)
		window.console.log(msg);//+"|date:"+new Date().getTime()
	else if (window.opera && window.opera.postError)
		window.opera.postError(msg);
};
/*
window.requestAnimationFrame = (function(w, r) { 
	w['r'+r] = w['r'+r] || w['webkitR'+r] || w['mozR'+r] || w['msR'+r] || w['oR'+r] || function(c){ w.setTimeout(c, 100); };
	return w['r'+r];
})(window, 'equestAnimationFrame');
*/
(function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame =
  window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () { callback(currTime + timeToCall); },
	  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
} ());


var _TPL_0 = [{
			'url':'schedule',
			'tpl':'<li class="view_li"><a href="javascript:;" data-url="{link}" class="view_a news_a" title="{title}"><span class="news_title">{title}</span><div class="news_img"><img onload="resizeImg(this,234,142,\'.view\')"  src="{pic}"></div><span class="news_date">{date}</span><div class="view_text news_text"><p>{describe}</p></div></a></li>'
		},{
			'url':'news',
			'tpl':'<li class="view_li"><a href="javascript:;" data-url="{link}" class="view_a news_a" title="{title}"><span class="news_title">{title}</span><div class="news_img"><img onload="resizeImg(this,234,142,\'.view\')"  src="{pic}"></div><span class="news_date">{date}</span><div class="view_text news_text"><p>{describe}</p></div></a></li>'
		},{
			'url':'story',
			'tpl':'<li class="view_li"><a href="javascript:;" data-url="{link}" class="view_a active_a" title="{title}"><span class="active_title">{title}</span><div class="active_img"><img onload="resizeImg(this,234,172,\'.view\')"  src="{pic}"></div><div class="view_text active_text"><p>{describe}</p></div></a></li>'	
		},{
			'url':'video',
			'tpl':'<li class="view_li"><a href="javascript:;" data-url="{link}" class="view_a active_a" title="{title}"><span class="active_title">{title}</span><div class="active_img"><img onload="resizeImg(this,234,172,\'.view\')"  src="{pic}"></div><div class="view_text active_text"><p>{describe}</p></div></a></li>'	
		},{
			'url':'card',
			'tpl':'<li class="view_li"><a href="javascript:;" data-url="{link}" class="view_a active_a" title="{title}"><span class="active_title">{title}</span><div class="active_img"><img onload="resizeImg(this,234,172,\'.view\')"  src="{pic}"></div><div class="view_text active_text"><p>{describe}</p></div></a></li>'	
		},{
			'url':'q&a',
			'tpl':'<li class="view_li"><a href="javascript:;" class="view_a active_a QA_a" data-url="{link}" title="{title}"><span class="active_title">Q:{title}</span><div class="active_txt"><p title="点击查看更多">A:&nbsp;&nbsp;&nbsp;{describe}</p></div></a></li>'	
		},{
			'url':'join',
			'tpl':'<li class="view_li"><a href="javascript:;" data-url="{link}" class="view_a active_a" title="{title}"><span class="mytnc_title">{title}</span><div class="mytnc_img"><img onload="resizeImg(this,234,172,\'.view\')"  src="{pic}"></div><div class="view_text mytnc_text"><p>{describe}</p></div></a></li>'	
		}];
		/*,{
			'url':'lib',
			'tpl':'<li class="view_li"><a href="javascript:;" data-url="{link}" class="view_a active_a" title="{title}"><span class="active_title">{title}</span><div class="active_img"><img onload="resizeImg(this,234,172,\'.view\')"  src="{pic}"></div><div class="view_text active_text"><p>{describe}</p></div></a></li>'	
		}*/
var _URL = {
	'schedule':['/home/pageSchedule',''],//项目进度
	'news':['/home/pageNews',''],//媒体报道
	'story':['/home/pageStory',''],//图片故事
	'video':['/home/pageVideo',''],//影像记录
	'card':['/home/pageCard',''],//自然贺卡
	'q&a':['/home/pageAsk',''],//每周一问
	'join':['/home/pageActivity',''],
	'logout':['/home/logout','']
};
var _IFRAME = {
	tncMore:{view:'了解TNC',link:'/home/more/1'},
	tncChina:{view:'TNC在中国',sec:'查看更多',link:'http://test.qq.com/tnc/wwwroot/items.html'},
	tncWorld:{view:'TNC在全球',sec:'查看更多',link:'/home/more/39'},
	tncPlace:{view:'保护地',sec:'查看更多',link:'/home/more/41'},
	tncWater:{view:'淡水',sec:'查看更多',link:'/home/more/25'},
	tncFunc:{view:'保护科学',sec:'查看更多',link:'/home/more/11'},
	newpro:{view:'了解TNC',sec:'最新项目',link:'/home/latest',ul:'#fea_china'},
	oldpro:{view:'了解TNC',sec:'以往项目',link:'/home/past',ul:'#fea_china'},
	team:{view:'了解TNC',sec:'认识我们',link:'/home/aboutUs',ul:'#fea_china'},
	tncNA:{view:'TNC在全球',sec:'TNC在北美洲',link:'/home/more/52',ul:'#fea_world'},
	tncEU:{view:'TNC在全球',sec:'TNC在欧洲',link:'/home/more/53',ul:'#fea_world'},
	tncNAsia:{view:'TNC在全球',sec:'TNC在亚太',link:'/home/more/54',ul:'#fea_world'},
	tncCSea:{view:'TNC在全球',sec:'TNC在加勒比海',link:'/home/more/55',ul:'#fea_world'},
	tncCA:{view:'TNC在全球',sec:'TNC在中美洲',link:'/home/more/55',ul:'#fea_world'},
	tncAF:{view:'TNC在全球',sec:'TNC在非洲',link:'/home/more/56',ul:'#fea_world'},
	tncSA:{view:'TNC在全球',sec:'TNC在中南美洲',link:'/home/more/55',ul:'#fea_world'},
	tncAsia:{view:'TNC在全球',sec:'TNC在亚太区',link:'/home/more/54',ul:'#fea_world'},
	schedule:{view:'项目进度'},
	news:{view:'媒体报道'},
	story:{view:'图片故事'},
	video:{view:'影像记录'},
	card:{view:'自然贺卡'},
	'q&a':{view:'每周一问'},
	'lib':{view:'TNC阅览室'},
	'join':{view:'我要参加'},
	'message':{view:'我要留言'},
	'user':{view:'修改资料'},
	'hr':{view:'工作机会',link:'/home/hr'},
	'partner':{view:'合作伙伴',link:'/home/more/49'},
	'declare':{view:'法律声明',link:'/home/more/50'},
	'contact':{view:'联系我们',link:'/home/more/51'},
	'feeback':{view:'问题反馈',link:'feedback.html'}
};
var _P = {1915:{x:262,y:343},1917:{x:194,y:366,r:true},1926:{x:335,y:395},1946:{x:215,y:430,r:true},1950:{x:302,y:462},1951:{x:306,y:506,r:true},1954:{x:424,y:527},1955:{x:390,y:560,r:true},1961:{x:483,y:576},1965:{x:409,y:610,r:true},1966:{x:494,y:650},1970:{x:417,y:691,r:true},1974:{x:471,y:716},1980:{x:335,y:729,r:true},1988:{x:424,y:761},1989:{x:291,y:775,r:true},1990:{x:342,y:833},1991:{x:246,y:867,r:true},1994:{x:357,y:902},1995:{x:352,y:949,r:true},1998:{x:518,y:959},1999:{x:459,y:1001,r:true},2000:{x:627,y:1027},2001:{x:615,y:1081,r:true},2002:{x:878,y:1112},2003:{x:741,y:1151},2004:{x:559,y:1167,r:true},2005:{x:626,y:1204},2006:{x:522,y:1219,r:true},2007:{x:552,y:1256},2008:{x:421,y:1277,r:true},2009:{x:543,y:1327},2010:{x:478,y:1365,r:true},2011:{x:680,y:1393},2012:{x:644,y:1430,r:true},2013:{x:747,y:1464}};

$(document).ready(function(e){$f.init();});
})(jQuery);