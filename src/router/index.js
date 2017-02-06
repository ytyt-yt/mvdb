import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import MDMain from 'components/MDMain'

export default new Router({
  routes: [
    {
      path: '/:sceneid',
      name: 'MDMain',
      component: MDMain
    },
    { path: '/', redirect: '/0' }
  ]
})
