import { syncTime } from '../../api/getTime';
import { timeMap } from '../../common/config/timeMap.js';
import { getLocalTime } from '../../util';

const getTime = async (timezone = 0, state) => {
  return await syncTime(timezone)
    .then((res) => {
      state.error = undefined;
      return res;
    })
    .catch((err) => {
      state.error = err;
    });
};

const findTimeZoneName = (timezone = 0) => {
  let res = undefined;
  timeMap.map((v) => {
    if (v.value == timezone) {
      res = v.label;
    }
  });
  return res;
};

// 1s自动更新时间
const autoSyncTime = (state) => {
  const { timeList } = state;
  timeList.forEach((item) => {
    let temp = getLocalTime(item.timezone);
    item.time = temp.time;
    item.date = temp.date;
  });
};

const asyncTimeFromServer = (state) => {
  const { timeList } = state;
  console.log('======开始同步服务器时间======');
  
  timeList.forEach(async (item) => {
    let temp = await getTime(item.timezone, state);
    if (temp) {
      item.time = temp.time;
      item.date = temp.date;
    }
  });
};

export { getTime, findTimeZoneName, autoSyncTime, asyncTimeFromServer };
