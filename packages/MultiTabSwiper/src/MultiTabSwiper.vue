<template>
  <scroll-view 
    :loadingEnd="loadingEnd"
    @pulldonwRefresh="pulldonwRefresh"
    @pullupLoadMore="pullupLoadMore"
  >
    <template #refresh>
      <slot name="refresh"></slot>
    </template>

    <div class="banner-content" id="bannerContent">
      <slot name="bannerContent"></slot>
    </div>

    <div class="tabs-wrapper">
      <Tab :tabs="tabs" :tabIndex="activeIndex" @tabChange="tabChange" />
    </div>

    <Swiper 
      :swiperIndex="activeIndex"
      @slideChange="slideChange"
    >
        <slot></slot>
    </Swiper>

  </scroll-view>
</template>

<script setup>
  import { ref } from 'vue'
  import Tab from './Tab.vue'
  import Swiper from './Swiper.vue'
  import ScrollView from './ScrollView.vue'

  const props = defineProps({
    tabs: {
      type: Array,
      default: () => []
    },
    loadingEnd: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['pulldonwRefresh', 'pullupLoadMore'])

  let activeIndex = ref(0)

  const slideChange = (value) => {
    activeIndex.value = value
  }

  const tabChange = (value) => {
    activeIndex.value = value
  }

  const pulldonwRefresh = () => {
    emit('pulldonwRefresh')
  }

  const pullupLoadMore = () => {
    emit('pullupLoadMore')
  }
</script>


<style scoped>
.tabs-wrapper {
  position: sticky;
  top: 0;
  z-index: 999;
  background: #e7acb6;
}
</style>
