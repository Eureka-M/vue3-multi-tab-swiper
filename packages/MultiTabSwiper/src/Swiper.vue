<template>
  <div class="swiper" ref="swiper">
    <div 
      class="swiper-item"
      ref="swiperList"
      :style="{width: swiperListWidth + 'px', transform: 'translateX(' + translateX + 'px)', transitionDuration: transitionDuration + 's' }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';

  let swiperWidth = 0;
  let swiperLength = 0;
  const swiper = ref();
  const swiperList = ref();

  const swiperListWidth = computed(() => {
    return swiperWidth * swiperLength;
  })

  onMounted(() => {
    swiperWidth = swiper.value.offsetWidth;
    swiperLength = swiperList.value.children.length;
    console.log(swiperWidth, swiperLength)
  })
</script>