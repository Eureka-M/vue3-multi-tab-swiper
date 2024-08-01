import { openBlock as l, createElementBlock as r } from "vue";
const s = (t, e) => {
  const o = t.__vccOpts || t;
  for (const [c, a] of e)
    o[c] = a;
  return o;
}, p = {
  __name: "MultiTabSwiper",
  setup(t) {
    return console.log("welcome to multi-tab-swiper"), (e, o) => (l(), r("p", null, "NEW PROJECT"));
  }
}, n = /* @__PURE__ */ s(p, [["__scopeId", "data-v-f2ad200c"]]);
n.install = function(t) {
  t.component(n.name, n);
};
const _ = function(t) {
  t.component(n.name, n);
}, m = {
  install: _
};
export {
  n as MultiTabSwiper,
  m as default
};
