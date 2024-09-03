const getCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${formattedMinutes} ${period}`;
};
const removeNonLetters = (word) => {
  return word.replace(/[^a-zA-Z0-9_@*-]/g, "");
};

const extractLetters = (input) => {
  if (!input) return;
  const words = input.split(",");
  const uniqueWords = new Set(words.map((word) => removeNonLetters(word)));
  const result = Array.from(uniqueWords).filter((word) => word.length > 0);
  return result;
};

const getSessionData = (key) => {
  return sessionStorage.getItem(key);
};
const setSessionData = (key, value) => {
  return sessionStorage.setItem(key, value);
};
const deleteSessionData = (key) => {
  return sessionStorage.removeItem(key);
};
