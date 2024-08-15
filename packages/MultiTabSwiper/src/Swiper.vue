<template>
  <div class="swiper" ref="swiper" @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove">
    <div 
      class="swiper-item"
      ref="swiperList"
      :style="{width: swiperListWidth + 'px', transform: 'translateX(' + translateX + 'px)'}"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref, watch, defineEmits } from 'vue'

  const props = defineProps({
    swiperIndex: {
      type: Number,
      default: 0
    }
  })

  let swiperWidth = 0
  let swiperLength = ref(0)

  const swiper = ref()
  const swiperList = ref()

  const swiperListWidth = computed(() => {
    return swiperWidth * swiperLength.value
  })

  const emit = defineEmits(['slideChange'])

  onMounted(() => {
    swiperWidth = swiper.value.offsetWidth
    swiperLength.value = swiperList.value.children.length
    let minHeight = document.body.offsetHeight - swiper.value.offsetTop

    Array.from(swiperList.value.children).forEach((swiper) => {
      swiper.style.width = swiperWidth + 'px'
      swiper.style.minHeight = minHeight + 'px'
    })
  })

  let currentSlide = ref(0)
  let touchStartX = ref(0)
  let touchStartY = ref(0)
  let touchMoveX = ref(0)
  let touchMoveY = ref(0)
  let tempTranslateX = ref(0)

  const translateX = computed(() => {
    return -currentSlide.value * swiperWidth + tempTranslateX.value
  })

  const touchStart = (e) => {
    touchStartX.value = e.targetTouches[0].clientX
    touchStartY.value = e.targetTouches[0].clientY
    touchMoveX.value = 0
    touchMoveY.value = 0
  }

  const touchEnd = () => {
    tempTranslateX.value = 0
    if (touchMoveX.value === 0 || touchMoveY.value === 0) {
      return
    }
    let offsetX = Math.abs(touchStartX.value - touchMoveX.value)
    if (touchMoveX.value < touchStartX.value && offsetX > 100 && currentSlide.value < swiperLength.value - 1) {
      currentSlide.value++
      // console.log('next')
      
    }
    if (touchMoveX.value > touchStartX.value && offsetX > 100 && currentSlide.value > 0) {
      currentSlide.value--
      // console.log('pre')
    }
  }

  const touchMove = (e) => {
    touchMoveX.value = e.targetTouches[0].clientX
    touchMoveY.value = e.targetTouches[0].clientY

    let deltaX = touchMoveX.value - touchStartX.value
    let deltaY = touchMoveY.value - touchStartY.value
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 主要为横向滑动
        // console.log('Horizontal swipe');
    } else {
      // 主要为纵向滑动
      // console.log('Vertical swipe');
      return
    }

    //console.log(touchStartX.value, touchMoveX.value);
    let offsetX = Math.abs(touchStartX.value - touchMoveX.value)

    if (offsetX < 30) {
      return
    }

    if (touchMoveX.value < touchStartX.value && currentSlide.value < swiperLength.value - 1) {
      // prepare next slide translate --
      tempTranslateX.value = -offsetX
      // console.log('prepare next slide')

    }
    if (touchMoveX.value > touchStartX.value && currentSlide.value > 0) {
      // prepare prev slide translate ++
      tempTranslateX.value = offsetX
      // console.log('prepare prev slide')
    }
    
  }

  watch(() => currentSlide.value, (newValue) => {
    emit('slideChange', newValue)
  })

  watch(() => props.swiperIndex, (newValue) => {
    currentSlide.value = newValue
  })
</script>


<style lang="less" scoped>
  .swiper {
    overflow-x: hidden;

    .swiper-item {
      display: flex;
      transition: transform 0.3s;
    }
  }
</style>