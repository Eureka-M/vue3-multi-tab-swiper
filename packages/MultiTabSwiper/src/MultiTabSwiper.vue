<template>
  <scroll-view @pullupRefresh="pullupRefresh" :loadingEnd="loadingEnd">
    <template #refresh>
      <slot name="refresh"></slot>
    </template>

    <div class="banner-content">
      <slot name="bannerContent"></slot>
    </div>

    <div class="tabs-wrapper">
      <Tab :tabs="tabs" :tabIndex="activeIndex" @tabChange="tabChange" />
    </div>

    <Swiper :swiperIndex="activeIndex" @slideChange="slideChange">
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

  const emit = defineEmits(['pullupRefresh'])

  let activeIndex = ref(0)

  const slideChange = (value) => {
    activeIndex.value = value
  }

  const tabChange = (value) => {
    activeIndex.value = value
  }

  const pullupRefresh = () => {
    emit('pullupRefresh')
  }
</script>


<style scoped>

</style>
