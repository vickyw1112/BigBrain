import port from './config.json'
const API_URL = `http://localhost:${port.BACKEND_PORT}`;

export const makeQuestion = (
  id, title, answers, answerOption, timeLimit, points, imgUrl, linkUrl) => {
  return ({ id, title, answers, answerOption, timeLimit, points, imgUrl, linkUrl });
};

export const makeAnswer = (aid, aBody, isCorrect) => {
  return ({ aid, aBody, isCorrect });
}
export default API_URL;
