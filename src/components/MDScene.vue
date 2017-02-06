<template>

  <mu-flexbox wrap="wrap">
    <template v-if="scene">
      <template v-for="v in scene.views">
          <md-view @dbpause="pauseAll" @dbplay="playAll" :sbbox="sbbox" :spose="spose" :view="v" :ps="ps" :sheight="180" :thr="thr"></md-view>
      </template>
    </template>
  </mu-flexbox>

</template>

<script>
import MDView from './MDView.vue'

export default {
  components: {
    'md-view': MDView
  },
  props: ['scene', 'sbbox', 'spose', 'thr'],
  data () {
    return {
      ps: 'pause'
    }
  },
  methods: {
    pauseAll () {
      this.ps = 'pause'
    },
    playAll () {
      this.ps = 'play'
    }
  }
}
</script>

<style>

</style>
