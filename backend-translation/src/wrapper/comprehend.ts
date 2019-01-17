import { comprehendAPI } from "../api";

export const comprehend = async sourceText => {
  const languages = await comprehendAPI
    .detectDominantLanguage({
      Text: sourceText
    })
    .promise();
  const language = languages.Languages.reduce(
    (dominantLanguage, language) => {
      if (dominantLanguage.Score > language.Score) {
        return dominantLanguage;
      } else {
        return language;
      }
    },
    {
      LanguageCode: "de",
      Score: 0
    }
  );
  return language.LanguageCode;
};
