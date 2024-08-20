<template>
  <div
    class="swiper"
    ref="swiper"
    @touchstart="touchStart"
    @touchend="touchEnd"
    @touchmove="touchMove"
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
import { computed, onMounted, ref, watch, defineEmits } from "vue";

const props = defineProps({
  swiperIndex: {
    type: Number,
    default: 0,
  },
});

let swiperWidth = 0;
let swiperLength = ref(0);

const swiper = ref();
const swiperList = ref();
let swiperItemArr = [];

let bannerContentHeight = 0;
let isStickyTop = false;

const swiperListWidth = computed(() => {
  return swiperWidth * swiperLength.value;
});

const emit = defineEmits(["slideChange", "prepareSlide"]);

onMounted(() => {
  swiperWidth = swiper.value.offsetWidth;
  swiperLength.value = swiperList.value.children.length;
  let minHeight = document.body.offsetHeight - swiper.value.offsetTop;

  swiperItemArr = Array.from(swiperList.value.children);

  swiperItemArr.forEach((swiper) => {
    swiper.style.width = swiperWidth + "px";
    //swiper.style.minHeight = minHeight + 'px'
  });

  bannerContentHeight = document.getElementById("bannerContent").clientHeight;
  swiperList.value.style.height = swiperItemArr[0].clientHeight + "px";
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
  // 是否吸顶
  isStickyTop = document.documentElement.scrollTop >= bannerContentHeight;

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
    if (isStickyTop) {
      swiperSlideEnd(swiperItemArr, currentSlide.value);
    }
    // console.log('next')
  }
  if (
    touchMoveX.value > touchStartX.value &&
    offsetX > 100 &&
    currentSlide.value > 0
  ) {
    currentSlide.value--;
    if (isStickyTop) {
      swiperSlideEnd(swiperItemArr, currentSlide.value);
    }
    // console.log('pre')
  }
};

const touchMove = (e) => {
  touchMoveX.value = e.targetTouches[0].clientX;
  touchMoveY.value = e.targetTouches[0].clientY;

  let deltaX = touchMoveX.value - touchStartX.value;
  let deltaY = touchMoveY.value - touchStartY.value;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 主要为横向滑动
    // console.log('Horizontal swipe');
  } else {
    // 主要为纵向滑动
    // console.log('Vertical swipe');
    if (document.documentElement.scrollTop < bannerContentHeight) {
      resetSwiperMargin(swiperItemArr, currentSlide.value);
    }
    return;
  }

  //console.log(touchStartX.value, touchMoveX.value);
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
    emit("prepareSlide", {
      nextSlide: currentSlide.value + 1,
      action: "next",
    });
    swiperList.value.style.height =
      swiperItemArr[currentSlide.value + 1].clientHeight + "px";
    if (isStickyTop && !hasPrepareSlide) {
      setSwiperStyle(swiperItemArr, currentSlide.value, currentSlide.value + 1);
      hasPrepareSlide = true;
    }
    // console.log('prepare next slide')
  }
  if (touchMoveX.value > touchStartX.value && currentSlide.value > 0) {
    // prepare prev slide translate ++
    tempTranslateX.value = offsetX;
    // console.log('prepare prev slide')
    emit("prepareSlide", {
      nextSlide: currentSlide.value - 1,
      action: "preV",
    });
    swiperList.value.style.height =
      swiperItemArr[currentSlide.value - 1].clientHeight + "px";
    if (isStickyTop && !hasPrepareSlide) {
      setSwiperStyle(swiperItemArr, currentSlide.value, currentSlide.value - 1);
      hasPrepareSlide = true;
    }
  }
};

let tabsScrollTop = new Array(swiperLength.value).fill(0);

// 横滑开始
const setSwiperStyle = (swipers, current, next) => {
  // 获取当前 tab 的
  let currentTop = document.documentElement.scrollTop - bannerContentHeight;
  tabsScrollTop[current] = currentTop;

  // 清空当前的 scroll
  //document.documentElement.scrollTop = bannerContentHeight;
  console.log(swipers);
  swipers.forEach((swiper, index) => {
    if (index !== current) {
      let lastTop = tabsScrollTop[index] || 0;
      swiper.style.marginTop = `${-lastTop + currentTop}px`;
    }
  });
};

// 横滑结束
const swiperSlideEnd = (swipers, next) => {
  document.documentElement.scrollTop =
    bannerContentHeight + (tabsScrollTop[next] || 0);
  console.log(tabsScrollTop[next] || 0);
  swipers[next].style.marginTop = "0px";
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

watch(
  () => props.swiperIndex,
  (newValue) => {
    swiperList.value.style.height = swiperItemArr[newValue].clientHeight + "px";
    currentSlide.value = newValue;
  }
);
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
