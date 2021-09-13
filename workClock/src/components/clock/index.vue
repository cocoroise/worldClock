<template>
  <div class="clock_container">
    <header class="title">世界时钟</header>
    <!-- 时间区域 -->
    <div class="time-section">
      <clock-section
        v-for="(item, index) in timeList"
        :key="index"
        :item="item"
        @close="handleClose(index)"
      ></clock-section>
      <add-clock @add="handleAdd" />
    </div>
    <!-- 报错区域 -->
    <div class="error" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
  import { reactive, toRefs, onMounted, onUnmounted } from 'vue';
  import ClockSection from '../clockSection/index.vue';
  import AddClock from '../addClock/index.vue';
  import {
    getTime,
    findTimeZoneName,
    autoSyncTime,
    asyncTimeFromServer,
  } from './logic.js';

  export default {
    components: { ClockSection, AddClock },
    setup() {
      const state = reactive({
        timeList: [
          {
            name: '北京1',
            date: '2021-09-12',
            time: '00:00:00',
            timezone: 8,
          },
        ],
        error: undefined,
        secondTimer: null, // 秒更新
        serverSyncTimer: null, // 服务器分钟级同步
      });

      onMounted(() => {
        initData();
        setTimer();
      });

      onUnmounted(() => {
        clearInterval(state.secondTimer);
        clearInterval(state.serverSyncTimer);
      });

      // 初始化时间列表
      const initData = async () => {
        const initTime = state.timeList[0];
        await getTime(initTime.timezone, state).then((res) => {
          if (res) {
            initTime.date = res.date;
            initTime.time = res.time;
          }
        });
      };

      // 设置更新定时器
      const setTimer = () => {
        state.secondTimer = setInterval(() => {
          autoSyncTime(state);
        }, 1000);

        state.serverSyncTimer = setInterval(() => {
          asyncTimeFromServer(state);
        }, 1000 * 60);
      };

      // 添加一个时区
      const handleAdd = async (value = 0) => {
        await getTime(value, state).then((res) => {
          if (res) {
            state.timeList.push({
              name: findTimeZoneName(value),
              date: res.date,
              time: res.time,
              timezone: value,
            });
          }
        });
      };

      // 删除一个时区
      const handleClose = (delIndex) => {
        let list = state.timeList.slice(0);
        list.splice(delIndex, 1);
        state.timeList = list;
        // state.timeList.splice(delIndex, 1);
        console.log('delete', list);
      };

      return {
        ...toRefs(state),
        handleClose,
        handleAdd,
      };
    },
  };
</script>

<style lang="less" scoped>
  @import '../../common/style/mixin.less';
  @import './index.less';
</style>
