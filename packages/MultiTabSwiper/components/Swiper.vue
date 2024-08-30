<template>
  <div
    class="swiper"
    ref="swiper"
    @touchstart.passive="touchStart"
    @touchend.passive="touchEnd"
    @touchmove.passive="touchMove"
  >
    <div
      class="swiper-item"
      ref="swiperList"
      :style="{
        width: swiperListWidth + 'px',
        transform: 'translateX(' + translateX + 'px)',
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch,
  defineEmits,
  nextTick,
  reactive,
} from "vue";

const props = defineProps({
  swiperIndex: {
    type: Number,
    default: 0,
  },
  loadingEnd: {
    type: Boolean,
    default: false,
  },
});

let swiperWidth = 0;
let swiperLength = ref(0);

const swiper = ref();
const swiperList = ref();
let swiperItemArr = [];

let bannerContentHeight = 0;

const swiperListWidth = computed(() => {
  return swiperWidth * swiperLength.value;
});

const emit = defineEmits(["slideChange"]);

let tabsScrollTop = reactive([]);

onMounted(() => {
  swiperWidth = swiper.value.offsetWidth;
  swiperLength.value = swiperList.value.children.length;

  swiperItemArr = Array.from(swiperList.value.children);

  swiperItemArr.forEach((swiper) => {
    swiper.style.width = swiperWidth + "px";
  });

  bannerContentHeight = document.getElementById("bannerContent").clientHeight;
  swiperList.value.style.height = swiperItemArr[0].clientHeight + "px";

  tabsScrollTop = new Array(swiperLength.value).fill(0);
});

let currentSlide = ref(0);
let touchStartX = ref(0);
let touchStartY = ref(0);
let touchMoveX = ref(0);
let touchMoveY = ref(0);
let tempTranslateX = ref(0);

let hasPrepareSlide = false;

const translateX = computed(() => {
  return -currentSlide.value * swiperWidth + tempTranslateX.value;
});

const touchStart = (e) => {
  touchStartX.value = e.targetTouches[0].clientX;
  touchStartY.value = e.targetTouches[0].clientY;
  touchMoveX.value = 0;
  touchMoveY.value = 0;

  hasPrepareSlide = false;
};

const touchEnd = () => {
  tempTranslateX.value = 0;
  if (touchMoveX.value === 0 || touchMoveY.value === 0) {
    return;
  }
  let offsetX = Math.abs(touchStartX.value - touchMoveX.value);
  if (
    touchMoveX.value < touchStartX.value &&
    offsetX > 100 &&
    currentSlide.value < swiperLength.value - 1
  ) {
    currentSlide.value++;
  }
  if (
    touchMoveX.value > touchStartX.value &&
    offsetX > 100 &&
    currentSlide.value > 0
  ) {
    currentSlide.value--;
  }
};

const touchMove = (e) => {
  touchMoveX.value = e.targetTouches[0].clientX;
  touchMoveY.value = e.targetTouches[0].clientY;

  let deltaX = touchMoveX.value - touchStartX.value;
  let deltaY = touchMoveY.value - touchStartY.value;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
  } else {
    // Vertical swipe
    if (!isStickyTop()) {
      resetSwiperMargin(swiperItemArr, currentSlide.value);
    }
    return;
  }

  let offsetX = Math.abs(touchStartX.value - touchMoveX.value);

  if (offsetX < 30) {
    return;
  }

  if (
    touchMoveX.value < touchStartX.value &&
    currentSlide.value < swiperLength.value - 1
  ) {
    // prepare next slide translate --
    tempTranslateX.value = -offsetX;

    if (isStickyTop() && !hasPrepareSlide) {
      setSwiperStyle(swiperItemArr, currentSlide.value, currentSlide.value + 1);
      hasPrepareSlide = true;
    }
    // console.log('prepare next slide')
  }
  if (touchMoveX.value > touchStartX.value && currentSlide.value > 0) {
    // prepare prev slide translate ++
    tempTranslateX.value = offsetX;
    // console.log('prepare prev slide')
    if (isStickyTop() && !hasPrepareSlide) {
      setSwiperStyle(swiperItemArr, currentSlide.value, currentSlide.value - 1);
      hasPrepareSlide = true;
    }
  }
};

// 横滑开始
const setSwiperStyle = (swipers, current, next) => {
  // 当前 tab 的 顶部偏移量
  let currentTop = document.documentElement.scrollTop - bannerContentHeight;
  // 记录当前 tab 的 滚动距离
  tabsScrollTop[current] = currentTop;

  swipers.forEach((swiper, index) => {
    if (index !== current) {
      let lastTop = tabsScrollTop[index] || 0;
      swiper.style.marginTop = `${-lastTop + currentTop}px`;
    }
  });
};

const resetSwiperMargin = (swipers, current) => {
  swipers.forEach((swiper, index) => {
    if (index !== current) {
      swiper.style.marginTop = `0px`;
    }
  });
  tabsScrollTop = new Array(swiperLength.value).fill(0);
};

watch(
  () => currentSlide.value,
  (newValue) => {
    emit("slideChange", newValue);
  }
);

// 横滑结束或者是tab点击，判断是否吸顶，设置滚动位置
watch(
  () => props.swiperIndex,
  (newValue, oldValue) => {
    currentSlide.value = newValue;

    if (isStickyTop()) {
      let currentTop = document.documentElement.scrollTop - bannerContentHeight;
      tabsScrollTop[oldValue] = currentTop;

      swiperList.value.style.height =
        swiperItemArr[newValue].clientHeight + "px";

      swiperItemArr.forEach((swiper, index) => {
        swiper.style.marginTop = "0px";
      });

      document.documentElement.scrollTop =
        bannerContentHeight + (tabsScrollTop[newValue] || 0);
    }
  }
);

watch(
  () => props.loadingEnd,
  (newValue) => {
    if (newValue) {
      nextTick(() => {
        swiperList.value.style.height =
          swiperItemArr[currentSlide.value].clientHeight + "px";
      });
    }
  }
);

const getSwiperLength = () => {
  return swiperItemArr.length;
};

const isStickyTop = () => {
  return document.documentElement.scrollTop >= bannerContentHeight;
};

defineExpose({
  getSwiperLength,
});
</script>

<style lang="less" scoped>
.swiper {
  overflow-x: hidden;

  .swiper-item {
    display: flex;
    transition: transform 0.3s;
    align-items: flex-start;
    overflow-y: hidden;
  }
}
</style>
