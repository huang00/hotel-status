<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" @click.stop="cancel" v-if="visible">
      <input type="text" :value="value" style="display: none;">
      <div
        :class="['modal', visible ? '' : 'close']"
        :style="modalStyle"
        @click.stop
      >
        <span @click="cancel" class="close" v-if="closable">
          <Icon type="md-close" />
        </span>

        <slot name="header">
            <div class="modal-header" :style="headerStyle" v-if="!headerHide">
                {{ title }}
            </div>
        </slot>

        <div class="modal-body">
          <slot>
            <h1>body</h1>
          </slot>
        </div>

        <slot name="footer">
            <div class="modal-footer" v-if="!footerHide" :style="footerStyle">
                <template v-if="showCancel">
                    <button @click="confirm" class="confirm">确定</button>
                    <button @click="cancel" class="cancel">取消</button>
                </template>
                <template v-else>
                    <button @click="confirm" class="confirm only">确定</button>
                </template>
            </div>
        </slot>
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
    }
  },
  data() {
    return {
      visible: false
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
  methods: {
    confirm() {
      this.$emit("on-ok");
    },
    cancel() {
      this.$emit("on-cancle");
      this.visible = false;
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
