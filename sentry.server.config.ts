// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://8cdc131f7ad13cdaa6dd2bfa53afdc56@o4504671092277248.ingest.us.sentry.io/4509575024738304",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
