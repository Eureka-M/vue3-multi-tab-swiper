<template>
  <div class="banner-content">
    <slot name="bannerContent"></slot>
  </div>
  <div class="tabs-wrapper">
    <Tab :tabs="tabs" :tabIndex="activeIndex" @tabChange="tabChange" />
  </div>
  <Swiper :swiperIndex="activeIndex" @slideChange="slideChange">
    <slot></slot>
  </Swiper>
  
</template>

<script setup>
  import { ref } from 'vue';
  import Tab from './Tab.vue';
  import Swiper from './Swiper.vue';

  const props = defineProps({
    tabs: {
      type: Array,
      default: () => []
    }
  })

  let activeIndex = ref(0);

  const slideChange = (value) => {
    activeIndex.value = value;
  }

  const tabChange = (value) => {
    activeIndex.value = value;
  }
</script>


<style scoped>

</style>
