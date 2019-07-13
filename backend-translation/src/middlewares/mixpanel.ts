import * as Mixpanel from "mixpanel";

export const mixpanelMiddleware = (ctx, next) => {
  if (!process.env.MIXPANEL_TOKEN) {
    if (ctx.environment.debug) {
      console.log("WARN: env MIXPANEL_TOKEN not provided");
    }
    return;
  }
  if (ctx.environment.debug) {
    console.log("using mixpanel");
  }
  const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN);
  ctx.mixpanel = mixpanel;

  // TODO: Unify logging in its own middleware.
  const from =
    (ctx.message && ctx.message.from) ||
    (ctx.inlineQuery && ctx.inlineQuery.from && ctx.inlineQuery.from) ||
    (ctx.editedMessage && ctx.editedMessage.from);

  const query =
    (ctx.message && ctx.message.text.trim()) ||
    (ctx.inlineQuery && ctx.inlineQuery.query.trim()) ||
    (ctx.editedMessage && ctx.editedMessage.text.trim());

  console.log(
    `${ctx.updateType} - ${query} from user ${from && from.username}`
  );

  if (ctx.mixpanel && from) {
    const mixpanel = ctx.mixpanel;
    if (ctx.environment.debug) {
      console.log(`metrics - tracking user stats for user: ${from.username}`);
    }
    mixpanel.people.set(from.username, {
      $first_name: from.first_name,
      $last_name: from.last_name,
      plan: "premium"
    });
    mixpanel.track("received_message", {
      $distinct_id: from.username
    });
    mixpanel.people.increment(from.username, "messages", 1);
    mixpanel.people.increment(from.username, "characters", query.length);
  }

  const start = new Date();
  return next(ctx).then(() => {
    const ms = +new Date() - +start;
    console.log("Response time %sms", ms);
  });
};
