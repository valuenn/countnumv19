export default {
	data() {
		return {
		}
	},
	    onLoad() {
	        uni.showShareMenu({
	            // 小程序的原生菜单中显示分享按钮，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
	            menus:["shareAppMessage","shareTimeline"] // 不设置默认发送给朋友
	        })
	    },
	onShareAppMessage(res){
		if (res.from === 'button'){
			console.log(res.target)
		}
		return {
			title: "图提取文字统计字数",
			path: '/pages/index/index',
			imageUrl:'/static/logo.png',
			content: '字数扫描器传图识字拍图识字ocr图片文字识别'
		}
	},
	onShareTimeline(){
		return {
			title: "图提取文字统计字数",
			path:'/pages/index/index',
			imageUrl:'/static/logo.png',
			content: '字数扫描器传图识字拍图识字ocr图片文字识别'
		}
	},
	
}