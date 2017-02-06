<template>
  <mu-flexbox-item :style="{ width: swidth+'px', height: sheight+'px' }">
    <div class="md-view-div" :style="{ width: swidth+'px', height: sheight+'px' }">
      <div class="md-view-video">
        <video class="video-js" controls loop :id="vid" :width="swidth" :height="sheight">
        </video>
      </div>
      <svg class="md-view-svg">
        <template v-if="lastFrm >= 0">
          <template v-if="sbbox && bbox[lastFrm]">
            <template v-for="j in bbox[lastFrm]">
              <rect :x="j[2][0]" :y="j[2][1]" :width="j[2][2]-j[2][0]" :height="j[2][3]-j[2][1]" stroke="#fff" fill-opacity="0"></rect>
            </template>
          </template>

          <template v-if="spose && pose[lastFrm]">
            <template v-for="j in pose[lastFrm].length">
              <!-- <template v-for="k in j">
                <circle :cx="k[0]" :cy="k[1]" r="2" fill="#f00"></rect>
              </template> -->
              <circle :cx="pose[lastFrm][j-1][0][0]" :cy="pose[lastFrm][j-1][0][1]" r="2" fill="#f00"></rect>
            </template>
          </template>
        </template>
      </svg>
    </div>
  </mu-flexbox-item>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default {
  props: ['view', 'sheight', 'ps', 'thr', 'sbbox', 'spose'],
  data () {
    return {
      bboxOri: undefined,
      poseOri: undefined,
      bbox: [],
      pose: [],
      lastFrm: -1,
      player: undefined
    }
  },
  watch: {
    thr () {
      this.calcBbox()
    },
    ps () {
      if (this.ps === 'play') {
        if (this.player.paused()) {
          this.player.play()
        }
      } else if (this.ps === 'pause' && !this.player.paused()) {
        this.player.pause()
      }
    },
    bboxOri () {
      this.calcBbox()
    },
    poseOri () {
      console.log('calc pose')
      this.pose = []
      let b = []
      let c = []
      for (let i = 0; i < this.poseOri.length; ++i) {
        b = []
        for (let j = 0; j < this.poseOri[i].length; ++j) {
          c = []
          // for (let k = 0; k < this.poseOri[i][j].length; ++k) {
          for (let k = 0; k < 1; ++k) {
            c.push([
              this.poseOri[i][j][k][0] * this.scale,
              this.poseOri[i][j][k][1] * this.scale,
              this.poseOri[i][j][k][2]
            ])
          }
          b.push(c)
        }
        this.pose.push(b)
      }
    }
  },
  methods: {
    calcBbox () {
      console.log('calc bbox')
      this.bbox = []
      for (let i = 0; i < Object.keys(this.bboxOri).length; ++i) {
        let bs = []
        for (let j = 0; j < this.bboxOri[i].length; ++j) {
          if (this.bboxOri[i][j][1] > this.thr) {
            bs.push([
              this.bboxOri[i][j][0],
              this.bboxOri[i][j][1],
              [
                this.bboxOri[i][j][2][0] * this.scale,
                this.bboxOri[i][j][2][1] * this.scale,
                this.bboxOri[i][j][2][2] * this.scale,
                this.bboxOri[i][j][2][3] * this.scale
              ]
            ])
          }
        }
        this.bbox.push(bs)
      }
    }
  },
  computed: {
    vid () {
      let vid = ''
      const s = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      for (let i = 0; i < 6; ++i) {
        vid += s[Math.floor(Math.random() * s.length)]
      }
      return vid
    },
    swidth () {
      return this.view.w * this.sheight / this.view.h
    },
    scale () {
      return this.sheight / this.view.h
    }
  },
  mounted () {
    this.player = videojs('#' + this.vid)
    this.player.src(this.view.src)
    this.$http.get(this.view.bboxSrc).then((d) => {
      this.bboxOri = d.body
      this.$http.get(this.view.poseSrc).then((d2) => {
        this.poseOri = d2.body
        setInterval(() => {
          if (this.player.paused() && !this.player.ended() && this.ps === 'play') {
            console.log('pause')
            this.$emit('dbpause')
          } else if (!this.player.paused() && this.ps === 'pause') {
            console.log('play')
            this.$emit('dbplay')
          }
          let curTime = this.player.currentTime()
          let curFrm = Math.round(curTime * this.view.fps)
          if (this.lastFrm !== curFrm) {
            this.lastFrm = curFrm
          }
        }, 500)
      })
    })
  }
}
</script>

<style>
  .md-view-div {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .md-view-svg,
  .md-view-video {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .md-view-svg {
    z-index: 500;
  }

  .vjs-big-play-button,
  .vjs-control-bar {
    z-index: 600;
  }
</style>
