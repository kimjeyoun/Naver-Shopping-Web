import axios from "axios";
import { NAVER_API_CONFIG } from "./config";

const shoppingAPI = {
  search: async (query, params = {}) => {
    try {
      const response = await axios.get("/api/v1/search/shop.json", {
        params: {
          query: encodeURIComponent(query),
          display: params.display || 20,
          start: params.start || 1,
          sort: params.sort || "sim",
          ...params,
        },
        headers: {
          "X-Naver-Client-Id": NAVER_API_CONFIG.CLIENT_ID,
          "X-Naver-Client-Secret": NAVER_API_CONFIG.CLIENT_SECRET,
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
