// utils/textCounter.js
export function countText(txt) {
  if (!txt || typeof txt !== 'string') {
    return {
      chineseNum: 0,
      englishNum: 0,
      numberNum: 0,
      punctuationNum: 0,
      total: 0,
      chineseArr: [],
      englishArr: [],
      numberArr: [],
      punctuationArr: []
    }
  }

  const REGEX = {
    CHINESE: /[\u4e00-\u9fa5]/g,
    NUMBER: /\d+(?:\.\d+)?/g,  
    ENGLISH_WORD: /\b(?=\w*[a-zA-Z])[\w'-]+\b/g,
    PUNCTUATION: /(?<!\d)\.(?!\d)|(?<!\d),|(?<!\d):|(?<!\d);|[\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5!"#$%&'()*+\-/?@[\]^_`{|}~]/g
  }

  const chineseArr = txt.match(REGEX.CHINESE) || []
  const chineseNum = chineseArr.length
  
  const numberMatches = txt.match(REGEX.NUMBER) || []
  const numberArr = numberMatches.map(Number)
  const numberNum = numberArr.length
  
  const englishArr = txt.match(REGEX.ENGLISH_WORD) || []
  const englishNum = englishArr.length
  
  const punctuationArr = txt.match(REGEX.PUNCTUATION) || []
  const punctuationNum = punctuationArr.length
  
  const total = chineseNum + englishNum + numberNum
  
  return {
    chineseNum,
    englishNum,
    numberNum,
    punctuationNum,
    total,
    chineseArr,
    englishArr,
    numberArr,
    punctuationArr
  }
}

export function getToken(apiKey, secretKey){
	return new Promise((resolve,reject) => {
		uni.request({
			url:`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
			method:"POST",
			headers:{'content-type':'application/json','accept':'application/json'},
			success:(res)=>{
				resolve(res.data.access_token)
			},
			fail:(e)=>{
				reject(e)
			}
		})
	})
}