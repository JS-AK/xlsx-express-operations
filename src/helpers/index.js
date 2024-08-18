export function* generateData(count = 1_000_000) {
  for (let i = 0; i < count; i++) {
    yield [`User ${i}`, Math.floor(Math.random() * 60) + 18, `user${i}@example.com`];
  }
}

export const clearStat = (stat) => {
  setTimeout(() => {
    stat.rss = 0;
    stat.heapTotal = 0;
    stat.heapUsed = 0;
    stat.external = 0;
  }, 5000);
};

export const withLogging = (fn, name) => {
  return async function (req, res, next) {
    const token = crypto.randomUUID();

    const start = performance.now();

    this.logger.info(`${token}: ${name} start`);
    try {
      await fn.apply(this, [req, res, next]);
    } catch (error) {
      this.logger.error(`${token}: ${error.message || "UNKNOWN_ERROR"}`);

      next(error);
    } finally {
      this.logger.info(`${token}: ${name} end with duration: ${performance.now() - start}ms`);
      this.clearStat(this.stat);
    }
  };
};
