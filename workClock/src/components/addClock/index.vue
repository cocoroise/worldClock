<template>
  <div class="addClock_container">
    +
    <select class="select" @change="handleAdd">
      <option v-for="item in timeMap" :key="item.label" :value="item.value">
        {{ item.label }}
      </option>
    </select>
  </div>
</template>

<script>
  import { reactive, toRefs, onMounted } from 'vue';
  import { timeMap } from '../../common/config/timeMap.js';

  export default {
    setup(_, { emit }) {
      const state = reactive({
        timeMap,
      });

      onMounted(() => {});

      const handleAdd = (item) => {
        emit('add', item.target.value);
      };

      return {
        ...toRefs(state),
        handleAdd,
      };
    },
  };
</script>

<style lang="less" scoped>
  @import '../../common/style/mixin.less';
  @import './index.less';
</style>
