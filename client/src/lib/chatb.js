import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBw0_LW2tT76tl1-SM0DuN_Xu3h3eORFA0';
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateDescription = async (userText, summary) => {
  try {
    const prompt = `
      Answer the following user query for the summary of the legal document in 2-3 lines.
      User's Question: "${userText}"

      Based on the given context:
      "${summary}"
    `;

    console.log('Prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    return 'Sorry, there was an error generating the response.';
  }
};
