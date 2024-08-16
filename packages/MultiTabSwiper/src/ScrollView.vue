<template>
  <div class="scroll-view">
    <div class="pull-up-refresh" v-show="isRefresh" :style="{ height: `${refreshOffset}px`}">
      <slot name="refresh">
        <div class="loading-text">
          {{ refreshText }}
        </div>
      </slot>
    </div>
    <slot></slot>

    <div class="pull-down-load-more" v-show="isLoadMore">
      <slot name="loadMore"></slot>
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
      default: '加载中'
    },
    refreshSuccessText: {
      type: String,
      default: '刷新成功'
    },
    loadingEnd: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['pullupRefresh'])

  let isRefresh = ref(false)
  let isLoadMore = ref(false)
  let refreshState = ref(0)
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

  watch(() => props.loadingEnd, (value) => {
    if (value) {
      refreshState.value = 0
      isRefresh.value = false
    }
  })


  let touchStartY = ref(0)
  let touchMoveY = ref(0)
  const touchStart = (e) => {
    console.log('touchStart')
    isRefresh.value = true
    touchStartY.value = e.targetTouches[0].clientY
  }

  const touchMove = (e) => {
    touchMoveY.value = e.targetTouches[0].clientY
    refreshOffset.value = touchMoveY.value - touchStartY.value
    refreshState.value = 0
  }

  const touchEnd = (e) => {
    emit('pullupRefresh')
  }

  const bindEvents = () => {
    document.addEventListener('touchstart', touchStart)
    document.addEventListener('touchmove', touchMove)
    document.addEventListener('touchend', touchEnd)
  }

  const unBindEvents = () => {
    document.removeEventListener('touchstart', touchStart)
    document.removeEventListener('touchmove', touchMove)
    document.removeEventListener('touchend', touchEnd)
  }

  onMounted(() => {
    bindEvents()
  })

  onBeforeUnmount(() => {
    unBindEvents()
  })
</script>