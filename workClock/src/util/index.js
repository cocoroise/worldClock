// 传入时区，获取当地时间
function getLocalTime(timezone = 1) {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const nd = new Date(utc + 3600000 * timezone); //北京时间 +8
  const Y = nd.getFullYear();
  const M = nd.getMonth() + 1;
  const D = nd.getDate();
  const h = nd.getHours();
  const m = nd.getMinutes();
  const s = nd.getSeconds();

  return {
    date: `${formatZero(Y)}-${formatZero(M)}-${formatZero(D)}`,
    time: ` ${formatZero(h)}:${formatZero(m)}:${formatZero(s)}`,
  };
}
// 睡眠函数
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatZero(number) {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
}

export { getLocalTime, sleep };
