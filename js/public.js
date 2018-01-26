/**
 * Created by zhujie on 2017/3/7.
 */
; (function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth > 660) {
                clientWidth = 660;
            }
            docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
        };

    recalc();
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    // doc.addEventListener('DOMContentLoaded', recalc, false);
    // fix by hengchuan 注释监听事件，防止页面多次重绘
})(document, window);


// 来源渠道设置
; (function () {
    var channel = ""
    if (!$.cookie('channel')) {
        channel = GetQueryString('channel');
        if (channel) {
            $.cookie('channel', channel, { expires: 7, path: '/' })
        }
    }
})()
/*
 * 功能：公共函数
 */
var publicClass = publicClass || {
    messageBox: null,
    getQueryStying: function (strname) {
        var reg = new RegExp("(^|&)" + strname + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
    },
    clearMessage: function () {
        if (this.messageBox != null) {
            $(this.messageBox).remove();
        }
    },
    showLoading: function (message) {
        this.clearMessage();
        this.messageBox = document.createElement("div");
        this.messageBox.className = className.messageboxTip;
        this.messageBox.innerHTML = "<img src=\"img/loading.gif\" alt=\"加载中...\" id=\"loding\" title=\"加载中...\"/>" + message;
        var top = Math.max($(".tablist").height() / 2, 10) + document.documentElement.scrollTop;
        var left = Math.max($(".tablist").width() / 2, 10) + document.documentElement.scrollLeft;
        this.messageBox.style.top = top + "px";
        this.messageBox.style.left = left + "px";
        this.messageBox.style.display = "block";
        $(document.body).append(this.messageBox);
    },
    goTop: function () {
        $("body,html").animate({
            scrollTop: 0
        }, 600);
        return false;
    },
    jqueryAjax: function (options) {
        try {
            var opt = options ? options : {};
            var callback = opt.callback ? opt.callback : "";
            var type = opt.type ? opt.type : "POST";
            $.ajax({
                type: type,
                dataType: "json",
                url: opt.url ? opt.url : "",
                data: opt.data ? opt.data : {},
                cache: false,
                success: function (jsonData) {
                    if (callback) {
                        var result = typeof (jsonData);
                        if (result == "string") {
                            jsonData = eval('(' + jsonData + ')');
                        }
                        callback(jsonData);
                    }
                },
                error: function (ex) {
                    if (window.console) {
                        console.log(ex);
                    }
                }
            });
        } catch (ex) {
            console.log(ex);
        }
    },
    rootPath: function () {
        var result;
        var localObj = window.location;
        var host = localObj.protocol + "//" + localObj.host;
        //针对IE8
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (elt /*, from*/) {
                var len = this.length >>> 0;
                var from = Number(arguments[1]) || 0;
                from = (from < 0) ? Math.ceil(from) : Math.floor(from);
                if (from < 0)
                    from += len;
                for (; from < len; from++) {
                    if (from in this &&
                        this[from] === elt)
                        return from;
                }
                return -1;
            };
        }

        if (host.indexOf(".com") > 0) {
            result = host;
        } else {
            //var contextPath = localObj.pathname.split("/")[1];
            var basePath = localObj.protocol + "//" + localObj.host;
            result = basePath;
        }

        return result;
    },
    setCookie: function (c_name, value, expiredays) {
        expiredays = expiredays == undefined ? 30 : expiredays;
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/;domain=" + window.location.host;
    },
    getCookie: function (c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return null;
    },
    isWeiXin: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    isMobile: function () {
        var ua = window.navigator.userAgent;
        var ismobile = (/mobile/i).test(ua);
        if (ismobile) {
            return ismobile;
        }
    },
    isPc: function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },
    /*
     * 参数说明：info:消息内容
     * "info":"" //消息内容,
     *  "title":"" //标题,
     *  "ok":function(){
     *     //确认后执行
     *  },
     *  "cancel":function(){
     *      //取消后执行
     *  }，
     *  "time":{"sec":5,//多少秒后消失
     *   "run":function(){
     *      //消失执行的事件
     * }}
     * */
    mmtPopUp: function (opt) {
        if (typeof (opt) == "object") {
            var info = opt["info"];
            var timeObj = null;
            var _height = Math.max($(document).height(), $('body').height()) + "px";
            var _bg = "<div id=\"msgshadeDiv\" class=\"shade_bg\" style=\"height:" + _height + "; display: block;\"></div>";
            var _msg = "<div id=\"msgContent\" class=\"pop-up\">";
            _msg += "<div class=\"p-content\">";
            _msg += "<div class=\"flo_right delete-bg\">";
            _msg += "<span class=\"delete-icon-logo\" id='msgClose'></span>";
            _msg += "</div>";
            _msg += "<h1 class=\"p-title\">" + (opt.title || '') + "</h1>";
            _msg += "<em>";
            _msg += info;
            _msg += "</em>";
            _msg += "</div>";
            _msg += "<div class=\"content-exp fgx-line\">";
            _msg += "<div class=\"btn-box\">";
            if (opt.hasOwnProperty("cancel")) {
                _msg += "<span id=\"msgCancel\" class=\"popup_btn_cancle\">取消</span>";
            }
            if (opt.hasOwnProperty("ok")) {
                _msg += "<span id='msgSave' class=\"popup_btn_save\">确认</span>";
            }
            _msg += "</div>";
            _msg += "</div>";
            _msg += "</div>";
            $(document.body).append(_bg + _msg);
            //  document.getElementById("msgshadeDiv").style.height = window.screen.height + "px";
            var left = ($(window).width() - $("#msgContent").width()) / 2;
            var top = ($(window).height() - $("#msgContent").height()) / 2;
            $("#msgContent").css({ "left": left, "top": top });
            if (opt.hasOwnProperty("cancel")) {
                if (typeof (opt["cancel"] == "function")) {
                    $("#msgCancel").unbind("click").bind("click", function () {
                        clearTimeout(timeObj);
                        opt["cancel"]();
                        $("#msgshadeDiv").remove();
                        $("#msgContent").remove();
                    });
                }
            }
            if (opt.hasOwnProperty("ok")) {
                if (typeof (opt["ok"] == "function")) {
                    $("#msgSave").unbind("click").bind("click", function () {
                        clearTimeout(timeObj);
                        opt["ok"]();
                        $("#msgshadeDiv").remove();
                        $("#msgContent").remove();
                    });

                }
            }
            if (opt.hasOwnProperty("cancel") && opt.hasOwnProperty("ok")) {
                $("#msgCancel").css({ "borderRight": "solid 1px #dddddd" });
                $(".btn-box").find("span").css({ "width": "50%" });
            }
            $("#msgClose").unbind("click").bind("click", function () {
                clearTimeout(timeObj);
                if (opt.hasOwnProperty("close")) {
                    if (typeof (opt["close"] == "function")) {
                        opt["close"]();
                    }
                }
                $("#msgshadeDiv").remove();
                $("#msgContent").remove();
            });
            $("#msgshadeDiv").show();
            $("#msgContent").show();
            if (opt["time"]) {
                var time = 0;
                var timeObj = setInterval(function () {
                    if (opt["time"].sec == time) {
                        $('#msgshadeDiv').remove();
                        $('#msgContent').remove();
                        if (opt["time"].run) {
                            opt["time"].run();
                        }
                    }
                    time++;
                }, 1000);
                timeObj = setTimeout(function () {
                    $("#msgSave").click();
                    if (opt["time"].run) {
                        opt["time"].run();
                    }
                }, opt["time"].sec * 1000);
            }
        }
    },
    setWxShare: function (option) {
        // 获取微信配置信息
        getJsApiconfig();
        var shareId = {
            pyq: 1,
            py: 2,
            qq: 3,
            txwb: 4,
            zone: 5
        };
        var share = function (option) {
            // 微信分享配置
            var title = option.title || '', // 分享标题
                desc = option.desc || '', // 分享描述
                link = option.link, // 分享链接
                imgUrl = option.imgUrl || '', // 图片URL
                success = option.success || function () { }, // 成功回调
                cancel = option.cancel || function () { }; // 取消回调
            var spm = option.spm ? option.spm : "";
            var createSpm = function (shareId) {
                var spmStart = '', spmEnd = '', linkUrl = '';
                if (spm != '' && spm != undefined) {
                    var index = option.shareIndex;
                    var strArr = option.spm.split(",");
                    for (var i = 0; i < strArr.length; i++) {
                        if (i < index - 1) {
                            spmStart += strArr[i] + ","
                        } else if (i >= index) {
                            if (i == 8) {
                                spmEnd += "1501,"
                            } else {
                                spmEnd += strArr[i] + ","
                            }
                        }
                    }
                }
                if (spmStart != '' && spmEnd != '') {
                    if(linkUrl.indexOf("?") != -1){
                        linkUrl = link + "&spm=" + spmStart + shareId + "," + spmEnd
                    }else{
                        linkUrl = link + "?spm=" + spmStart + shareId + "," + spmEnd
                    }
                } else {
                    linkUrl = link;
                }
                return linkUrl;
            }
            // 分享到朋友圈
            wx.onMenuShareTimeline({
                'title': title,
                'desc': desc,
                'link': createSpm(shareId.pyq),
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            })

            // 分享给朋友
            wx.onMenuShareAppMessage({
                'title': title,
                'desc': desc,
                'link': createSpm(shareId.py),
                'imgUrl': imgUrl,
                'type': '', // 分享类型,music、video或link，不填默认为link
                'dataUrl': '', // 如果type是music或video，则要提供数据链接，默认为空
                'success': success,
                'cancel': cancel
            })

            // 分享到QQ
            wx.onMenuShareQQ({
                'title': title,
                'desc': desc,
                'link': createSpm(shareId.qq),
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            })

            // 分享到腾讯微博
            wx.onMenuShareWeibo({
                'title': title,
                'desc': desc,
                'link': createSpm(shareId.txwb),
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            })

            // 分享到QQ空间
            wx.onMenuShareQZone({
                'title': title,
                'desc': desc,
                'link': createSpm(shareId.zone),
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            });
        }

        wx.ready(function () {
            share(option);
        });
    }
}

