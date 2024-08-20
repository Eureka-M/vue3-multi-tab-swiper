<template>
  <multi-tab-swiper
    :tabs="tabs"
    :loadingEnd="isLoadingEnd"
    @pulldonwRefresh="pulldonwRefresh"
    @pullupLoadMore="pullupLoadMore"
  >
    <!-- <template #refresh>
      刷新中
    </template> -->

    <template #bannerContent>
      <div class="banner-box">顶部内容区</div>
    </template>

    <div class="tab-content">
      <p>tab1 content</p>
      <div class="data-item" v-for="(item, index) in data1" :key="index">
        <span>{{ index }}</span>
        <span>{{ index }}</span>
      </div>
    </div>
    <div class="tab-content">
      <p>tab2 content</p>
      <div class="data-item" v-for="(item, index) in data2" :key="index">
        <span>{{ index }}</span>
        <span>{{ index }}</span>
      </div>
    </div>
    <div class="tab-content">
      <p>tab3 content</p>
      <div class="data-item" v-for="(item, index) in data3" :key="index">
        <span>{{ index }}</span>
        <span>{{ index }}</span>
      </div>
    </div>
    <div class="tab-content">
      <p>tab4 content</p>
      <div class="data-item" v-for="(item, index) in data4" :key="index">
        <span>{{ index }}</span>
        <span>{{ index }}</span>
      </div>
    </div>
  </multi-tab-swiper>
</template>

<script setup>
import { MultiTabSwiper } from "../packages";
import { ref } from "vue";

const tabs = ref(["tab1", "tab2", "tab3", "tab4"]);

const data1 = ref(new Array(100).fill(0));
const data2 = ref(new Array(50).fill(0));
const data3 = ref(new Array(60).fill(0));
const data4 = ref(new Array(80).fill(0));

let isLoadingEnd = ref(false);

const pulldonwRefresh = () => {
  isLoadingEnd.value = false;
  setTimeout(() => {
    data1.value.unshift("下拉刷新数据");
    isLoadingEnd.value = true;
  }, 1000);
};

const pullupLoadMore = () => {
  isLoadingEnd.value = false;
  setTimeout(() => {
    data1.value.push("上拉加载数据");
    isLoadingEnd.value = true;
  }, 1000);
};
</script>

<style scoped lang="less">
.banner-box {
  height: 100px;
  background: rgb(247, 214, 220);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-content {
  .data-item {
    display: flex;
    justify-content: space-between;
  }
}
</style>
