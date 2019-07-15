<template>
  <div
    @mousedown.stop="onMouseDownHanlder($event)"
    class="tabs-nav-container disabled-select"
    :style="containerStyle"
  >
    <span class="left-icon" @click="leftSlide" v-if="slide">
      <Icon type="ios-arrow-back" color="#1F5A8E" size="30"/>
    </span>
    <div
      v-if="list.length > 0"
      ref="tabsNavWrapper"
      class="tabs-nav-wrapper"
      @mousemove.stop="onMouseMoveHanlder($event)"
    >
      <ul
        class="tabs-nav"
        ref="tabsNav"
        @scroll="onTabsNavScroll($event)"
        :style="{
            left: scrollLeft + 'px'
          }"
      >
        <li
          :class="{
              'nav-item': true,
              'text-break-1': true,
              active: item.value == activeId
          }"
          v-for="(item, index) in list"
          :key="index"
          :title="item.label"
          @click="switchTabs(item)"
        >{{ item.label }}</li>
      </ul>
    </div>
    <span class="right-icon" @click="rightSlide" v-if="slide">
      <Icon type="ios-arrow-forward" color="#1F5A8E" size="30"/>
    </span>
  </div>
</template>

<script>
export default {
  name: "TabsNav",
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    width: {
      type: [Number, String],
      default: "100%"
    },
    innId: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      scrollLeft: 0,
      dragMouseDownTrue: false,
      startOffsetLeft: 0,
      preScrollLeft: 0,
      originScrollLeft: 0,
      tabsNav: null,
      tabsNavWrapper: null,
      wrapperWidth: 0,
      tabsWidth: 0,
      slide: false,
      activeId: 0
    };
  },
  created() {
    document.addEventListener("mouseup", this.onDocumentMouseup)
    window.addEventListener('resize', this.computedIsSlide)
    if (this.list.length) {
      if (this.innId === 0)
        this.activeId = this.list[0].value
      else
        this.activeId = this.innId
    }
  },
  mounted() {
    let tabsNavLoding = new Promise(res => {
      let timer = setInterval(() => {
        this.tabsNav = this.$refs.tabsNav;
        if (this.tabsNav) {
          clearInterval(timer)
          res(true)
        }
      })
    })

    let tabsNavWrapperLoding = new Promise(res => {
      let timer = setInterval(() => {
        this.tabsNavWrapper = this.$refs.tabsNavWrapper;
        if (this.tabsNavWrapper) {
          clearInterval(timer)
          res(true)
        }
      })
    })

    Promise.all([tabsNavLoding, tabsNavWrapperLoding]).then(res => {
      this.computedIsSlide()
    })
  },
  computed: {
    containerStyle() {
      let width =
        typeof this.width === "string" ? this.width : this.width + "px";
      return {
        width
      };
    }
  },
  destroyed() {
    document.removeEventListener("mouseup", this.onDocumentMouseup);
    document.removeEventListener('mouseup', this.computedIsSlide)
  },
  methods: {
    onMouseMoveHanlder(event) {
      event = event || window.event;
      if (this.dragMouseDownTrue && this.slide && event.button === 0) {
        this.tabsNav.style.transition = "initial";
        this.scroll(event.pageX - this.startOffsetLeft);
      }
    },
    scroll(move) {
      let scrollLeft = this.originScrollLeft + move;
      let minLeft = -(this.tabsWidth - this.wrapperWidth);
      scrollLeft =
        scrollLeft >= 0 ? 0 : scrollLeft <= minLeft ? minLeft : scrollLeft;
      this.scrollLeft = scrollLeft;
    },
    leftSlide() {
      this.tabsNav.style.transition = "left 0.3s";
      this.scroll(200);
    },
    rightSlide() {
      this.tabsNav.style.transition = "left 0.3s";
      this.scroll(-200);
    },
    onMouseDownHanlder(event) {
      event = event || window.event;
      if (event.button === 0) {
        this.dragMouseDownTrue = true;
        this.startOffsetLeft = event.pageX;
        this.originScrollLeft = this.scrollLeft;
      }
    },
    onDocumentMouseup() {
      this.dragMouseDownTrue = false;
    },
    switchTabs(item) {
      if (this.activeId !== item.value) {
        this.activeId = item.value;
        this.$emit("on-change", item);
      }
    },
    computedIsSlide () {
      this.wrapperWidth = this.tabsNavWrapper.offsetWidth;
      this.tabsWidth = this.tabsNav.offsetWidth;
      this.slide = this.tabsWidth > this.wrapperWidth;
      if (!this.slide) {
        this.tabsNav.style.width = this.tabsWidth + "px";
        this.tabsNav.style.right = 0;
        this.tabsNav.style.margin = "0 auto";
      }
    }
  },
  watch: {
    list: {
      handler (val) {
        if(!this.activeId){
          if (this.innId === 0)
            this.activeId = this.list[0].value
          else
            this.activeId = this.innId
          }
      },
      deep: true
    }
  },  
};
</script>

<style lang="scss" scoped>
.tabs-nav-container {
  $basic-primary: #1f5a8e;
  position: relative;
  .tabs-nav-wrapper {
    position: relative;
    overflow: hidden;
    height: 40px;
    line-height: 36px;
    top: 0;
    // background-color: #fbfbfb;
    color: #999999;
    padding: 0 5px;
    font-size: 14px;
    .tabs-nav {
      white-space: nowrap;
      position: absolute;
      .nav-item {
        max-width: 160px;
        padding: 0 15px;
        display: inline-block;
        border-top: 4px solid transparent;
        text-align: center;
        cursor: pointer;
        &.active,
        &:hover {
          color: $basic-primary;
          border-color: $basic-primary;
        }
      }
    }
  }
  .left-icon,
  .right-icon {
    position: absolute;
    z-index: 1;
    line-height: 40px;
    top: 0;
    cursor: pointer;
    opacity: 0;
    transition: all 0.3s;
  }
  .left-icon {
    left: 0;
  }
  .right-icon {
    right: 0;
  }
  &:hover {
    .left-icon,
    .right-icon {
      opacity: 1;
    }
    .left-icon {
      left: -24px;
    }
    .right-icon {
      right: -24px;
    }
  }
}
</style>
