import { speechAPI } from "../api";

export const speech = async (sourceText, languageCode = "de-DE") => {
  const germanVoiceId = "Vicki";
  const defaultVoiceId = germanVoiceId;
  const voiceIdLanguageCodeMap = {
    "de-DE": defaultVoiceId,
    "en-US": "Ivy"
  };
  try {
    const data = await speechAPI
      .synthesizeSpeech({
        Text: sourceText,
        LanguageCode: "de-DE",
        OutputFormat: "ogg_vorbis",
        VoiceId: voiceIdLanguageCodeMap["de-DE"] || defaultVoiceId
      })
      .promise();
    if (!data || !(data.AudioStream instanceof Buffer)) {
      throw new Error("Failed to synthesize");
    }
    // fs.writeFileSync("voice.mp3", data.AudioStream);
    return data.AudioStream;
  } catch (e) {
    throw new Error(`Failed to synthesize: ${e.toString()}`);
  }
};
