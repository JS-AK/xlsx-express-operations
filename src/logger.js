import pino from 'pino';

const logger = pino(
  {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'yyyy-mm-dd HH:MM:ss:L',
        sync: false
      }
    },
  },
);


export default logger;
