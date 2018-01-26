/*
 * create by Liang
 * 2017/8/15
 */
var freeAward = {
	init: function () {
		this.bindEvents();
	},
	
	bindEvents: function () {
		var self = this;
		//点击抽奖
		$('.pointerBtn').on('click',function () {
			self.awardRotate()
		})
	}
	
	//转盘
	,awardRotate: function (awardData) {
		var self = this;
		$('.award,.award-ring').rotate({
			angle:0,
            animateTo:1800+45*7,
            duration:5000,
            callback: function () {
            	self.awardRes(awardData)
            }
		})
	}
}
freeAward.init()
