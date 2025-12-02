import axios from "axios";

export const analyzeSentiment = async (text) => {
  const response = await axios.post("http://localhost:8000/analyze", {
    text,
  });

  return response.data;
};
