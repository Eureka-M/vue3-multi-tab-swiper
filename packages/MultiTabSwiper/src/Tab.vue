<template>
  <div class="tabs">
    <span
      v-for="(tab, index) in tabs"
      :key="index"
      :class="['tab-item', { active: index === activeIndex }]"
      @click="tabClick(index)"
    >
      {{ tab }}
    </span>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, defineEmits } from "vue";

const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  tabIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["tabChange"]);

let activeIndex = ref(0);

const tabClick = (index) => {
  activeIndex.value = index;
};

watch(
  () => activeIndex.value,
  (newValue) => {
    emit("tabChange", newValue);
  }
);

watch(
  () => props.tabIndex,
  (newValue) => {
    activeIndex.value = newValue;
  }
);
</script>

<style lang="less" scoped>
.tabs {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  .tab-item {
    height: 20px;
    line-height: 20px;
    padding: 4px 10px;
    border-radius: 8px;
    background: #eee;

    &.active {
      background: pink;
    }
  }
}
</style>
