<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" @click.stop="clickBackdrop" v-if="visible">
      <input type="text" :value="value" style="display: none;">
      <div
        :class="['modal', visible ? '' : 'close']"
        ref="modal"
        :style="modalStyle"
        @click.stop
      >
        <span @click="cancel" class="close" v-if="closable">
          <Icon type="md-close" />
        </span>

        <div ref="modalHeader" class="modal-header-wrapper">
          <slot name="header">
              <div class="modal-header" :style="headerStyle" v-if="!headerHide">
                  {{ title }}
              </div>
          </slot>
        </div>

        <div
          class="modal-body custom-scrollbar"
          :style="{
            maxHeight: modalBodyHeight + 'px',
            overflow: scrollable? 'auto': 'hidden'
          }"
        >
          <slot>
            <h1>body</h1>
          </slot>
        </div>

        <div ref="modalFooter" class="modal-footer-wrapper">
          <slot name="footer">
              <div class="modal-footer" v-if="!footerHide" :style="footerStyle">
                  <template v-if="showCancel">
                      <button @click="confirm" class="confirm">{{ okText }}</button>
                      <button @click="cancel" class="cancel">{{ cancleText }}</button>
                  </template>
                  <template v-else>
                      <button @click="confirm" class="confirm only">{{ okText }}</button>
                  </template>
              </div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "AppModal",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    headerHide: {
      type: Boolean,
      default: false
    },
    footerHide: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "title"
    },
    width: {
      type: [Number, String],
      default: 860
    },
    height: {
      type: [Number, String],
      default: 540
    },
    closable: {
      type: Boolean,
      default: true
    },
    borderRadius: {
      type: Number,
      default: 6
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    okText: {
      type: String,
      default: '确定'
    },
    cancleText: {
      type: String,
      default: '取消'
    },
    maskClosable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      modalBodyHeight: 0
    };
  },
  computed: {
      modalStyle () {
          let height = typeof(this.height) === 'string' ? this.height : this.height + 'px'
          let width = typeof(this.width) === 'string' ? this.width : this.width + 'px'
          let borderRadius = this.borderRadius + 'px'
          return {
              height,
              width,
              borderRadius
          }
      },
      headerStyle () {
          let borderTopLeftRadius = this.borderRadius + 'px'
          let borderTopRightRadius = this.borderRadius + 'px'
          return {
              borderTopLeftRadius,
              borderTopRightRadius
          }
      },
      footerStyle () {
          let borderBottomLeftRadius = this.borderRadius + 'px'
          let borderBottomRightRadius = this.borderRadius + 'px'
          return {
              borderBottomLeftRadius,
              borderBottomRightRadius
          }
      }
  },
  created() {
    this.visible = this.value;
    if (this.value) document.body.style.overflow = "hidden";
  },
  updated() {
    let modalHeader = this.$refs.modalHeader
    let modalFooter = this.$refs.modalFooter
    let modal = this.$refs.modal

    if (modalHeader) {
      let headerHeight = modalHeader.offsetHeight
      let modalHeight = modal.offsetHeight
      let footerHeight = modalFooter.offsetHeight

      this.modalBodyHeight = modalHeight - headerHeight - footerHeight
    }
  },
  methods: {
    confirm() {
      this.$emit("on-ok");
    },
    cancel() {
      this.$emit("on-cancle");
      this.visible = false;
    },
    clickBackdrop () {
      if (this.maskClosable)
        this.cancel()
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) document.body.style.overflow = "hidden";
      else {
        let modalList = Array.prototype.slice.apply(
          document.body.getElementsByClassName("modal-backdrop")
        );
        modalList.filter(item => !item.style.display).length === 1
          ? (document.body.style = "")
          : (document.body.style.overflow = "hidden");
      }
    },
    visible(val) {
      this.$emit("input", val);
      this.$emit("on-visible-change", val);
    }
  }
};
</script>

<style scoped lang="scss">
@import "./appModal";
</style>
