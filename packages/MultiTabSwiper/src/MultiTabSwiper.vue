<template>
  <div class="banner-content">
    <slot name="bannerContent"></slot>
  </div>
  <div class="tabs-wrapper">
    <Tab :tabs="tabs"/>
  </div>
  <div class="content-swiper">
    <Swiper>
      <slot></slot>
    </Swiper>
  </div>
  
</template>

<script setup>
  import { defineProps } from 'vue';
  import Tab from './Tab.vue';
  import Swiper from './Swiper.vue';

  const props = defineProps({
    tabs: {
      type: Array,
      default: () => []
    }
  })
</script>


<style scoped>

</style>
