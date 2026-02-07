<template>
	<view>
		<view :class="{ 'page-no-scroll': showEditPopup || showAggregatePopup || showAddCountPopup }">
		<!-- 编辑内容弹窗 -->
		<view v-if="showEditPopup" class="native-popup-mask" @click="handleMaskClick">
			<view class="native-popup-content" @click.stop>
				<view class="popup-header">
					<text class="popup-title">编辑内容</text>
					<text class="popup-close" @click="closeEditPopup">×</text>
				</view>
				
				<!-- 主要内容区域 -->
				<view class="popup-main-content">
					<view class="popup-content-wrapper">
						<view class="popup-input-container">
							<textarea maxlength="-1" class="popup-textarea" :value="totalString" @input="inputHandle"></textarea>
						</view>
					</view>
				</view>
				
				<!-- 底部固定区域（按钮 + 广告） -->
				<view class="popup-bottom-fixed">
					<!-- 确定按钮区域 -->
					<view class="popup-button-area">
						<button class="myButton popup-confirm-btn" @click="confirmEdit">
							确定编辑
						</button>
					</view>
					
					<!-- 广告区域 -->
					<view class="popup-ad-area">
					<ad unit-id="adunit-a3b3e7973140bd37" ad-type="video" ad-theme="white"></ad>
						
					</view>
				</view>
			</view>
		</view>

		<!-- 字频统计弹窗 -->
		<view v-if="showAggregatePopup" class="native-popup-mask" @click="handleMaskClick">
			<view class="native-popup-content" @click.stop>
				<view class="popup-header">
					<text class="popup-title">每个字出现的次数</text>
					<text class="popup-close" @click="closeAggregatePopup">×</text>
				</view>
				
				<!-- 主要内容区域 -->
				<view class="popup-main-content">
					<view class="popup-content-wrapper">
						<scroll-view class="popup-scroll-container" scroll-y>
							<!-- 按出现次数分组显示 -->
							<view v-for="(group, groupIndex) in groupedFrequencyData" :key="groupIndex" class="frequency-group">
								<view class="group-header">
									<text class="group-title">出现{{ group.count }}次的字</text>
									<text class="group-count">(共{{ group.items.length }}个)</text>
								</view>
								<view class="group-items">
									<view v-for="(item, itemIndex) in group.items" :key="itemIndex" 
										  class="frequency-item" :style="{'background-color': getBackgroundColor(group.count)}">
										<text>{{ item.number }}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				
				<!-- 广告区域 -->
				<view class="popup-ad-area">
					<ad unit-id="adunit-a3b3e7973140bd37" ad-type="video" ad-theme="white"></ad>

				</view>
			</view>
		</view>
		
		<!-- 数字求和弹窗 -->
		<view v-if="showAddCountPopup" class="native-popup-mask" @click="handleMaskClick">
			<view class="native-popup-content" @click.stop>
				<view class="popup-header">
					<text class="popup-title">数字相加求和结果是{{sum}}</text>
					<text class="popup-close" @click="closeAddCountPopup">×</text>
				</view>
				
				<!-- 主要内容区域 -->
				<view class="popup-main-content">
					<view class="popup-content-wrapper">
						<scroll-view class="popup-scroll-container" scroll-y>
							<view class="popup-text-content">{{numString}}</view>
						</scroll-view>
					</view>
				</view>
				
				<!-- 广告区域 -->
				<view class="popup-ad-area">
					<ad unit-id="adunit-a3b3e7973140bd37" ad-type="video" ad-theme="white"></ad>
									
				</view>
			</view>
		</view>
	
	<view style="margin: 30rpx">
		<view v-if="loading">努力统计字数中哈，稍等马上好啦</view>
		<view v-else>
          <view style="font-size: 32rpx; font-weight: bold; margin-bottom: 20rpx;">
           总字数{{total}}个，标点{{punctuationNum}}个
		</view>
		<view style="color:#78909C">总字数{{total}}个={{chineseNum}}个中文+{{englishNum}}个英语单词+{{numberNum}}个数字</view>

      </view>
	  
	  <!-- 主要内容区域 -->
	  <view class="result-content-area">
		  <view class="result-scroll-container">
			  <scroll-view class="result-scroll-view" scroll-y :scroll-top="scrollTop">
				  <view class="result-item" v-for="(item,index) in result" :key="index">
					  <text>{{item}}</text>
				  </view>
			  </scroll-view>
		  </view>
	  </view> 
