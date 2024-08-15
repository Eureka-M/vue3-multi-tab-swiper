<template>
  <div class="scroll-view">
    <div class="pull-up-refresh" v-show="isRefresh">
      <slot name="refresh">
        <div class="refresh">
          <span class="before-loadding">松手加载</span>
          <span class="loading">加载中</span>
          <span class="loaded">加载完成</span>
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
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  let isRefresh = ref(false)
  let isLoadMore = ref(false)

  const touchStart = (e) => {
    e.preventDefault()
  }

  const touchMove = (e) => {
    e.preventDefault()
  }

  const touchEnd = (e) => {
    e.preventDefault()
  }

  const bindEvents = () => {
    document.addEventListener('touchStart', touchStart)
    document.addEventListener('touchMove', touchMove)
    document.addEventListener('touchEnd', touchEnd)
  }

  const unBindEvents = () => {
    document.removeEventListener('touchStart', touchStart)
    document.removeEventListener('touchMove', touchMove)
    document.removeEventListener('touchEnd', touchEnd)
  }

  onMounted(() => {
    bindEvents()
  })

  onBeforeUnmount(() => {
    unBindEvents()
  })
</script>