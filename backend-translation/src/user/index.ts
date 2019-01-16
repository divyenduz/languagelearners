const production = process.env.NODE_ENV === "production" ? true : false;

const betaTesters = ["divyenduz", "nilanm", "rusrushal13", "yuvika01"];
const knownUsers = production ? [...betaTesters] : [...betaTesters];

export const isKnownUser = userName => {
  const index = knownUsers.indexOf(userName);
  return index > -1;
};
export const userNotKnownErrorMessage = userName => {
  const joinLink = "https://languagelearners.club";
  return `User ${userName} is not indentified. You need to join ${joinLink} before using LingoParrot.`;
};
