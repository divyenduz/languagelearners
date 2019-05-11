import { mailAPI } from "../api";

// TODO: Unify environment with middleware.
console.log(`Environment ${process.env.NODE_ENV}`);
const production = process.env.NODE_ENV === "production" ? true : false;
const debug = process.env.DEBUG || !production;

export const sendMail = ({ email, subject, body }) => {
  if (!production && !debug) {
    return;
  } else {
    if (debug) {
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
