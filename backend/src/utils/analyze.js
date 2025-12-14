import axios from "axios";

export const analyzeSentiment = async (text) => {
  const response = await axios.post("${process.env.LLM_API_URL}/analyze", {
    text,
  });

  return response.data;
};
