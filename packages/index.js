import MultiTabSwiper from "./MultiTabSwiper"

export {
  MultiTabSwiper
}

const install = function(Vue) {
  Vue.component(MultiTabSwiper.name, MultiTabSwiper)
}

export default {
  install
}