<template>
  <div class="clockSection-container">
    <div class="title">{{ timeObject.name }}</div>
    <div class="del-btn" @click="handleClick">×</div>
    <div class="date">{{ timeObject.date }}</div>
    <div class="time">{{ timeObject.time }}</div>
  </div>
</template>

<script>
  import { ref } from 'vue';

  export default {
    props: {
      item: {
        type: Object,
        default: () => {
          return {
            name: '北京',
            date: '2021-09-12',
            timezone: 1,
            time: new Date().getTime(),
          };
        },
      },
    },
    setup(props, { emit }) {
      const timeObject = ref(props.item);

      const handleClick = () => {
        emit('close', timeObject);
      };

      return { timeObject, handleClick };
    },
  };
</script>

<style lang="less" scoped>
  @import '../../common/style/mixin.less';
  @import './index.less';
</style>
