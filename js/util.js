;
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth
            if (!clientWidth) return
            if (clientWidth > 640) {
                clientWidth = 640
            }
            docEl.style.fontSize = 100 * (clientWidth / 640) + 'px'
        }

    recalc()

    if (!doc.addEventListener) return
    win.addEventListener(resizeEvt, recalc, false)
})(document, window)

// 工具类
var util = {
    setWxShare: function (option) {
        // 获取微信配置信息
        getJsApiconfig()

        var share = function (option) {

            // 微信分享配置
            var title = option.title || '', // 分享标题
                desc = option.desc || '', // 分享描述
                link = option.link || '', // 分享链接
                imgUrl = option.imgUrl || '', // 图片URL
                success = option.success || function () { }, // 成功回调
                cancel = option.cancel || function () { } // 取消回调

            // 分享到朋友圈
            wx.onMenuShareTimeline({
                'title': title,
                'desc': desc,
                'link': link,
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            })

            // 分享给朋友
            wx.onMenuShareAppMessage({
                'title': title,
                'desc': desc,
                'link': link,
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
                'link': link,
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            })

            // 分享到腾讯微博
            wx.onMenuShareWeibo({
                'title': title,
                'desc': desc,
                'link': link,
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            })

            // 分享到QQ空间
            wx.onMenuShareQZone({
                'title': title,
                'desc': desc,
                'link': link,
                'imgUrl': imgUrl,
                'success': success,
                'cancel': cancel
            })
        }

        wx.ready(function () {
            share(option)
        })
    },
    getSearchObject: function () {
        // 获取查询字符串
        var href = location.href,
            arr = null,
            temp = null,
            i = 0,
            result = {}

        if (href.indexOf('?') != -1) {
            href = href.substr(href.indexOf('?') + 1)
            arr = href.split('&')
            for (; i < arr.length; i++) {
                temp = arr[i].split('=')
                result[temp[0]] = temp[1]
            }
        }

        return result
    },
    tipStatus: function () {
        var tipStatusBg = $(".tipStatusBg");
        if (tipStatusBg.length == 0) {
            var tipStatus = '<div class="tipStatusBg" style="position: absolute;top: 0;width: 6.4rem;height: 100%;background-color: rgba(0,0,0,.5);z-index: 99999;">' +
                '<div class="tipStatus" style="width: 5.2rem;' +
                'min-height: 6.12rem;background-color: #fff9eb;border-radius: .22rem;position: absolute;left: 50%;' +
                'margin-left: -2.6rem;padding-bottom: .35rem;z-index: 0;"><img class="donkeyHeader" src="images/leo_tip_donkey_header.png" alt="" style="width: 3.97rem;' +
                'height: 2.51rem;position: absolute;left: 50%;top: -1.56rem;margin-left: -1.985rem;z-index: -1;"> <img class="tipClose" src="images/leo_tip_close.png" alt="" style="width: .52rem;' +
                'height: 1.1rem;position: absolute;top: -1.1rem;right: 0;"> <img src="images/leo_tip_top2.png" alt="" style="width: 5.2rem;' +
                'height: 1.01rem;position: relative;z-index: -2;"> <div style="width: 4.78rem;margin: .35rem auto 0 auto;font-size: .22rem;' +
                'color: #333;line-height: .4rem;text-align: justify;letter-spacing: -.01rem;"> <span style="color: #f54b31;">1.</span> 活动期间，向好友发[买买提乐购神券]，好友可领取100元神券，下单立减；<br> ' +
                '<span style="color: #f54b31;">2.</span> 神券有效期自领取之日起15天内有效；<br> <span style="color: #f54b31;">3.</span>' +
                ' 神券有效期内被推荐人仅能领取一次，神券失效后，可再次领取；<br> <span style="color: #f54b31;">4.</span>' +
                ' 被推荐人成功下单15天后，推荐人可获得50元现金奖励，奖金上不封顶；<br> <span style="color: #f54b31;">5.</span>' +
                ' 符合奖励条件的用户请提交[支付宝账号]，奖励现金每月1日、15日统一支付宝转账，如遇节假日奖金发放日期顺延；<br> ' +
                '<span style="color: #f54b31;">6.</span> 如有任何疑问请致电客服热线：400-998-7860；<br> <span style="color: #f54b31;">7.</span>' +
                ' 活动结束时间以官方公告为准。 </div><p style="text-align: center;font-size: .2rem;color: #808080;margin-top: .25rem;">买买提乐购享有本次活动最终解释权</p>' +
                '<a class="iSee" href="javascript:void(0)" style="width: 3rem;height: .8rem;line-height: .8rem;font-size: .32rem;' +
                'color: #fff;text-align: center;border-radius: .4rem;background-color: #f55031;display: block;margin: .2rem auto 0 auto;">' +
                '我知道了</a> </div> </div>';
            $("body").append(tipStatus);
            var tipStatusBg = $(".tipStatusBg");
            tipStatusBg.height($(document).height());
            var tip = $(".tipStatus");
            tip.css("top", $(document).scrollTop() + $(window).height() / 2 - (tip.height() - (156 * (document.documentElement.clientWidth / 640))) / 2);
            $(".tipClose,.iSee").click(function () {
                tipStatusBg.hide()
            });
        } else {
            var tip = $(".tipStatus");
            tipStatusBg.show();
            tip.css("top", $(document).scrollTop() + $(window).height() / 2 - (tip.height() - (156 * (document.documentElement.clientWidth / 640))) / 2);
        }
    }
}

// 来源渠道设置
; (function () {
    var channel = ""
    if (!$.cookie('channel')) {
        channel = util.getSearchObject()['channel']
        if (channel) {
            $.cookie('channel', channel, { expires: 7, path: '/' })
        }
    }
})()

// 广告位设置
; (function () {
	var adPosition = "";
    if (!$.cookie('adPosition')) {
        adPosition = util.getSearchObject()['item']
        if (adPosition) {
            $.cookie('adPosition', adPosition, { expires: 7, path: '/' })
        }
    }
})()

// 设置活动id
/*; (function () {
    if (!$.cookie('activityId')) {
        $.cookie('activityId', 'week', { expires: 7, path: '/' })
    }
})()*/
