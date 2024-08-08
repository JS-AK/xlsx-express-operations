export function* generateData(count = 1_000_000) {
  for (let i = 0; i < count; i++) {
    yield [`User ${i}`, Math.floor(Math.random() * 60) + 18, `user${i}@example.com`];
  }
}

export const clearStat = (stat) => {
  setTimeout(() => {
    stat.rss = 0
    stat.heapTotal = 0
    stat.heapUsed = 0
    stat.external = 0
  }, 5000);
}