</view>


      <!-- 底部固定区域（按钮 + 广告） -->  
      <view class="result-bottom-fixed">
			<view class="button-container">
		        <view class="button-item">
				   <button class="myButton copy-btn" @click="copy">
						复制内容
				    </button>	
		        </view>
			<view class="button-item">
				   <button class="myButton" @click="editText">
						编辑内容
				    </button>	
			</view>
			<view class="button-item">
				   <button class="myButton" @click="aggregateCount">
						字频统计
				    </button>	
			</view>
			<view class="button-item">
				   <button class="myButton" @click="addNumbers">
						数字求和
				    </button>	
			</view>
			<view class="button-item">
				<button class="myButton ai-btn" @click="checkAI">
						AI率检测
				 </button>	
			</view>
			</view>
		<view>
			<ad unit-id="adunit-ea0c34f6019437ec" ad-type="video" ad-theme="white"></ad>
			
		</view>
		

		</view>	
				</view>
		</view>
</template>

<script>
	import { countText } from '@/utils/textCounter.js'

export default {
    name: 'Result',
		
		// 添加错误边界处理
		onErrorCaptured(err, vm, info) {
			console.error('结果页面错误捕获:', err, info)
			// 防止错误传播导致页面崩溃
			return false
		},
		
		data() {
			return {
				groupedFrequencyData: [], 
				loading:true,
				total:0,
				result:[],
				totalString:"",
				chineseArr:[],
				englishnumArr:[],
				numArr:[],
				chineseNum:0,
				englishNum:0,
				numberNum:0,
				punctuationNum:0,
				sum: 0,
				numString:"",
				frequencyData:[],
				isAggregating: false,
				showEditPopup: false,
				showAggregatePopup: false,
				showAddCountPopup: false,
				scrollTop: 0,
			}
		},
	
		
		 onLoad(options) {

			try {
				if (options.ch && options.en && options.num && options.pun) {
					this.chineseNum = parseInt(options.ch) || 0
					this.englishNum = parseInt(options.en) || 0
					this.numberNum = parseInt(options.num) || 0
					this.punctuationNum = parseInt(options.pun) || 0
					this.total = this.chineseNum + this.englishNum+ this.numberNum
					this.totalString = uni.getStorageSync("savedRes") || ''
					this.result = this.totalString.split("  ")
					this.loading = false
				} else {
					const text = uni.getStorageSync("savedRes") || ''
					this.totalString = text
					this.result = this.totalString.split("  ")
					if (text) {
						this.countRes(text)
					}
				}
			} catch (error) {
				console.error('页面加载异常:', error)
				// 降级处理，确保页面能正常显示
				this.loading = false
			}
		},


	
		methods: {
			toSpell(){
				uni.navigateTo({
					url:"/pagesResult/spellcheck/spellcheck"
				})
			},
			
			checkAI(){
				uni.navigateToMiniProgram({
					appId:"wx42dada4ff6fc276e",
					extraData:{
						txt:this.totalString
					},
					// envVersion: 'develop',
				})
			},
			
		preciseSum(arr) {
		  // 1. 获取最大小数位数
		  const getDecimalPlaces = (num) => {
		    const str = num.toString();
		    const decimalIndex = str.indexOf('.');
		    return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
		  };
		  const maxDecimals = Math.max(...arr.map(getDecimalPlaces));
		
		  // 2. 转换为整数
		  const factor = 10 ** maxDecimals;
		  const intArr = arr.map(num => Math.round(num * factor));
		
		  // 3. 整数求和
		  const intSum = intArr.reduce((sum, int) => sum + int, 0);
		
		  // 4. 还原结果
		  return intSum / factor;
		},
	
			
			 addNumbers() {

				const REGEX = {
				  NUMBER: /\d+(?:\.\d+)?/g,  
				};
											
				const numMatches = this.totalString.match(REGEX.NUMBER) || [];
				this.numArr = numMatches.map(Number);
				
				if (this.numArr.length == 0 ) {
					uni.showModal({
						title: `文字中不包括数字🙏`,
						content: "因此无法做数字相加求和",
					})
				} else {
					this.sum = this.preciseSum(this.numArr)
					this.numString = this.numArr.join("+")
					this.closeAllPopups()
					this.showAddCountPopup = true
				}
			},
			
			    aggregateCount(){

					const REGEX = {
					  CHINESE: /[\u4e00-\u9fa5]/g,
					  NUMBER: /\d+(?:\.\d+)?/g,  
					  ENGLISH_WORD: /\b(?=\w*[a-zA-Z])[\w'-]+\b/g,
					PUNCTUATION: /(?<!\d)\.(?!\d)|(?<!\d),|(?<!\d):|(?<!\d);|[\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5!"#$%&'()*+\-/?@[\]^_`{|}~]/g
					};
								
					this.chineseArr = this.totalString.match(REGEX.CHINESE) || [];
					
					const numMatches = this.totalString.match(REGEX.NUMBER) || [];
					this.numArr = numMatches.map(Number);
					
					this.englishnumArr = this.totalString.match(REGEX.ENGLISH_WORD) || [];
					
			        let wordArray = [...this.englishnumArr, ...this.chineseArr, ...this.numArr]
			        
			        const frequencyMap = new Map();
			        wordArray.forEach(num => {  
			            const key = num.toString();
			            if (frequencyMap.has(key)) {
			                frequencyMap.set(key, frequencyMap.get(key) + 1);
			            } else {
			                frequencyMap.set(key, 1);
			            }
			        });
			        
			        const frequencyArray = Array.from(frequencyMap.entries()).map(([number, count]) => ({
			            number,
			            count
			        }));
			        
			        frequencyArray.sort((a, b) => b.count - a.count);
			        
			        const groupedMap = new Map();
			        frequencyArray.forEach(item => {
			            if (!groupedMap.has(item.count)) {
			                groupedMap.set(item.count, []);
			            }
			            groupedMap.get(item.count).push(item);
			        });
			        
			        this.groupedFrequencyData = Array.from(groupedMap.entries())
				    .map(([count, items]) => ({
				        count,
				        items
				    }))
				    .sort((a, b) => b.count - a.count); // 按出现次数从高到低排序
				
				this.closeAllPopups()
				this.showAggregatePopup = true               
			},
				
				getBackgroundColor(count) {
				        // 定义不同出现次数对应的颜色
				        const colorMap = {
				            1: '#E8F5E9', // 出现1次 - 浅绿色
				            2: '#E3F2FD', // 出现2次 - 浅蓝色
				            3: '#FFF3E0', // 出现3次 - 浅橙色
				            4: '#F3E5F5', // 出现4次 - 浅紫色
				            5: '#FCE4EC', // 出现5次 - 浅粉色
				            6: '#E0F2F1', // 出现6次 - 浅青色
				            7: '#FFF8E1', // 出现7次 - 浅黄色
				            8: '#EFEBE9', // 出现8次 - 浅棕色
				            9: '#ECEFF1', // 出现9次 - 浅灰色
				            10: '#FFEBEE'  // 出现10次及以上 - 浅红色
				        };
				        
				        if (count > 10) {
				            return colorMap[10];
				        }
				        
				        return colorMap[count] || '#F5F5F5'; // 默认颜色
				    },

				
			
					
			getCurrentSaved(){
				uni.getStorage({
					key:'savedRes',
					success: (res) => {
						this.totalString = res.data
						this.result = this.totalString.split("  ")
						if (this.totalString !== "") {
							this.countRes(this.totalString)	
							this.loading = false
						} else {
							this.loading = false
						}
					},
					fail:(err) => {
						this.loading = false
						uni.showModal({
							title:"抱歉本地读取有问题哈~",
							content:"请重新统计或联系我们哈"
						})
					}
				})
			},

	
			editText(){

				this.closeAllPopups()
				this.showEditPopup = true
			},
			
    saveToHistory(oneData) {
		uni.setStorageSync("savedRes", oneData)
      const history = uni.getStorageSync('ocrHistory') || []
	  let id = Date.now()
      history.unshift({
        ocr: oneData,
        id: id
      })
      if (history.length > 100) history.pop()
		uni.setStorage({
			key:"ocrHistory",
			data: history,
			success:(res) => {
			},
			fail:(err) => {
				this.loading = false
				uni.showModal({
					title:"本地存储有问题哈",
					content:`请重试，尝试清理微信缓存或联系我们哈。${err.errMsg}`
				})
			}
		})
    },				
			
			inputHandle(e) {
				this.totalString = e.detail.value
			},	
			confirmEdit(){
					this.saveToHistory(this.totalString)
					
					this.result = this.totalString.split("  ")
					this.countRes(this.totalString)
					this.closeEditPopup()
					
				},
				
				closeEditPopup() {
					this.showEditPopup = false
				},
				
				closeAggregatePopup() {
					this.showAggregatePopup = false
				},
				
				closeAddCountPopup() {
					this.showAddCountPopup = false
				},
				
				closeAllPopups() {
					this.showEditPopup = false
					this.showAggregatePopup = false
					this.showAddCountPopup = false
				},
				
				// 点击遮罩关闭弹窗的统一方法
				handleMaskClick() {
					this.closeAllPopups()
				},

			countRes(txt) {
		  const result = countText(txt)
		  this.chineseNum = result.chineseNum
		  this.numberNum = result.numberNum
		  this.englishNum = result.englishNum
		  this.punctuationNum = result.punctuationNum
		  this.total = result.total
		},


			copy() {

				uni.setClipboardData({
					data: this.totalString,
					success: () => {
					},
					fail:(err)=>{
						uni.showModal({
							title:"抱歉没能复制哈",
							content:"请重试或请联系我们哈"
						})
						
					}
				})
			},	 	
		},			
	}
</script>

<style lang="scss" scoped>
	.result-content-area {
		box-sizing: border-box;
	}
	
	.result-scroll-container {
		overflow: hidden;
	}
	
	.result-scroll-view {
		padding-bottom: 899rpx;
	}
	
	.result-item {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}
	
	.scroll-bottom-space {
		height: 100rpx; 
	}
	
  .result-bottom-fixed {
    position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100vw;
    z-index: 1024;
	background: white;
	padding-top: 20rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  }
	
	.button-container {
		display: flex;
		text-align: center;
		margin-bottom: 10rpx;
	}
	
	.button-item {
		flex: 1;
		padding: 0 10rpx;
	}
	
	.myButton {
		width: 100%;
		margin-bottom: 10rpx;
	}
	
	.copy-btn {
		background-color: #85FFD7;
	}
	
	.ai-btn {
		background-color: #FFF420;
	}
  
  /* 当弹窗打开时禁用页面滚动 */
	.page-no-scroll {
		height: 100vh;
		overflow: hidden;
		position: fixed;
		width: 100%;
	}
	
	/* ========== 弹窗公共样式 ========== */
	.native-popup-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .native-popup-content {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-radius: 16rpx 16rpx 0 0;
    max-height: 89vh;
    overflow: hidden;
    z-index: 2001;
    display: flex;
    flex-direction: column;
	height: 89vh;
    // height: 85vh;
    /* 兼容不同iOS版本的安全区域设置 */
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }
  
  .popup-title {
    font-weight: bold;
    line-height: 1.2; 
  }
  
  .popup-close {
    font-size: 43rpx;
    color: #999;
	padding-bottom: 5rpx;
  }
  
  .popup-main-content {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 0;
  }
  
  .popup-content-wrapper {
    margin-right: 30rpx;
    margin-left: 30rpx;
  }
  
  .popup-bottom-fixed {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    z-index: 10;
  }
  
  .popup-button-area {
    text-align: center;
    margin: 20rpx 0 10rpx 0;
    padding: 0 30rpx;
  }
  
  .popup-ad-area {
    padding: 10rpx 0;
    border-top: 1rpx solid #f0f0f0;
  }
  
  .popup-input-container {
    border-radius: 10rpx;
    background-color: #F8F7F8;
    line-height: 32rpx;
    margin-top: 20rpx;
  }
  
  .popup-textarea {
    height: 35vh;
    padding: 30rpx;
    width: 100%;
  }
  
  .popup-confirm-btn {
    width: 60%;
    background-color: #85FFD7;
    padding: 40rpx 0;
  }
  
  /* ========== 字频统计弹窗专用样式 ========== */
  .popup-scroll-container {
	height:35vh;
    background-color: #F8F7F8;
    padding: 30rpx;
    margin-top: 20rpx;
  }
  
  .frequency-group {
    margin-bottom: 20rpx;
  }
  
  .group-header {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
  }
  
  .group-title {
    font-weight: bold;
    margin-right: 10rpx;
  }
  
  .group-count {
    color: #666;
    font-size: 24rpx;
  }
  
  .group-items {
    display: flex;
    flex-wrap: wrap;
  }
  
  .frequency-item {
    margin: 10rpx 20rpx 10rpx 0;
    padding: 10rpx 20rpx;
    border-radius: 10rpx;
  }
  
  
  /* ========== 数字求和弹窗专用样式 ========== */
  .popup-text-content {
    word-break: break-all;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
  
</style>
