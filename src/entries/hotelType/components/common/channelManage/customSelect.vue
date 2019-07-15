<template>
  <div :class="open?'custom-select':'custom-select open'" @click="open = true">
    <div class="select-selection">
      <input type="hidden" :value="value">
      <div>
        <span class="select-selected-value text-break-1">{{ groupName }}</span>
        <Icon type="ios-arrow-down" size="14" class="icon" />
      </div>
    </div>
    <ul class="select-dropdown">
      <li v-for="(item, index) in data" :key="index">
        <div class="group-item">
          <span v-if="item.productType ===  '0'" class="room-productType reserve">预</span>
          <span v-if="item.productType ===  '1'" class="room-productType spot">现</span>
          <span style="margin-left: 10px;">{{item.otaRoomTypeName}}</span>
        </div>
      </li>
    </ul>
    <!-- <ul style="line-height: 30px; text-align: center; ">没有数据</ul> -->
  </div>
</template>

<script>
export default {
  naem: 'custom-select',
  props: {
    value: { default: ''},
    data: { 
            type: Array, 
            default () {
              return []
            } 
          },
    groupName: { type: String, default: ''}
  },
  data () {
    return {
      open: false,
      otaRoomTypeName: '',
      count: 0
    }
  },
  methods: {
    eventHandler (e) {
      e = e || window.event
      // if (!this.count) {
      //   this.count++
      //   return false
      // }
      this.open = false
      return false
    }
  },
  mounted () {
    let that = this
    if (this.data.length) {
      this.otaRoomTypeName = this.data[0].otaRoomTypeName
    }
  },
  watch: {
    open (val) {
      let that = this
      if (val) {
        document.addEventListener('click', that.eventHandler)
      } else {
        that.count = 0
        document.removeEventListener('click', that.eventHandler)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .custom-select {
    width: 170px;
    cursor: pointer;
    .select-selection {
      border: 1px solid #ccc;
      position: relative;
      .select-selected-value {
        display: block;
        line-height: 30px;
        padding: 0 20px 0 10px;
        height: 30px;
      }
      .icon {
        position: absolute;
        right: 4px;
        top: 10px;
        transition: all .5s;
        height: 11px; 
      }
    }
    .select-dropdown {
      position: absolute;
      width: 170px;
      border: 1px solid #E2E2E2;
      background-color: white;
      margin-top: 3px;
      z-index: 10;
      box-shadow:1px 0px 6px rgba(202,202,202,1);
      li {
        .group-item {
          padding: 7px 0;
          margin: 0 10px;
          border-bottom: 1px solid #E6E6E6;
          .room-productType {
            width:16px;
            height:16px;
            font-size: 10px;
            color: white;
            display: inline-block;
            text-align: center;
          }
          .room-productType.reserve { background-color: #05C47E; }
          .room-productType.spot { background-color: #EBD83C; }
        }
      }
    }
    .select-dropdown li:last-child .group-item { border: 0; }
  }
  .custom-select.open {
    .select-dropdown { display: none; }
    .icon { transform:rotate(180deg); }
  }
</style>
