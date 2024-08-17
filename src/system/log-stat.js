export function logStat(logger, stat) {
  setInterval(() => {
    const formatMemoryUsage = (data) => +`${Math.round(data / 1024 / 1024 * 100) / 100}`;

    const memoryData = process.memoryUsage();

    const rss = formatMemoryUsage(memoryData.rss);
    const heapTotal = formatMemoryUsage(memoryData.heapTotal);
    const heapUsed = formatMemoryUsage(memoryData.heapUsed);
    const external = formatMemoryUsage(memoryData.external);

    if (stat.rss < rss) stat.rss = rss;
    if (stat.heapTotal < heapTotal) stat.heapTotal = heapTotal;
    if (stat.heapUsed < heapUsed) stat.heapUsed = heapUsed;
    if (stat.external < external) stat.external = external;

    // const memoryUsage = {
    //   rss: `${rss} MB -> Resident Set Size - total memory allocated for the process execution`,
    //   heapTotal: `${heapTotal} MB -> total size of the allocated heap`,
    //   heapUsed: `${heapUsed} MB -> actual memory used during the execution`,
    //   external: `${external} MB -> V8 external memory`,
    // };
    // console.log(memoryUsage);
    logger.info(`actual: ${JSON.stringify({ external, heapTotal, heapUsed, rss })} stat:, ${JSON.stringify(stat)} `);
  }, 10);
}
