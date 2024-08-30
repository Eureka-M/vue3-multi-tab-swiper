<template>
  <scroll-view
    :hasMore="hasMoreData"
    :loadingEnd="loadingEnd"
    @pulldownRefresh="pulldownRefresh"
    @pullupLoadMore="pullupLoadMore"
  >
    <template #refresh-indicator="{ state }">
      <slot name="refresh-indicator" :state="state"></slot>
    </template>

    <template #load-more-indicator="{ state }">
      <slot name="load-more-indicator" :state="state"></slot>
    </template>

    <div class="banner-content" id="bannerContent">
      <slot name="banner-content"></slot>
    </div>

    <div class="tabs-wrapper">
      <Tab :tabs="tabs" :tabIndex="activeIndex" @tabChange="tabChange" />
    </div>

    <Swiper
      :loadingEnd="loadingEnd"
      :swiperIndex="activeIndex"
      @slideChange="slideChange"
      ref="swiperRef"
    >
      <slot></slot>
    </Swiper>
  </scroll-view>
</template>

<script setup>
import { onMounted, ref, toRef, watch } from "vue";
import Tab from "./components/Tab.vue";
import Swiper from "./components/Swiper.vue";
import ScrollView from "./components/ScrollView.vue";

const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  loadingEnd: {
    type: Boolean,
    default: false,
  },
  hasMore: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["pulldownRefresh", "pullupLoadMore", "activeChange"]);

let activeIndex = ref(0);

let hasMoreData = ref(props.hasMore);
let cacheTabHasMore = new Array(props.tabs.length).fill(true);
cacheTabHasMore[activeIndex] = props.hasMore;

const slideChange = (value) => {
  hasMoreData.value = cacheTabHasMore[value];
  activeIndex.value = value;
};

const tabChange = (value) => {
  hasMoreData.value = cacheTabHasMore[value];
  activeIndex.value = value;
};

watch(
  () => activeIndex.value,
  (newValue) => {
    emit("activeChange", newValue);
  }
);

watch(
  () => props.hasMore,
  (value) => {
    hasMoreData.value = value;
    cacheTabHasMore[activeIndex.value] = value;
  }
);

const pulldownRefresh = () => {
  emit("pulldownRefresh");
};

const pullupLoadMore = () => {
  emit("pullupLoadMore");
};

const swiperRef = ref();

const verifyTabSwiperLengthMatch = () => {
  let isMatch = props.tabs.length === swiperRef.value.getSwiperLength();
  if (!isMatch) {
    throw new Error("The number of tabs and swipers does not match");
  }
};

onMounted(() => {
  verifyTabSwiperLengthMatch();
});
</script>

<style scoped lang="less">
.tabs-wrapper {
  position: sticky;
  top: 0;
  z-index: 999;
  background: #fff;
}
</style>
