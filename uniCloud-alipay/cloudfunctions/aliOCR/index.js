'use strict';
const { OpenAI } = require('openai');
// const openai = new OpenAI({
//   apiKey: 'sk-e92e637bff7349f8b6a7038d82a298fd',
//   baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
// });
const openai = new OpenAI({
  apiKey: '08a061cc-cad4-40ea-b2ff-1aca7c98e354',
  baseURL: 'https://api-inference.modelscope.cn/v1',
});

exports.main = async (event, context) => {
	let imageBase64 = event.imageBase64

	  const response = await openai.chat.completions.create({
	    // model: 'qwen-vl-ocr',
		model:'Qwen/Qwen2.5-VL-7B-Instruct',

          messages: [
            {"role": "user",
            "content": [{"type": "image_url",
                        "image_url": {
              "url": `data:image/jpeg;base64,${imageBase64}`},
     //          "min_pixels": 28 * 28 * 4,
     //          "max_pixels": 28 * 28 * 1280,
			  },
     //          {"type": "text", "text": "Read all the text in the image."},
	 {"type":"text", "text": "Extract all visible text from the image exactly as it appears. Do not include any additional explanations, labels, or comments. Return only the text."},
			  
			  ]}]
	      
	    
	  });
	  // console.log('log response')
	  // console.log(response)
	return response
};
