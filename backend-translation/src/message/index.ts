const uuidv4 = require("uuid/v4");

export const makeInlineQueryResultArticle = ({
  title,
  description,
  message,
  url = ""
}) => {
  return {
    type: "article",
    id: uuidv4(),
    title: title,
    description: description,

    input_message_content: {
      message_text: message
    },
    url: url,
    thumb_url: "https://s3.amazonaws.com/lingoparrot/logo.png"
  };
};

export const makeInlineQueryResultVoice = ({ title, caption, voiceUrl }) => {
  return {
    type: "voice",
    id: uuidv4(),
    voice_url: voiceUrl,
    title: title,
    caption: caption
  };
};
