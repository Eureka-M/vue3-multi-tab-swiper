import { ref as l, watch as y, openBlock as O, createElementBlock as C, Fragment as ee, renderList as te, normalizeClass as Y, unref as p, toDisplayString as W, computed as k, reactive as ae, onMounted as U, nextTick as le, createElementVNode as R, normalizeStyle as K, renderSlot as I, onBeforeUnmount as ne, createBlock as oe, withCtx as H, createVNode as j } from "vue";
const P = (c, T) => {
  const h = c.__vccOpts || c;
  for (const [m, n] of T)
    h[m] = n;
  return h;
}, re = ["onClick"], se = {
  __name: "Tab",
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    tabIndex: {
      type: Number,
      default: 0
    }
  },
  emits: ["tabChange"],
  setup(c, { emit: T }) {
    const h = c, m = T;
    let n = l(0);
    const a = (t) => {
      n.value = t;
    };
    y(
      () => n.value,
      (t) => {
        m("tabChange", t);
      }
    );
    const s = l(), o = l([]), d = (t) => {
      t && o.value.push(t);
    }, g = (t) => t.offsetWidth + _(t, "marginLeft") + _(t, "marginRight") + 2 * _(t, "borderWidth"), _ = (t, u) => +window.getComputedStyle(t)[u].replace("px", "");
    return y(
      () => h.tabIndex,
      (t) => {
        n.value = t;
        let u = o.value[n.value], e = u.offsetLeft + g(u) - s.value.offsetWidth > 0 ? u.offsetLeft + g(u) - s.value.offsetWidth : 0;
        s.value.scrollTo({
          left: e,
          behavior: "smooth"
        });
      }
    ), (t, u) => (O(), C("div", {
      class: "tabs scroll-tabs",
      ref_key: "tabsWrapper",
      ref: s
    }, [
      (O(!0), C(ee, null, te(c.tabs, (e, v) => (O(), C("span", {
        ref_for: !0,
        ref: d,
        key: v,
        class: Y(["tab-item", { active: v === p(n) }]),
        onClick: (b) => a(v)
      }, W(e), 11, re))), 128))
    ], 512));
  }
}, ue = /* @__PURE__ */ P(se, [["__scopeId", "data-v-ae81a61b"]]), ie = {
  __name: "Swiper",
  props: {
    swiperIndex: {
      type: Number,
      default: 0
    },
    loadingEnd: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["slideChange"],
  setup(c, { expose: T, emit: h }) {
    const m = c;
    let n = 0, a = l(0);
    const s = l(), o = l();
    let d = [], g = 0;
    const _ = k(() => n * a.value), t = h;
    let u = ae([]);
    U(() => {
      n = s.value.offsetWidth, a.value = o.value.children.length, d = Array.from(o.value.children), d.forEach((r) => {
        r.style.width = n + "px";
      }), g = document.getElementById("bannerContent").clientHeight, o.value.style.height = d[0].clientHeight + "px", u = new Array(a.value).fill(0);
    });
    let e = l(0), v = l(0), b = l(0), E = l(0), A = l(0), x = l(0), L = !1;
    const B = k(() => -e.value * n + x.value), F = (r) => {
      v.value = r.targetTouches[0].clientX, b.value = r.targetTouches[0].clientY, E.value = 0, A.value = 0, L = !1;
    }, i = () => {
      if (x.value = 0, E.value === 0 || A.value === 0)
        return;
      let r = Math.abs(v.value - E.value);
      E.value < v.value && r > 100 && e.value < a.value - 1 && e.value++, E.value > v.value && r > 100 && e.value > 0 && e.value--;
    }, G = (r) => {
      E.value = r.targetTouches[0].clientX, A.value = r.targetTouches[0].clientY;
      let w = E.value - v.value, N = A.value - b.value;
      if (!(Math.abs(w) > Math.abs(N))) {
        $() || D(d, e.value);
        return;
      }
      let M = Math.abs(v.value - E.value);
      M < 30 || (E.value < v.value && e.value < a.value - 1 && (x.value = -M, $() && !L && (X(d, e.value, e.value + 1), L = !0)), E.value > v.value && e.value > 0 && (x.value = M, $() && !L && (X(d, e.value, e.value - 1), L = !0)));
    }, X = (r, w, N) => {
      let M = document.documentElement.scrollTop - g;
      u[w] = M, r.forEach((z, V) => {
        if (V !== w) {
          let Z = u[V] || 0;
          z.style.marginTop = `${-Z + M}px`;
        }
      });
    }, D = (r, w) => {
      r.forEach((N, M) => {
        M !== w && (N.style.marginTop = "0px");
      }), u = new Array(a.value).fill(0);
    };
    y(
      () => e.value,
      (r) => {
        t("slideChange", r);
      }
    ), y(
      () => m.swiperIndex,
      (r, w) => {
        if (e.value = r, $()) {
          let N = document.documentElement.scrollTop - g;
          u[w] = N, o.value.style.height = d[r].clientHeight + "px", d.forEach((M, z) => {
            M.style.marginTop = "0px";
          }), document.documentElement.scrollTop = g + (u[r] || 0);
        }
      }
    ), y(
      () => m.loadingEnd,
      (r) => {
        r && le(() => {
          o.value.style.height = d[e.value].clientHeight + "px";
        });
      }
    );
    const Q = () => d.length, $ = () => document.documentElement.scrollTop >= g;
    return T({
      getSwiperLength: Q
    }), (r, w) => (O(), C("div", {
      class: "swiper",
      ref_key: "swiper",
      ref: s,
      onTouchstartPassive: F,
      onTouchendPassive: i,
      onTouchmovePassive: G
    }, [
      R("div", {
        class: "swiper-item",
        ref_key: "swiperList",
        ref: o,
        style: K({
          width: _.value + "px",
          transform: "translateX(" + B.value + "px)"
        })
      }, [
        I(r.$slots, "default", {}, void 0, !0)
      ], 4)
    ], 544));
  }
}, ce = /* @__PURE__ */ P(ie, [["__scopeId", "data-v-d55aacb3"]]), f = {
  PULLING: "pulling",
  // 下拉
  RELEASING: "releasing",
  // 松开
  REFRESHING: "refreshing",
  // 刷新中
  REFRESHED: "refreshed"
  // 刷新完成
}, S = {
  LOAD_MORE: "loadMore",
  // 加载更多
  LOADING: "loading",
  // 加载中
  NO_MORE_DATA: "noMoreData"
  // 无更多数据
}, de = { class: "scroll-view" }, ve = { class: "content" }, he = { class: "loading-text" }, fe = { class: "main-content" }, pe = { class: "load-more-text" }, q = 100, me = {
  __name: "ScrollView",
  props: {
    loadingEnd: {
      type: Boolean,
      default: !1
    },
    hasMore: {
      type: Boolean,
      default: !0
    },
    noMoreDataText: {
      type: String,
      default: "没有更多数据"
    }
  },
  emits: ["pulldownRefresh", "pullupLoadMore"],
  setup(c, { emit: T }) {
    const h = c, m = T;
    let n = l(!0), a = l(f.PULLING), s = l(S.LOAD_MORE), o = l(0), d = k(() => {
      switch (a.value) {
        case f.PULLING:
          return "下拉刷新";
        case f.RELEASING:
          return "松手刷新";
        case f.REFRESHING:
          return "刷新中";
        case f.REFRESHED:
          return "刷新成功";
      }
    }), g = k(() => {
      switch (s.value) {
        case S.LOAD_MORE:
          return "上拉加载更多";
        case S.LOADING:
          return "加载中";
        case S.NO_MORE_DATA:
          return "没有更多数据啦";
      }
    });
    y(
      () => h.loadingEnd,
      (i) => {
        i && (n.value ? s.value = S.LOAD_MORE : (a.value = f.REFRESHED, o.value = 0));
      }
    ), y(
      () => h.hasMore,
      (i) => {
        i ? s.value = S.LOAD_MORE : s.value = S.NO_MORE_DATA;
      }
    );
    let _ = l(0), t = l(0), u = l(0), e = l(0), v = l(!1);
    const b = (i) => {
      a.value !== f.REFRESHING && (a.value = f.PULLING, _.value = i.targetTouches[0].clientX, t.value = i.targetTouches[0].clientY, v.value = document.documentElement.scrollTop === 0);
    }, E = (i) => {
      if (a.value === f.REFRESHING) return;
      u.value = i.targetTouches[0].clientX, e.value = i.targetTouches[0].clientY;
      let G = u.value - _.value, X = e.value - t.value;
      if (!(Math.abs(G) > Math.abs(X)) && !(t.value > e.value) && v.value) {
        o.value = Math.abs(e.value - t.value);
        let D = (100 - o.value * 0.5) / 100;
        D = Math.max(0.5, D), o.value = o.value * D, o.value < 50 ? a.value = f.PULLING : a.value = f.RELEASING, o.value > q && (o.value = q);
      }
    }, A = (i) => {
      if (o.value < 50) {
        o.value = 0;
        return;
      }
      n.value = !1, setTimeout(() => {
        m("pulldownRefresh");
      }, 500), a.value = f.REFRESHING;
    }, x = l();
    let L = null;
    const B = () => {
      document.addEventListener("touchstart", b), document.addEventListener("touchmove", E), document.addEventListener("touchend", A), L = new IntersectionObserver(([i]) => {
        i.isIntersecting && s.value === S.LOAD_MORE && (n.value = !0, setTimeout(() => {
          m("pullupLoadMore");
        }, 500), s.value = S.LOADING);
      }), L.observe(x.value);
    }, F = () => {
      document.removeEventListener("touchstart", b), document.removeEventListener("touchmove", E), document.removeEventListener("touchend", A), L.disconnect();
    };
    return U(() => {
      B();
    }), ne(() => {
      F();
    }), (i, G) => (O(), C("div", de, [
      R("div", ve, [
        R("div", {
          style: K({ height: `${p(o)}px` }),
          class: Y([
            "pull-up-refresh",
            {
              animation: p(a) == p(f).REFRESHED || p(a) == p(f).PULLING && !p(o)
            }
          ])
        }, [
          I(i.$slots, "refresh-indicator", { state: p(a) }, () => [
            R("span", he, W(p(d)), 1)
          ], !0)
        ], 6),
        R("div", fe, [
          I(i.$slots, "default", {}, void 0, !0),
          R("div", {
            class: Y(["pull-down-load-more"]),
            ref_key: "loadMore",
            ref: x
          }, [
            I(i.$slots, "load-more-indicator", { state: p(s) }, () => [
              R("span", pe, W(p(g)), 1)
            ], !0)
          ], 512)
        ])
      ])
    ]));
  }
}, Ee = /* @__PURE__ */ P(me, [["__scopeId", "data-v-0b7ee9f1"]]), ge = {
  class: "banner-content",
  id: "bannerContent"
}, _e = { class: "tabs-wrapper" }, be = {
  __name: "index",
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    loadingEnd: {
      type: Boolean,
      default: !1
    },
    hasMore: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["pulldownRefresh", "pullupLoadMore", "activeChange"],
  setup(c, { emit: T }) {
    const h = c, m = T;
    let n = l(0), a = l(h.hasMore), s = new Array(h.tabs.length).fill(!0);
    s[n] = h.hasMore;
    const o = (e) => {
      a.value = s[e], n.value = e;
    }, d = (e) => {
      a.value = s[e], n.value = e;
    };
    y(
      () => n.value,
      (e) => {
        m("activeChange", e);
      }
    ), y(
      () => h.hasMore,
      (e) => {
        a.value = e, s[n.value] = e;
      }
    );
    const g = () => {
      m("pulldownRefresh");
    }, _ = () => {
      m("pullupLoadMore");
    }, t = l(), u = () => {
      if (!(h.tabs.length === t.value.getSwiperLength()))
        throw new Error("The number of tabs and swipers does not match");
    };
    return U(() => {
      u();
    }), (e, v) => (O(), oe(Ee, {
      hasMore: p(a),
      loadingEnd: c.loadingEnd,
      onPulldownRefresh: g,
      onPullupLoadMore: _
    }, {
      "refresh-indicator": H(({ state: b }) => [
        I(e.$slots, "refresh-indicator", { state: b }, void 0, !0)
      ]),
      "load-more-indicator": H(({ state: b }) => [
        I(e.$slots, "load-more-indicator", { state: b }, void 0, !0)
      ]),
      default: H(() => [
        R("div", ge, [
          I(e.$slots, "banner-content", {}, void 0, !0)
        ]),
        R("div", _e, [
          j(ue, {
            tabs: c.tabs,
            tabIndex: p(n),
            onTabChange: d
          }, null, 8, ["tabs", "tabIndex"])
        ]),
        j(ce, {
          loadingEnd: c.loadingEnd,
          swiperIndex: p(n),
          onSlideChange: o,
          ref_key: "swiperRef",
          ref: t
        }, {
          default: H(() => [
            I(e.$slots, "default", {}, void 0, !0)
          ]),
          _: 3
        }, 8, ["loadingEnd", "swiperIndex"])
      ]),
      _: 3
    }, 8, ["hasMore", "loadingEnd"]));
  }
}, J = /* @__PURE__ */ P(be, [["__scopeId", "data-v-e3e9e46f"]]), Te = {
  install(c) {
    c.component("MultiTabSwiper", J);
  },
  MultiTabSwiper: J
};
export {
  Te as default
};
