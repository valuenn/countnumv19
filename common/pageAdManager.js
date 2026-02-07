// common/pageAdManager.js
class PageAdManager {
  constructor() {
    this.adInstance = null
    this.isReady = false
    this.isShowing = false
    this.loading = false
  }

  init(adUnitId) {
    this.destroy()
    this.adInstance = uni.createInterstitialAd({ adUnitId })
    this.adInstance.onLoad(() => { this.isReady = true; this.loading = false })
    this.adInstance.onError(() => { this.isReady = false; this.loading = false; this._scheduleLoad() })
    // 修改 onClose 处理，确保状态正确重置
    this.adInstance.onClose(() => { 
        this.isShowing = false
        // 延迟加载下一次广告，避免立即请求
        this._scheduleLoad() 
    })
    this.load()
  }

  load() {
    if (this.adInstance && !this.isReady && !this.loading) {
      this.loading = true
      this.adInstance.load().catch(() => { this.loading = false })
    }
  }

  _scheduleLoad() {
    setTimeout(() => this.load(), 3000)
  }

  async show() {
    if (!this.adInstance || this.isShowing) return false

    if (!this.isReady) {
      try { await this.adInstance.load() } catch { return false }
    }

    this.isShowing = true
    try {
      await this.adInstance.show()
      return true
    } catch {
      this.isShowing = false
      this.isReady = false
      this._scheduleLoad()
      return false
    }
  }

  destroy() {
    if (this.adInstance) {
      try {
        ['offLoad', 'offError', 'offClose'].forEach(fn => this.adInstance[fn]?.())
      } catch {}
      this.adInstance = null
    }
    this.isReady = false
    this.isShowing = false
    this.loading = false
  }
}

export default PageAdManager