/*
     功能：消息提示框
     参数说明：msg 提示信息
     flag:两个参数（yes,no）
     foo：返回函数
     isClose：是否关闭
  */
// var showTit = (function($, w) {
//     return function(msg, flag, foo, isClose) {
//         var isClose = isClose || "true",
//             icon = "success_result";
//         if (flag == "no") icon = "err_result"; //no的样式
//         if ($("#shadeBg").length <= 0) {
//             $(document.body).append("<div id=\"shadeBg\" class=\"shade_bg\"></div>");
//         }
//         $("#successInfor").remove();
//         var tipMsg = $("<div class=\"public_result_div\" id=\"successInfor\"><span class=\"" + icon + "\">" + msg + "</span></div>");
//         $(document.body).append(tipMsg);
//         $("#shadeBg").height($(document).height());
//         var left = ($(window).width() - $("#successInfor").width()) / 2;
//         var top = ($(window).height() - $("#successInfor").height()) / 2;
//         $("#successInfor").css({ "left": left, "top": top });
//         $("#shadeBg").css({ "opacity": "0.4" }).fadeIn("fast");
//         $("#successInfor").fadeIn("fast");
//         w.titHide = function() {
//             if (isClose == "true") {
//                 $("#successInfor").fadeOut("fast");
//                 $("#shadeBg").fadeOut("fast");
//             }
//             if (foo) {
//                 foo();
//             }
//         };
//         setTimeout("titHide()", 1500);
//     };
// })(jQuery, window);

// 重写提示框，与app保持一致
function showTit(msg, status) {
    var html = '<div class="throw-tips-wrap" id="throwTipsWrap">\
                    <p>' + msg + '</p>\
                </div>';

    $('body').append(html);

    setTimeout(function () {
        $('#throwTipsWrap').remove();
    }, 1500)
}

// 表单序列化成对象
jQuery.prototype.serializeObject = function () {
    var obj = {};
    $.each(this.serializeArray(), function (index, param) {
        if (!(param.name in obj)) {
            obj[param.name] = param.value;
        }
    });
    return obj;
};
