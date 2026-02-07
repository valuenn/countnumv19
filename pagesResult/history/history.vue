<template>
  <view class="container">
    <view class="header">
      <text class="title">字数统计历史</text>
      <text class="delete-all" @tap="deleteAll">清空记录</text>
    </view>

    <view class="history-list">
      <block v-for="item in visibleHistory" :key="item.id">
        <view class="history-item">
          <!-- 内容区域 -->
          <view class="content-wrapper">
            <text class="content">{{ item.ocr }}</text>
            <text class="time">{{ formatTime(item.id) }}</text>
          </view>

          <!-- 操作按钮 -->
          <view class="action-buttons">
            <text class="view-btn" @tap="viewDetail(item.ocr)">查看</text>
            <text class="delete-btn" @tap="deleteItem(item.id)">🗑️</text>
          </view>
        </view>
      </block>

      <!-- 加载更多 -->
      <view v-if="hasMore" class="load-more" @tap="loadMore">
        <text>{{ loading ? '加载中...' : '点击加载更多' }}</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!visibleHistory.length" class="empty">
        <text class="empty-text">暂无历史记录</text>
      </view>
	  

    </view>
  <view class="tn-footerfixed">
		<ad unit-id="adunit-54347effcac6ad8b" ad-type="video" ad-theme="white"></ad>
  </view>
  </view>

</template>

<script>
	import { countText } from '@/utils/textCounter.js'

export default {

  data() {
    return {
      allHistory: [],
      visibleHistory: [],
      currentPage: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
    }
  },
  onLoad() {
    this.loadHistory()

  },
  


  
  methods: {
			  
    loadHistory() {
      this.allHistory = uni.getStorageSync('ocrHistory') || []
      this.handlePagination()
    },

    handlePagination() {
      const end = this.currentPage * this.pageSize
      this.visibleHistory = this.allHistory.slice(0, end)
      this.hasMore = end < this.allHistory.length
    },

    async loadMore() {

      if (!this.hasMore || this.loading) return
      
      this.loading = true
      this.currentPage += 1
      
      setTimeout(() => {
        this.handlePagination()
        this.loading = false
      }, 300)
    },

   async deleteItem(id) {

      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条记录吗？',
        success: res => {
          if (res.confirm) {
            this.allHistory = this.allHistory.filter(item => item.id !== id)
            this.saveToStorage()
            this.handlePagination()
          }
        }
      })
    },

   async deleteAll() {

      uni.showModal({
        title: '确认清空',
        content: '将删除所有历史记录，不可恢复',
        success: res => {
          if (res.confirm) {
            this.allHistory = []
            this.currentPage = 1
            this.saveToStorage()
            this.handlePagination()
          }
        }
      })
    },

    async viewDetail(txt) {

		const result = countText(txt)
		let punctuationNum = result.punctuationNum
		let total = result.total
		
      uni.showModal({
        title: `总字数${total}个，标点${punctuationNum}个`,
        content: txt,
        confirmText: '复制',
        showCancel: true,
		success: (res) => {
			if (res.confirm) {
				this.copy(txt)
			}
		}
      })
    },
	copy(txt) {
		uni.setClipboardData({
			data: txt,
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
	
    formatTime(timestamp) {
      const date = new Date(timestamp)
      const padZero = n => n.toString().padStart(2, '0')
      return `${date.getFullYear()}-${padZero(date.getMonth()+1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
    },

    saveToStorage() {
      uni.setStorageSync('ocrHistory', this.allHistory)
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.delete-all {
  color: #ff4444;
  font-size: 28rpx;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
/*  border: 1rpx solid #ff4444 */;
}

.history-list {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 688rpx;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
  overflow: hidden;
  
}

.content-wrapper {
  flex: 1;
  margin-right: 30rpx;
  min-width: 0;
}

.content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  word-break: break-all;
  white-space: pre-wrap;

}

.time {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-top: 15rpx;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex-shrink: 0;
}

.view-btn {
  color: #007AFF;
  font-size: 26rpx;
  padding: 8rpx 20rpx;
/*  border: 1rpx solid #007AFF; */
  border-radius: 8rpx;
}

.delete-btn {
  color: #ff3b30;
  /* font-size: 36rpx; */
  padding: 0 10rpx;
}

.load-more {
  padding: 40rpx;
  text-align: center;
  color: #666;
  font-size: 28rpx;
}

.empty {
  padding: 100rpx 0;
  text-align: center;
}


.empty-text {
  color: #999;
  font-size: 28rpx;
}

  .tn-footerfixed {
    position: fixed;
	bottom:0;
	width: calc(100vw - 40rpx);
    z-index: 1024;    
  }
  
</style>