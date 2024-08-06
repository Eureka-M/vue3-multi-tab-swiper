<template>
  <multi-tab-swiper :tabs="tabs">
    <template #bannerContent>
      <div class="banner-box">
        顶部内容区
      </div>
    </template>
    <div class="tab-content">tab1 content</div>
    <div class="tab-content">tab2 content</div>
    <div class="tab-content">tab3 content</div>
    <div class="tab-content">tab4 content</div>
  </multi-tab-swiper>
</template>

<script setup>
  import { MultiTabSwiper } from '../packages';
  import { ref } from 'vue';

  const tabs = ref(["tab1", "tab2", "tab3", "tab4"]);
</script>

<style scoped>
.banner-box {
  height: 100px;
  background: rgb(247, 214, 220);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
