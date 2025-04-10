import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.VUE_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 브라우저에서 API 키 사용을 허용
});

const openAIAPI = {
  async chat(message) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "당신은 네이버 쇼핑몰의 고객 서비스 챗봇입니다. 친절하고 전문적으로 응답해주세요.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  },
};

export default openAIAPI;
