import { syncTime } from '../../api/getTime';
import { timeMap } from '../../common/config/timeMap.js';
import { getLocalTime } from '../../util';
import { reactive, watch } from 'vue';

// 从服务器获取时间
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

// 查找对应时区的名称
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

// 从服务器更新时间 1min
const asyncTimeFromServer = (state) => {
  const { timeList } = state;

  timeList.forEach(async (item) => {
    let temp = await getTime(item.timezone, state);
    if (temp) {
      item.time = temp.time;
      item.date = temp.date;
    }
  });

  console.log('======开始同步服务器时间======');
};

const useStorage = (key, initValue) => {
  let storageList = reactive(initValue);

  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      storageList = reactive(JSON.parse(item));
    }
  } catch (err) {
    console.log('err', err);
  }

  // 监听timeList的变化
  watch(storageList, (newVal) => {
    window.localStorage.setItem(key, JSON.stringify(newVal));
  });
  return storageList;
};

export {
  getTime,
  findTimeZoneName,
  autoSyncTime,
  asyncTimeFromServer,
  useStorage,
};
