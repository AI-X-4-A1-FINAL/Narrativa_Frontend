import axios from "../api/axiosInstance";

export const statisticsService = {
  incrementTraffic: async () => {
    try {
      await axios.post(`${process.env.REACT_APP_SPRING_URI}/api/admin/stats/increment-traffic`);
    } catch (error) {
      console.error('트래픽 측정 실패:', error);
    }
  }
};