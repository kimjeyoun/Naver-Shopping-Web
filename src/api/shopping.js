import axios from "axios";

const shoppingAPI = {
  search: async (query, params = {}) => {
    try {
      const response = await axios.get("/api/v1/search/shop.json", {
        params: {
          query: query,
          display: params.display || 20,
          start: params.start || 1,
          sort: params.sort || "sim",
        },
        headers: {
          "X-Naver-Client-Id": process.env.VUE_APP_NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": process.env.VUE_APP_NAVER_CLIENT_SECRET,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Shopping API Error:", error);
      throw error;
    }
  },
};

export default shoppingAPI;
