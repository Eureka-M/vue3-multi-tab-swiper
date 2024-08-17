<template>
  <div class="scroll-view">
    <div class="content">
      <div :style="{ height: `${refreshOffset}px`}" :class="['pull-up-refresh', {'animation': refreshState == 2 }]">
        <slot name="refresh">
          <div class="loading-text">
            {{ refreshText }}
          </div>
        </slot>
      </div>
      <slot></slot>

      <div :class="['pull-down-load-more', {'animation': loadMoreState == 1 }]">
        <slot name="loadMore">
          <div class="load-more-text">
            {{ loadMoreText }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue'

  const props = defineProps({
    pullingText: {
      type: String,
      default: '释放刷新'
    },
    loadingText: {
      type: String,
      default: '加载中...'
    },
    refreshSuccessText: {
      type: String,
      default: '刷新成功'
    },
    loadMoreText: {
      type: String,
      default: '上拉加载'
    },
    loadingEnd: {
      type: Boolean,
      default: false
    },
    noMoreData: {
      type: Boolean,
      default: false
    },
    noMoreDataText: {
      type: String,
      default: '没有更多数据'
    }
  })

  const emit = defineEmits(['pulldonwRefresh', 'pullupLoadMore'])

  let isLoadMore = ref(true)
  let refreshState = ref(0)
  let loadMoreState = ref(0)
  let refreshOffset = ref(0)

  let refreshText = computed(() => {
    switch (refreshState.value) {
      case 0:
        return props.pullingText
      case 1:
        return props.loadingText
      case 2:
        return props.refreshSuccessText
    }
  })

  let loadMoreText = computed(() => {
    switch (loadMoreState.value) {
      case 0:
        return props.loadMoreText
      case 1:
        return props.loadingText
    }
  })

  watch(() => props.loadingEnd, (value) => {
    if (value) {
      if (isLoadMore.value) {
        loadMoreState.value = 0
      } else {
        refreshState.value = 2
        refreshOffset.value = 0
      }
    }
  })

  const DISTANCE_Y_MAX_LIMIT = 100

  let touchStartX = ref(0)
  let touchStartY = ref(0)
  let touchMoveX = ref(0)
  let touchMoveY = ref(0)
  let isAtTopOnTouchStart = ref(false)

  const touchStart = (e) => {
    if (refreshState.value === 1) return;
    console.log('touchStart')
    refreshState.value = 0
    touchStartX.value = e.targetTouches[0].clientX
    touchStartY.value = e.targetTouches[0].clientY
    isAtTopOnTouchStart.value = document.documentElement.scrollTop === 0
  }

  const touchMove = (e) => {
    if (refreshState.value === 1) return;

    touchMoveX.value = e.targetTouches[0].clientX
    touchMoveY.value = e.targetTouches[0].clientY

    let deltaX = touchMoveX.value - touchStartX.value
    let deltaY = touchMoveY.value - touchStartY.value
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 主要为横向滑动
        // console.log('Horizontal swipe');
      return
    }

    if (touchStartY.value > touchMoveY.value) {
      return
    }

    if (isAtTopOnTouchStart.value) {
      refreshOffset.value = Math.abs(touchMoveY.value - touchStartY.value)

      // 阻尼效果
      let percent = (100 - refreshOffset.value * 0.5) / 100
      percent = Math.max(0.5, percent)
      refreshOffset.value = refreshOffset.value * percent
      if (refreshOffset.value > DISTANCE_Y_MAX_LIMIT) {
        refreshOffset.value = DISTANCE_Y_MAX_LIMIT
      }
    }
  }

  const touchEnd = (e) => {
    
    if (refreshOffset.value < 20) {
      return
    }

    // 下拉刷新
    // 让加载中停留一会
    isLoadMore.value = false
    setTimeout(() => {
      emit('pulldonwRefresh')
    }, 500)
    
    refreshState.value = 1
    return
  }

  const documentScroll = (e) => {
    let isBottom = document.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight
    if (isBottom && loadMoreState.value === 0) {
      isLoadMore.value = true
      setTimeout(() => {
        emit('pullupLoadMore')
      }, 500)

      loadMoreState.value = 1
    }
  }

  const bindEvents = () => {
    document.addEventListener('touchstart', touchStart, { passive: false })
    document.addEventListener('touchmove', touchMove, { passive: false })
    document.addEventListener('touchend', touchEnd, { passive: false })
    document.addEventListener('scroll', documentScroll, { passive: false })
  }

  const unBindEvents = () => {
    document.removeEventListener('touchstart', touchStart)
    document.removeEventListener('touchmove', touchMove)
    document.removeEventListener('touchend', touchEnd)
    document.removeEventListener('scroll', documentScroll)
  }

  onMounted(() => {
    bindEvents()
  })

  onBeforeUnmount(() => {
    unBindEvents()
  })
</script>

<style lang="less" scoped>
  .pull-up-refresh {
    display: flex;
    align-items: flex-end;

    .loading-text {
      margin: 0 auto;
      text-align: center;
      margin-bottom: 10px;
    }

    &.animation {
      transition: height 0.5s;
    }
  }

  .pull-down-load-more {
    .load-more-text {
      text-align: center;
      margin: 10px 0;
    }

    &.animation {
      transition: height 0.5s;
    }
  }
</style>