<template>
  <div id="app">

    <mu-appbar title="Multiview Dashboard" class="md-appbar">
      <mu-icon-button icon='menu' slot="left"/>
    </mu-appbar>

    <mu-drawer :open="true" :docked="true" class="app-drawer" :zDepth="1">
      <mu-list>
        <mu-sub-header>Settings</mu-sub-header>
        <mu-list-item disableRipple @click="handleToggle('sbbox')" title="Detection">
          <mu-icon slot="left" value="gps_fixed"/>
          <mu-switch v-model="sbbox"  slot="right"/>
        </mu-list-item>
        <mu-list-item disableRipple @click="handleToggle('spose')" title="Pose">
          <mu-icon slot="left" value="directions_run"/>
          <mu-switch v-model="spose"  slot="right"/>
        </mu-list-item>
      </mu-list>

      <div class="mu-version-box">
        <span class="mu-version-text">SSD Threshold</span>
        <mu-dropDown-menu :value="thr" @change="thrChange">
          <mu-menu-item v-for="i in 10" :value="i/10.0" :title="i/10.0 + ' '"/>
        </mu-dropDown-menu>
      </div>

      <mu-list>
        <mu-sub-header>Socs</mu-sub-header>
        <template v-for="i in scenes.length">
          <mu-list-item :title="scenes[i-1].scene" @click="selectScene(i-1)">
            <mu-icon slot="left" value="videocam"/>
          </mu-list-item>
        </template>
      </mu-list>
    </mu-drawer>

    <div class="main-content">
      <mu-content-block>
        <md-scene :scene="scene" :spose="spose" :sbbox="sbbox" :thr="thr"></md-scene>
      </mu-content-block>
    </div>


  </div>
</template>


<script>
import MDScene from './MDScene.vue'

export default {
  name: 'app',
  components: {
    'md-scene': MDScene
  },
  data () {
    return {
      scenes: [],
      sbbox: true,
      spose: false,
      thr: 0.8
    }
  },
  methods: {
    selectScene (i) {
      this.$router.push('/' + i)
    },
    handleToggle (key) {
      this[key] = !this[key]
    },
    thrChange (v) {
      this.thr = v
    }
  },
  computed: {
    scene () {
      return this.scenes[this.$route.params.sceneid]
    }
  },
  mounted () {
    this.$http.get('/static/data/metadata.json').then((d) => {
      this.scenes = d.body
      this.scene = this.scenes[0]
    })
  }
}
</script>


<style>
  .mu-version-box{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    margin-top: 8px;
    padding-left: 16px;
    padding-right: 16px;
  }
  .mu-version-text {
    font-size: 16px;
    margin-top: 8px;
    width: 120px;
  }

  .md-appbar {
    position: fixed;
    left: 256px;
    right: 0;
    top: 0;
    width: auto;
  }
  .main-content {
    padding-top: 80px;
    padding-left: 256px;
  }
</style>
