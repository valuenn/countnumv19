<script>

	export default {
		onLaunch: function() {
			console.log('App Launch')
			
		},
		
		onShow: function() {
			console.log('App Show')
		
		},
		
		onHide: function() {
			console.log('App Hide')

		},
		
		onError: function(error) {
			console.error('全局错误捕获:', error)
			// 可以在这里添加错误上报逻辑
		},
		
		onPageNotFound: function(res) {
			console.warn('页面不存在:', res)
			// 重定向到首页
			uni.redirectTo({
				url: '/pages/index/index'
			})
		}
	}
</script>

<style lang="scss">
	  body {
	  	background-color: #ffffff;
	  	font-size: 28rpx;
		color:'#080808';
	  	font-family: Helvetica Neue, Helvetica, sans-serif;
	    -webkit-tap-highlight-color: rgba(0,0,0,0);
	  }
	  
	  view,
	  scroll-view,
	  swiper,
	  button,
	  input,
	  textarea,
	  label,
	  navigator,
	  image {
	  	box-sizing: border-box;
		font-size: 28rpx;
	  }
	  
	  button::after {
	  	border: none;
	  }
	  .myButton {
		  position: relative;
		  display: inline-flex;
		  align-items: center;
		  justify-content: center;
		  box-sizing: border-box;
		  line-height: 1;
		  text-align: center;
		  text-decoration: none;
		  overflow: visible;
		  transform: translate(0rpx, 0rpx);
		  border-radius: 12rpx;
		  margin: 0;
		  font-size: 28rpx;
		  height: 64rpx;
		  padding:30rpx 0;
		  font-weight: bold;
		  background-color: #f4f4f4;
	  }
	  .extra {
		  color: #78909c;
		  font-size: 24rpx;
	  }
</style>

