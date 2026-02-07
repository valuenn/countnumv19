<template>
	<view style="margin-left:30rpx; margin-right: 30rpx;">
		<view style="margin-top:30rpx">		
		<view style="display: flex;justify-content: space-between;margin-bottom: 30rpx;">
			 
		<button class="myButton" open-type="contact" style="width: 26%;background-color: #85FFD7;">
				联系我们
		 </button>	
		<button class="myButton" @click="toHistory" style="width: 26%;">
				历史记录
		 </button>	

		 <button class="myButton" @click="checkAI" style="width: 26%;background-color: #FFF420;">
		 		AI率检测
		  </button>
		</view>

	  <view style="display:flex;margin-bottom:20rpx;justify-content: space-between;align-items: center;">
	            <view style="font-weight: bold;">
	             <span class="yellowBg" style="margin-right: 20rpx;">方式一.</span> 输入中英文查字数    
	          </view>
	  		<view class="extra" @click="clearText">
	  		  清空内容
	  		</view>
	        </view>
	        
		<view style="border-radius: 10rpx;margin-bottom:30rpx;background-color: #F8F7F8;">
		  <textarea maxlength="-1" style="z-index: 99999;  height:186rpx; padding:23rpx; width: 100%;" :value="contentTxt" @input="inputHandle" placeholder="请输入中英文,然后点击'开始统计字数'哈~" placeholder-style="color:#AAAAAA"></textarea>
		</view>	
			<view style="display:flex;margin-bottom:20rpx;justify-content: space-between;align-items: center;">
			     <view style="font-weight: bold;">
			       <span class="yellowBg" style="margin-right:20rpx;">方式二.</span> 统计图片里的中英文字数         
					</view>
		
					<view class="extra" @click="clear">
					  清空图片
					</view>
			 </view>
			 
			 <view v-if="image!==''" style="width: 40vw;position: relative;">
			 <image :src="image" mode="widthFix" style="width: 40vw; border-radius: 10rpx;"></image>

			<view class="progress" v-if="loadingImg" style="background: rgba(0, 0, 0, 0.39);">
				<view class="tn-margin-top-xl" style="margin-top: 50rpx;">正在加载中...</view>
			</view>
			 </view>
			 
			 <view @click="chooseImgCompress" style="border-radius: 10rpx;margin-bottom:30rpx;background-color:#F8F7F8;padding:30rpx;text-align: center;">
						  
			<view style="padding-bottom: 10rpx;padding-top: 15rpx;">
				<text style="font-weight: bold;">拍照/选图</text>
				<br/>
			</view>	
			<view class="extra" style="padding-bottom: 15rpx;">
				请保持文字为水平方向哈<br/>
			字迹清楚、图片清晰可提高识别率哈
			</view>
			
				
			 </view>
			 
			 <view style="margin-bottom:20rpx;">
			           <view>
			            <span class="yellowBg" style="font-weight: bold;">选择图片中的文字类型:</span>
			         </view>
			       </view>
			
			
				<view style="margin-bottom:30rpx">
				    <radio-group @change="handleChange" >
				      <radio v-for="(item, index) in ocrTypes" :value="item.name" :key="index" :checked="item.name === selectedType" style="margin-right: 12rpx">{{ item.name }}</radio>
				    </radio-group>
				</view>
			
						
			<view class="extra" style="margin-bottom: 10rpx;text-align: center;" v-if="image">下一步点击“开始统计字数”按钮</view>
			<view style="margin-bottom: 20rpx;text-align: center;">
				<button class="myButton" :disabled="loading || loadingImg" style="width: 50%;background-color: #85FFD7;padding:40rpx 0;" @click="clickConvert">
						{{loadingImg  ? "加载图片中哈" : "开始统计字数"}}
				 </button>
				 
			</view>
			

			
			<view class="extra" style="text-align: center;margin-bottom: 10rpx;">
				努力维持免费,请多担待广告哈</view> 		 

			<view class="extra" style="text-align: center;margin-bottom: 10rpx;">学生小伙伴们请忽略游戏广告哈，祝一身正气前程似锦！</view>
			 
			 
			</view>	 
			 <view >
				 <ad unit-id="adunit-dca36963176dec81" ad-type="video" ad-theme="white"></ad>
			  </view> 
		  <view v-if="loading" style="z-index: 9998; background-color: rgba(0, 0, 0, 0.5); width: 100vw; height: 100vh; position: fixed; top: 0; left: 0;"></view>
		  <ljs-loading v-if="loading">努力统计中~祝文思泉涌~下笔有神～八方正气~与人为善～朝气蓬勃～身心健康～开开心心～心想事成!</ljs-loading>
		  </view>
		  	
</template>

