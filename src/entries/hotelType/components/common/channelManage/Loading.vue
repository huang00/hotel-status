<template>
  <div>
    <transition name="slide-fade">
      <div class="loading" v-if="show">
        <canvas ref="loadingCanvas" 
          style="width: 170px; height: 170px;margin: 0 auto; display: block; margin-top: 115px;"
          width="340" height="340">
        </canvas>
        <div class="scrollView">
          <div class="scrollGroup" ref="scrollGroup">
            <ul ref="scrollContent">
              <li>正在从携程获取信息...</li>
              <li>正在从去哪儿获取信息...</li>
              <li>正在从艺龙获取信息...</li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
    <div class="bg" v-if="show"></div>
  </div>
  
</template>

<script>
export default {
  name: 'loading',
  props: {
    show: {  type: Boolean, default: true },
    success: { type: Boolean, default: false }
  },
  data () {
    return {
      start: 0,
      percent: 2,
      timer: 0,
      scrollTimer: 0,
      animationFrameId: null
    }
  },
  methods: {
    drawMain (drawingElem, percent, start) {
      /*
          @drawingElem: 绘制对象
          @percent：绘制圆环百分比, 范围[0, 100]
      */
      let context = drawingElem.getContext('2d');
      let centerX = drawingElem.width / 2;
      let centerY = drawingElem.height / 2;
      let rad = Math.PI * 2 / 100;
      let that = this;
      // 绘制背景圆圈
      function backgroundCircle() {
          context.save();
          context.beginPath();
          context.lineWidth = 15; // 设置线宽
          let radius = centerX - context.lineWidth;
          context.lineCap = 'round';
          context.strokeStyle = '#ccc';
          context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
          context.stroke();
          context.closePath();
          context.restore();
      }
      // 绘制运动圆环
      function foregroundCircle(n) {
          context.save();
          let gradient = context.createLinearGradient(0, 0, 0, drawingElem.height)
          gradient.addColorStop(0, '#3BAAD8')
          gradient.addColorStop(1, '#5DCCDD')
          context.strokeStyle = gradient;
          context.lineWidth = 15;
          context.lineCap = 'round';
          let radius = centerX - context.lineWidth;
          context.beginPath();
          context.arc(centerX, centerY, radius , -Math.PI / 2, -Math.PI / 2 + n * rad, false); // 用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
          context.stroke();
          context.closePath();
          context.restore();
      }
      // 绘制文字
      function text(n) {
          context.save(); // save和restore可以保证样式属性只运用于该段canvas元素
          context.fillStyle = '#737373';
          let fontSize = 50;
          context.font = `${fontSize}px Helvetica`;
          let textWidth = context.measureText(`${n.toFixed(0)}%`).width;
          context.fillText(`${n.toFixed(0)}%`, centerX - textWidth / 2, centerY + fontSize / 2);
          context.restore();
      }
      // 执行动画
      (function drawFrame() {
          that.onProgress(start)
          that.animationFrameId = window.requestAnimationFrame(drawFrame);
          context.clearRect(0, 0, drawingElem.width, drawingElem.height);
          backgroundCircle();
          text(start);
          foregroundCircle(start);
          if (start >= percent) {
              window.cancelAnimationFrame(that.animationFrameId)
              return false
          }
          start += 1;
      }());
    },
    drawStart () {
      this.$nextTick(() => {
        let myCanvas = this.$refs.loadingCanvas
        this.drawMain(myCanvas, this.percent, this.start)
        this.timer = setInterval(() => {
            /* 循环掉用执行动画 */
          this.percent += 2
          this.drawMain(myCanvas, this.percent, this.start)
          this.start = this.percent
        }, 500)
      })
    },
    drawEnd () {
      clearInterval(this.timer)
      this.$nextTick(() => {
        let myCanvas = this.$refs.loadingCanvas
        this.drawMain(myCanvas, 100, this.percent)
      })
    },
    onProgress (progress) {
        if (progress >= 90) {
            clearInterval(this.timer)
        }
        if (progress >= 99) {
            this.$emit('on-success', true)
        }
    },
    scroll () {
      let scrollGroup = this.$refs.scrollGroup
      let scrollContent = this.$refs.scrollContent
      let scrollContentClone = scrollContent.cloneNode(true)
      scrollGroup.appendChild(scrollContentClone)
      let height = scrollContent.offsetHeight
      let top = 0
      this.scrollTimer = setInterval(() => {
        if (Math.abs(scrollGroup.style.top.slice(0, -2)) >= height) {
          scrollGroup.style.top = 0
          top = 0
        } else {
          scrollGroup.style.top = top + 'px'
          top -= 2
        }
      }, 100)
      // startScroll()
      // function startScroll() {
      //   window.requestAnimationFrame(startScroll)
      //   if (Math.abs(scrollGroup.style.top.slice(0, -2)) >= height) {
      //     scrollGroup.style.top = 0
      //     top = 0
      //   } else {
      //     scrollGroup.style.top = top + 'px'
      //     top -= 1
      //   }
      // }
    }
  },
  watch: {
    show (val) {
        this.start = 0
        this.percent = 0
        if (val) {
          this.$nextTick(() => {
            this.drawStart()
            this.scroll()
          })
        } else {
          clearInterval(this.timer)
          clearInterval(this.scrollTimer)
        }
    },
    success (val) {
        val && this.drawEnd()
    }
  }
}
</script>


<style scoped lang="scss">
  .loading {
    z-index: 10;
    position: absolute;
    width: 80%;
    background: white;
    top: 0;
    box-shadow: 0px 3px 5px #ccc;
    height: 430px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    .scrollView {
      position: relative;
      width: 200px;
      margin: 0 auto;
      height: 30px;
      margin-top: 40px;
      overflow: hidden;
      text-align: center;
      .scrollGroup {
        width: 100%;
        position: absolute;
        top: 0;
        color: #000000;
        font-size: 16px;
        line-height: 30px;
      }
    }
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(-1000px);
    opacity: 0;
  }
  .bg {
    position: absolute;
    background: white;
    width: 80%;
    height: 100%;
    top: 0;
    opacity: 0.1;
  }
</style>