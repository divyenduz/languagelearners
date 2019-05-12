import { mailAPI } from "../api";
import { PRODUCTION, DEBUG } from "../globals";

export const sendMail = ({ email, subject, body }) => {
  if (!PRODUCTION && !DEBUG) {
    return;
  } else {
    if (DEBUG) {
      console.log(`Sending email as debug mode is on.`);
      // Uncomment the return in this block to avoid sending emails when developing
      //   return;
    }
    const msg = {
      to: email,
      // TODO: Fix this to a working email as "noreply" email addresses are rude
      from: "noreply@languagelearners.club",
      subject: subject,
      html: body
    };
    mailAPI.send(msg);
  }
};
