import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.VUE_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 브라우저에서 API 키 사용을 허용
});

const openAIAPI = {
  async chat(message, previousMessages = []) {
    try {
      // 시스템 메시지와 이전 대화 내역, 새 메시지를 포함한 전체 메시지 배열 생성
      const messages = [
        {
          role: "system",
          content:
            "당신은 네이버 쇼핑몰의 고객 서비스 챗봇입니다. 친절하고 전문적으로 응답해주세요.",
        },
        ...previousMessages,
        {
          role: "user",
          content: message,
        },
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      if (
        response.choices &&
        response.choices[0] &&
        response.choices[0].message
      ) {
        return response.choices[0].message.content;
      } else {
        throw new Error("Invalid response format from OpenAI");
      }
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  },

  // 대화 내용을 기반으로 대화 주제 생성
  async generateChatTitle(messages) {
    try {
      if (!messages || messages.length === 0) {
        return "새 대화";
      }

      // 대화 내용 추출 (최대 3개 메시지만 사용)
      const chatContent = messages
        .slice(0, Math.min(3, messages.length))
        .map((msg) => msg.content)
        .join(" ");

      // 대화 주제 생성을 위한 메시지 배열
      const promptMessages = [
        {
          role: "system",
          content:
            "주어진 대화 내용을 바탕으로 짧고 간결한 대화 주제를 생성해주세요. 15자 이내로 작성해 주세요.",
        },
        {
          role: "user",
          content: `대화 내용: "${chatContent}"\n\n위 대화의 주제를 15자 이내로 작성해주세요.`,
        },
      ];

      // API 호출
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: promptMessages,
        temperature: 0.7,
        max_tokens: 50,
      });

      // 응답에서 주제 추출
      if (
        response.choices &&
        response.choices[0] &&
        response.choices[0].message
      ) {
        // 따옴표나 불필요한 문자 제거 후 반환
        let title = response.choices[0].message.content.trim();
        title = title.replace(/["']/g, "");
        title = title.replace(/^주제: |^제목: /g, "");

        return title.length > 15 ? title.substring(0, 15) + "..." : title;
      } else {
        throw new Error("Invalid response format from OpenAI");
      }
    } catch (error) {
      console.error("OpenAI Title Generation Error:", error);
      // 오류 발생 시 기본 제목 반환
      return "새 대화";
    }
  },
};

export default openAIAPI;
