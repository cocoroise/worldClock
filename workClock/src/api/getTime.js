import { getLocalTime, sleep } from '../util';

const syncTime = async (timezone = 1) => {
  return new Promise((resolve, reject) => {
    // 固定800ms后返回结果
    sleep(800).then(() => {
      const random = Math.floor(Math.random() * 10);
      if (random >= 3) {
        resolve(getLocalTime(timezone));
      } else {
        reject('获取时间出错，请重试。。。');
      }
    });
  });
};

export { syncTime };
