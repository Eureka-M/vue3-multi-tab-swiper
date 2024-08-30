<template>
  <div class="scroll-view">
    <div class="content">
      <!-- 下拉刷新 -->
      <div
        :style="{ height: `${refreshOffset}px` }"
        :class="[
          'pull-up-refresh',
          {
            animation:
              refreshState == REFRESH_STATE.REFRESHED ||
              (refreshState == REFRESH_STATE.PULLING && !refreshOffset),
          },
        ]"
      >
        <slot :state="refreshState" name="refresh-indicator">
          <span class="loading-text">{{ refreshText }}</span>
        </slot>
      </div>

      <!-- 主体内容 -->
      <div class="main-content">
        <slot></slot>

        <!-- 加载更多 -->
        <div :class="['pull-down-load-more']" ref="loadMore">
          <slot :state="loadMoreState" name="load-more-indicator">
            <span class="load-more-text">{{ loadMoreText }}</span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, computed, watch } from "vue";
import { REFRESH_STATE, LOAD_STATE } from "../enum";

const props = defineProps({
  loadingEnd: {
    type: Boolean,
    default: false,
  },
  hasMore: {
    type: Boolean,
    default: true,
  },
  noMoreDataText: {
    type: String,
    default: "没有更多数据",
  },
});

const emit = defineEmits(["pulldownRefresh", "pullupLoadMore"]);

let isLoadMore = ref(true);
let refreshState = ref(REFRESH_STATE.PULLING);
let loadMoreState = ref(LOAD_STATE.LOAD_MORE);
let refreshOffset = ref(0);

let refreshText = computed(() => {
  switch (refreshState.value) {
    case REFRESH_STATE.PULLING:
      return "下拉刷新";
    case REFRESH_STATE.RELEASING:
      return "松手刷新";
    case REFRESH_STATE.REFRESHING:
      return "刷新中";
    case REFRESH_STATE.REFRESHED:
      return "刷新成功";
  }
});

let loadMoreText = computed(() => {
  switch (loadMoreState.value) {
    case LOAD_STATE.LOAD_MORE:
      return "上拉加载更多";
    case LOAD_STATE.LOADING:
      return "加载中";
    case LOAD_STATE.NO_MORE_DATA:
      return "没有更多数据啦";
  }
});

watch(
  () => props.loadingEnd,
  (value) => {
    if (value) {
      // 上拉加载
      if (isLoadMore.value) {
        loadMoreState.value = LOAD_STATE.LOAD_MORE;
      } else {
        // 下拉刷新
        refreshState.value = REFRESH_STATE.REFRESHED;
        refreshOffset.value = 0;
      }
    }
  }
);

watch(
  () => props.hasMore,
  (value) => {
    if (value) {
      loadMoreState.value = LOAD_STATE.LOAD_MORE;
    } else {
      loadMoreState.value = LOAD_STATE.NO_MORE_DATA;
    }
  }
);

const DISTANCE_Y_MAX_LIMIT = 100;

let touchStartX = ref(0);
let touchStartY = ref(0);
let touchMoveX = ref(0);
let touchMoveY = ref(0);
let isAtTopOnTouchStart = ref(false);

const touchStart = (e) => {
  if (refreshState.value === REFRESH_STATE.REFRESHING) return;

  refreshState.value = REFRESH_STATE.PULLING;
  touchStartX.value = e.targetTouches[0].clientX;
  touchStartY.value = e.targetTouches[0].clientY;
  isAtTopOnTouchStart.value = document.documentElement.scrollTop === 0;
};

const touchMove = (e) => {
  if (refreshState.value === REFRESH_STATE.REFRESHING) return;

  touchMoveX.value = e.targetTouches[0].clientX;
  touchMoveY.value = e.targetTouches[0].clientY;

  let deltaX = touchMoveX.value - touchStartX.value;
  let deltaY = touchMoveY.value - touchStartY.value;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 主要为横向滑动
    // console.log('Horizontal swipe');
    return;
  }

  if (touchStartY.value > touchMoveY.value) {
    return;
  }

  if (isAtTopOnTouchStart.value) {
    refreshOffset.value = Math.abs(touchMoveY.value - touchStartY.value);

    // 阻尼效果
    let percent = (100 - refreshOffset.value * 0.5) / 100;
    percent = Math.max(0.5, percent);
    refreshOffset.value = refreshOffset.value * percent;

    if (refreshOffset.value < 50) {
      refreshState.value = REFRESH_STATE.PULLING;
    } else {
      refreshState.value = REFRESH_STATE.RELEASING;
    }

    if (refreshOffset.value > DISTANCE_Y_MAX_LIMIT) {
      refreshOffset.value = DISTANCE_Y_MAX_LIMIT;
    }
  }
};

const touchEnd = (e) => {
  if (refreshOffset.value < 50) {
    // 不刷新
    refreshOffset.value = 0;
    return;
  }

  // 下拉刷新
  // 让加载中停留一会
  isLoadMore.value = false;
  setTimeout(() => {
    emit("pulldownRefresh");
  }, 500);

  refreshState.value = REFRESH_STATE.REFRESHING;
  return;
};

const loadMore = ref();
let io = null;

const bindEvents = () => {
  document.addEventListener("touchstart", touchStart);
  document.addEventListener("touchmove", touchMove);
  document.addEventListener("touchend", touchEnd);

  io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && loadMoreState.value === LOAD_STATE.LOAD_MORE) {
      isLoadMore.value = true;
      setTimeout(() => {
        emit("pullupLoadMore");
      }, 500);

      loadMoreState.value = LOAD_STATE.LOADING;
    }
  });
  io.observe(loadMore.value);
};

const unBindEvents = () => {
  document.removeEventListener("touchstart", touchStart);
  document.removeEventListener("touchmove", touchMove);
  document.removeEventListener("touchend", touchEnd);

  io.disconnect();
};

onMounted(() => {
  bindEvents();
});

onBeforeUnmount(() => {
  unBindEvents();
});
</script>

<style lang="less" scoped>
.pull-up-refresh {
  display: flex;
  justify-content: center;
  align-items: flex-end;

  .loading-text {
    margin-bottom: 10px;
  }

  &.animation {
    transition: height 0.5s;
  }
}

.pull-down-load-more {
  display: flex;
  justify-content: center;
  .load-more-text {
    margin: 10px 0;
  }
}
</style>
