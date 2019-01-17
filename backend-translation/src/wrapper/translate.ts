import { translateAPI } from "../api";

export const translate = async (
  sourceText,
  sourceLanguageCode = "auto",
  targetLanguageCode = "de"
) => {
  try {
    const data = await translateAPI
      .translateText({
        SourceLanguageCode: sourceLanguageCode,
        TargetLanguageCode: targetLanguageCode,
        Text: sourceText
      })
      .promise();
    if (!data || !data.TranslatedText) {
      throw new Error("Failed to translate");
    }
    return data && data.TranslatedText;
  } catch (e) {
    throw new Error(`Failed to translate: ${e.toString()}`);
  }
};