<script>
	const apiKeyOCRXF = process.uniEnv.xunfeiOCRHandKEY;
	const appIdOCRXF = process.uniEnv.xunfeiOCRAPPID
	const apiKeyBaidu = process.uniEnv.apiKey;
	const secretKeyBaidu = process.uniEnv.secretKey;

	import { countText,getToken } from '@/utils/textCounter.js'

	export default {
    name: 'Home',
		
		// 添加错误边界处理
		onErrorCaptured(err, vm, info) {
			console.error('首页错误捕获:', err, info)
			// 防止错误传播导致页面崩溃
			return false
		},
		
	  data() {
		return {
			chineseNum:0,
			englishNum:0,
			numberNum:0,
			punctuationNum:0,
			loading:false,
			totalString:"",
			loadingImg:false,
			image:'',
			base:"",
			contentTxt:'',
			accessToken:"",
			selectedType:"手写中文1",
			ocrTypes: [
				{
					name: "手写中文1",
				},
				{
					name: "手写中文2",
				},
				{
					name: "印刷文字｜手写英文",
				}
				],
			
        	}
		},
		
		

		methods: {
			
			handleChange(e) {
				this.selectedType = e.detail.value;
			},
			
			

	
			checkAI(){
				uni.navigateToMiniProgram({
					appId:"wx42dada4ff6fc276e",
					extraData:{
						txt: this.contentTxt
					},
					// envVersion: 'develop'
				})
			},
			
			toHistory(){
				uni.navigateTo({
					url:"/pagesResult/history/history"
				})	
			},
			

			  	
			tulingOCR(type){
				uni.request({
					url:"https://www.tulingyun.com/api/ocr",
					method:"POST",
					data:{
						token:"www.tulingyun.com",
						upfile_b64:this.base
					},
					success:(res) => {
						if (res.data && res.data.msg === "识别成功") {
							let finalString = ""
							let txtArray = res.data.text
							if (res.data.text && res.data.text.length > 0) {
								for (let t in res.data.text) {
									finalString = finalString + "  " + res.data.text[t]
								}
							}
							this.saveToHistory(finalString)
							
						} else {

							if (type == "hand") {
								this.xunfeiHandwriting()
							} else if (type == "general") {
								this.baiduBasic()
							} else if (type == "handEng") {
								this.baiduHandwritingOnly()
							}
						}
					},
					fail:(err) => {

						if (type == "hand") {
							this.xunfeiHandwriting()
						} else if (type == "general") {
							this.baiduBasic()
						} else if (type == "handEng") {
							this.baiduHandwritingOnly()
						}
						
					}
				})
			},	
							
			// 组装业务参数handwriting
			async getXParamStr(){
			  const CryptoJS = await import('crypto-js')
			  let xParam = {
			    language: 'cn|en'
			  }
			  return CryptoJS.default.enc.Base64.stringify(CryptoJS.default.enc.Utf8.parse(JSON.stringify(xParam)))
			},
			
						
			async xunfeiHandwriting() {
				let ts = Math.round(new Date().getTime()/1000)
				let xParamStr = await this.getXParamStr()
				const CryptoJS = await import('crypto-js')
				let xCheckSum = CryptoJS.default.MD5(apiKeyOCRXF + ts + xParamStr).toString()
				
				uni.request({
					url:"https://webapi.xfyun.cn/v1/service/v1/ocr/handwriting",
					method:"POST",
					timeout:360000,
					header:{
						'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
						'X-Appid': appIdOCRXF,
						'X-CurTime': ts,
						'X-Param': xParamStr,
						'X-CheckSum': xCheckSum
					},
					data:{
						image:this.base
					},
					success:(res) => {
						// console.log(res)
						if (res.data.code == "0") {
							let blocks = res.data.data.block
							let finalString = ""
							for (let block in blocks ) {
								let lines = blocks[block].line
								for (let l in lines) {
									let wordline = lines[l].word

									let aLine = ""
									for (let word in wordline) {
										aLine = aLine + wordline[word].content
									}
									finalString = finalString +  aLine + "  " 
									
								}
							}
							this.saveToHistory(finalString)

						} 
						
						else {
							 this.baiduHandwritingOnly()
							
						} 
					},
					fail:(err) => {
						this.baiduHandwritingOnly()
					}
				})
			},
			
			
			async xunfeiPrintNeat(type) {
				let ts = Math.round(new Date().getTime()/1000)
				let xParamStr = await this.getXParamStr()
				const CryptoJS = await import('crypto-js')
				let xCheckSum = CryptoJS.default.MD5(apiKeyOCRXF + ts + xParamStr).toString()
				uni.request({
					url:"https://webapi.xfyun.cn/v1/service/v1/ocr/general",
					method:"POST",
					timeout:360000,
					header:{
						'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
						'X-Appid': appIdOCRXF,
						'X-CurTime': ts,
						'X-Param': xParamStr,
						'X-CheckSum': xCheckSum
					},
					data:{
						image:this.base
					},
					success:(res) => {
						// console.log(res)
						if (res.data.code == "0") {
							let blocks = res.data.data.block
							let finalString = ""
							for (let block in blocks ) {
								let lines = blocks[block].line
								for (let l in lines) {
									let wordline = lines[l].word

									let aLine = ""
									for (let word in wordline) {
										aLine = aLine + wordline[word].content + ' '
									}
									finalString = finalString +  aLine + "  "

								}
							}
							this.saveToHistory(finalString)

						}

						 else {
							 this.tulingOCR(type)
						}
					},
					fail:(err) => {
						this.tulingOCR(type)	
					}
				})
			},
			
					
			
			chooseImgCompress(){

			this.image = ""
			this.base = ""
			this.loadingImg = true

				wx.chooseMedia({
					mediaType:['image'],
					sourceType:['album','camera'],
					count:1,
					success: async (res)=> {
						if (res.tempFiles.length > 0) {
						let tempPathRaw = res.tempFiles[0].tempFilePath
						this.image = tempPathRaw
						this.getFileBase64(tempPathRaw)

						}
					},
					fail:(err) => {
						this.loadingImg = false
						if (err.errMsg === "chooseMedia:fail cancel"){
						} else if (err.errno == "104") {
							// chooseMedia:fail privacy permission is not authorized
							uni.showModal({
								title: "同意隐私协议才能用图片文字识别数字数哈",
								content: `请重试并点击"同意"隐私协议哈`,
								success:(res) => {
									if (res.confirm) {
										uni.reLaunch({
											url:"/pages/index/index"
										})
									} else if (res.cancel){
										uni.reLaunch({
											url:"/pages/index/index"
										})
									}
								}
							})
						} else {
						uni.showModal({
							title: "选取图片有问题哈~",
							content: `可尝试把图片剪裁小一些哈，请清除小程序缓存哈，到微信"我"页面->选择"设置"->选择"通用"->选择"存储空间"清理缓存哈`,
						})
						  return
					}
					}
				})				
		},			

			getFileBase64(filePath){

				let realPath = wx.env.USER_DATA_PATH + '/' + new Date().getTime() + '.png'
					uni.getFileSystemManager().saveFile({
							tempFilePath: filePath,
							filePath:realPath,
							success: async (res) => {
								// console.log(res)
								if (res && res.savedFilePath) {
									this.image = res.savedFilePath
									var bitmap =uni.getFileSystemManager().readFile({
										filePath:res.savedFilePath,
										encoding:'base64',
										success: async (encodeRes) => {
											const CryptoJS = await import('crypto-js')
											this.base = encodeRes.data.toString(CryptoJS.default.enc.Utf8)
											this.loadingImg = false

										},
										fail:(encodeErr) => {
											this.loading = false
											this.loadingImg = false
											uni.showModal({
												title:"读图片有误哈",
												content:`请清除小程序缓存哈，到微信"我"页面->选择"设置"->选择"通用"->选择"存储空间"清理缓存哈`
											})
										}
									})
								} else {
									this.loading = false
									this.loadingImg = false
									uni.showModal({
										title:"保存图片有误哈",
										content:"请重试或选择其他图片哈"
									})
								}
							},
							fail:(saveErr) => {
								this.loading = false
								this.loadingImg = false
								uni.showModal({
									title:"保存图片有误哈",
									content:`请清除小程序缓存哈，到微信"我"页面->选择"设置"->选择"通用"->选择"存储空间"清理缓存哈，或重试选择图片哈`
								})
							},
						})
			},	
			
			
			async baiduBasic(){
				let t = await getToken(apiKeyBaidu, secretKeyBaidu)
				uni.request({
					url:`https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${t}`,
					data:{
						image:this.base,
						detect_direction: true
					 },
					method:"POST",
					header:{'content-type':'application/x-www-form-urlencoded'},
					success:(res)=>{
						if (res.data.words_result) {
						let raw = res.data.words_result
						let finalString = ""
						for (let i in raw) {
							finalString = finalString + raw[i].words + "  "
						}
						this.saveToHistory(finalString)
						
						} else {
							this.loading = false
							if (res.data.error_code == 216202) {
								uni.showModal({
									title: "抱歉有问题哈",
									content: res.data.error_msg + " 图片大小有问题哈，图片最短边至少15px，最长边最大4096px哈"
								})
							} else {
								uni.showModal({
									title: "抱歉有问题哈",
									content: res.data.error_msg
								})
							}
						}
					},
					fail:(err)=> {
						this.loading = false
						uni.showModal({
							title: "抱歉识别有问题哈",
							content: err.errMsg
						})	
						return
					}
				})					
			},
			
		
		async baiduHandwritingOnly(){
				let t = await getToken(apiKeyBaidu, secretKeyBaidu)
				uni.request({
					url:`https://aip.baidubce.com/rest/2.0/ocr/v1/handwriting?access_token=${t}`,	
					data:{
						image:this.base,
						detect_direction: true
					 },
					method:"POST",
					header:{'content-type':'application/x-www-form-urlencoded'},
					success:(res)=>{
						if (res.data.words_result) {
							
						let raw = res.data.words_result
						let finalString = ""
						for (let i in raw) {
							finalString = finalString + raw[i].words + "  "
						}
						this.saveToHistory(finalString)
						
						} else {

							this.loading = false
							if (res.data.error_code == 216202) {
								uni.showModal({
									title: "抱歉有问题哈",
									content: res.data.error_msg + " 图片大小有问题哈，图片最短边至少15px，最长边最大4096px哈"
								})
							} else {
								
							uni.showModal({
								title: "抱歉有问题哈",
								content: res.data.error_msg
							})
							}
							
						}
					},
					fail:(err)=> {						
						this.loading = false
						uni.showModal({
							title: "抱歉识别有问题哈",
							content: err.errMsg + "请稍后再试或联系我们~"
						})	
					}
				})		
		},
			
		
			inputHandle(e) {
				this.contentTxt = e.detail.value
			},
			clearText(){
				this.contentTxt = ""
			},
			
			
			async clickConvert(){

				this.loading = true


				if (this.image !== "" && this.contentTxt !== "") {
						this.loading = false
					  uni.showModal({
					  	title:"只能用一种输入哈",
						content:"清空文字或者删除图片哈"
					  })
					  return
				} 
				if (this.image === "" && this.contentTxt === ""){
						this.loading = false
					  uni.showModal({
					  	title:"请上传图片或输入文字哈"
					  })
					  return
				}

				if (this.contentTxt !== '') {
					this.countText()
				} else  {
				 
				 if (this.image !== '' && this.base !== '') {

						if (this.selectedType === "手写中文1") {
								this.tulingOCR("hand")
								
							} else if (this.selectedType === "手写中文2") {
								this.xunfeiHandwriting()
							} 
							
							else if (this.selectedType == "印刷文字｜手写英文") {
								this.xunfeiPrintNeat("general")
						} else {
							this.xunfeiPrintNeat("handEng")
						}

				} else {
					this.loading = false
					uni.showModal({
						title:"图片还在加载哈",
						content:"请等一下再点击哈"
					})
				} 
				}
				
			},	
					
    saveToHistory(oneData) {
		uni.setStorageSync("savedRes", oneData)
      const history = uni.getStorageSync('ocrHistory') || []
	  let id = Date.now()
      history.unshift({
        ocr: oneData,
        id: id
      })
	  this.countRes(oneData)
      if (history.length > 100) history.pop()
		
		// 先进行页面跳转
		this.loading = false
		uni.navigateTo({
			url:`/pagesResult/result/result?ch=${this.chineseNum}&en=${this.englishNum}&num=${this.numberNum}&pun=${this.punctuationNum}`
		})
		
		// 然后异步存储历史记录
		setTimeout(() => {
			uni.setStorage({
				key:"ocrHistory",
				data: history,
				success:(res) => {
					// 存储成功，不需要额外处理
				},
				fail:(err) => {
					// 存储失败，显示错误提示
					uni.showModal({
						title:"本地存储有问题哈",
						content:`请重试，尝试清理微信缓存或联系我们哈。${err.errMsg}`
					})
				}
			})
		}, 0)
    },	
					countRes(txt) {
				  const result = countText(txt)
				  this.chineseNum = result.chineseNum
				  this.numberNum = result.numberNum
				  this.englishNum = result.englishNum
				  this.punctuationNum = result.punctuationNum
				},
				


			
			countText(){
				this.saveToHistory(this.contentTxt) 
			},
				
	

		clear() {
			this.image = ""
			this.base = ""
			this.loadingImg = false
		},
		
		}
	}
</script>

<style lang="scss" scoped>
	.progress {
		position: absolute;
		top:50%;
		left:50%;
		transform: translate(-50%,-50%);
		width:40vw;
		height:100%;
		text-align:center;
		display:flex;
		justify-content:center;
		align-items:center;
		color:white
	}
	.yellowBg{
		background-color: #fff420;
		padding:8rpx;
		font-weight: bold;
		border-radius: 10rpx;
	}



</style>

