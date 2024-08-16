<template>
  <multi-tab-swiper :tabs="tabs" @pullupRefresh="pullupRefresh" loadingEnd="isLoadingEnd">
    <!-- <template #refresh>
      刷新中
    </template> -->

    <template #bannerContent>
      <div class="banner-box">
        顶部内容区
      </div>
    </template>

    <div class="tab-content">
      <p>tab1 content</p>
      <div class="data-item" v-for="(item, index) in data1" :key="index">{{ item }}</div>
    </div>
    <div class="tab-content">tab2 content</div>
    <div class="tab-content">tab3 content</div>
    <div class="tab-content">tab4 content</div>
    
  </multi-tab-swiper>
</template>

<script setup>
  import { MultiTabSwiper } from '../packages';
  import { ref } from 'vue';

  const tabs = ref(["tab1", "tab2", "tab3", "tab4"]);

  const data1 = ref(new Array(100).fill(0));

  let isLoadingEnd = ref(false);

  const pullupRefresh = () => {
    setTimeout(() => {
      data1.value = data1.value.unshift('新增数据')
      isLoadingEnd.value = true;
    }, 1000);
  }
</script>

<style scoped>
.banner-box {
  height: 100px;
  background: rgb(247, 214, 220);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-content {

}
</style>
