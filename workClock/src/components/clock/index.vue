<template>
  <div class="clock_container">
    <header class="title">世界时钟</header>
    <!-- 时间区域 -->
    <div class="time-section">
      <clock-section
        v-for="(item, index) in timeList"
        :key="`${item.name}-${index}`"
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
    useStorage
  } from './logic.js';


  export default {
    components: { ClockSection, AddClock },
    setup() {
      const state = reactive({
        timeList: [],
        error: undefined,
        secondTimer: null, // 秒更新timer
        serverSyncTimer: null, // 服务器分钟级同步timer
      });

      const storageList = useStorage('timeZone',[{ name: '北京', timezone: '8' }]);

      onMounted(() => {
        startTime();
        setTimer();
      });

      onUnmounted(() => {
        clearInterval(state.secondTimer);
        clearInterval(state.serverSyncTimer);
      });

      // 初始化时间列表
      const startTime = async () => {
        storageList.map(async (v) => {
          await getTime(v.timezone, state).then((res) => {
            if (res) {
              state.timeList.push({
                ...v,
                date:res.date,
                time:res.time
              })
            }
          });
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
            let obj = {
              name: findTimeZoneName(value),
              timezone: value,
            };

            storageList.push(obj);

            state.timeList.push({
              ...obj,
              date: res.date,
              time: res.time,
            });
          }
        });
      };

      // 删除一个时区
      const handleClose = (delIndex) => {
        state.timeList.splice(delIndex, 1);
        storageList.splice(delIndex, 1);
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
