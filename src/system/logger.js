import pino from "pino";

export const logger = pino(
  {
    transport: {
      options: {
        sync: false,
        translateTime: "yyyy-mm-dd HH:MM:ss:L",
      },
      target: "pino-pretty",
    },
  },
);
