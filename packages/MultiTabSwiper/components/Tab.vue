<template>
  <div class="tabs scroll-tabs" ref="tabsWrapper">
    <span
      v-for="(tab, index) in tabs"
      :ref="tabItemRef"
      :key="index"
      :class="['tab-item', { active: index === activeIndex }]"
      @click="tabClick(index)"
      >{{ tab }}</span
    >
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

const tabsWrapper = ref();
const itemsRef = ref([]);
const tabItemRef = (el) => {
  if (el) {
    itemsRef.value.push(el);
  }
};

const getElementWidth = (element) => {
  return (
    element.offsetWidth +
    computedStyle2Num(element, "marginLeft") +
    computedStyle2Num(element, "marginRight") +
    2 * computedStyle2Num(element, "borderWidth")
  );
};

const computedStyle2Num = (element, styleName) => {
  return +window.getComputedStyle(element)[styleName].replace("px", "");
};

watch(
  () => props.tabIndex,
  (newValue) => {
    activeIndex.value = newValue;

    let curTabElement = itemsRef.value[activeIndex.value];

    let offsetX =
      curTabElement.offsetLeft +
        getElementWidth(curTabElement) -
        tabsWrapper.value.offsetWidth >
      0
        ? curTabElement.offsetLeft +
          getElementWidth(curTabElement) -
          tabsWrapper.value.offsetWidth
        : 0;

    tabsWrapper.value.scrollTo({
      left: offsetX,
      behavior: "smooth",
    });
  }
);
</script>

<style lang="less" scoped>
.tabs {
  display: flex;
  padding: 10px 0;

  &.scroll-tabs {
    overflow-x: auto;

    .tab-item {
      margin: 0 10px;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .tab-item {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    padding: 4px 10px;
    border-radius: 4px;

    &.active {
      background: pink;
    }
  }
}
</style>
