<template>
  <div :class="open?'cascader open':'cascader'">
    <div class="cascader-rel" @click.stop="open = true">
      <input type="hidden" :value="value">
      <div class="input-wrapper">
        <input autocomplete="off" placeholder="请选择" readonly="readonly" class="cascader-input" type="text" v-model="address">
      </div>
      <Icon type="ios-arrow-down" class="cascader-arrow"/>
    </div>
    <div class="select-dropdown" v-if="open" @click.stop="empty">
      <div class="selected">
        <span class="selected-item item" v-for="(item, index) in selectedData" @click="selectedChangeData(index+1)" :key="item.value">{{item.label}}</span>
      </div>
        <div class="select">
          <span class="select-item item" v-for="item in dataPool" @click="selectChangeData(item)" :key="item.value">{{item.label}}</span>
          <div class="loading" v-if="loading">
            <span>加载中...</span>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { hotelInforApiServers } from '../../../../api/API'

export default {
  name: 'cascader',
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    loadData: {
      type: Function,
      default (data, callback) {
        callback()
      }
    },
    selectedDataFormParent: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      value: [],
      loading: false,
      cache: {},
      selectedData: [],
      dataPool: [],
      open: false,
      progress: 1 // city district street
    }
  },
  computed: {
    address () {
      let labels = this.selectedData.map(item => item.label)
      if (labels.length) {
        return labels.join(' / ')
      }
      return ''
    }
  },
  methods: {
    empty () {},
    selectChangeData (data) {
      /* 待选择省市区数据 */
      let selectedDataLen = this.selectedData.length
      if (this.progress === selectedDataLen) {
        this.selectedData.splice(this.progress - 1, 1, data)
      } else {
        this.selectedData.push(data)
      }
      if (data.loading) {
        this.loading = true
        this.loadData(data, () => {
          this.dataProcess(data)
          this.loading = false
        })
      } else {
        this.dataProcess(data)
      }
    },
    selectedChangeData(index) {
      /* 已经选择的省市区数据 */
      let len = this.selectedData.length
      this.progress = index
      this.selectedData = this.selectedData.slice(0, index)
      let list = this.cache[index]
      let emptyList = []
      for (let i = 0, len = list.length; i < len; i++) {
        emptyList.push(list[i])
      }
      this.dataPool = emptyList
    },
    dataProcess (data) {
      if (data.children && data.children.length) {
        let list = data.children
        let emptyList = []
        for (let i = 0, len = list.length; i < len; i++) {
          emptyList.push(list[i])
        }
        this.dataPool = emptyList
        this.progress++
        this.cache[this.progress] = emptyList
      } else {
        console.log('到底了，不要再扯了')
        this.open = false
        return false
      }
    },
    initCache () {
      hotelInforApiServers.getAllCityAdresse({parentid: this.selectedDataFormParent[0].value}).then(result => {
        if (result.code === '000000') {
          let list = result.content
          let emptyList = []
          for (let i = 0, len = list.length; i < len; i++) {
            let item = list[i]
            emptyList.push({
              ...item,
              value: item.id,
              label: item.areaname,
              children: [],
              loading: true
            })
          }
          this.cache['2'] = emptyList
        }
      })
      hotelInforApiServers.getAllCityAdresse({parentid: this.selectedDataFormParent[1].value}).then(result => {
        if (result.code === '000000') {
          let list = result.content
          let emptyList = []
          for (let i = 0, len = list.length; i < len; i++) {
            let item = list[i]
            emptyList.push({
              ...item,
              value: item.id,
              label: item.areaname,
              children: [],
              loading: true
            })
          }
          this.cache['3'] = emptyList
          this.dataPool = emptyList
        }
      })
    },
    initData (data) {
      let list = this.data
      let emptyList = []
      for (let i = 0, len = list.length; i < len; i++) {
        emptyList.push(list[i])
      }
      this.cache['1'] = emptyList
      if (!this.selectedDataFormParent.length) {
        this.dataPool = emptyList
      }
    }
  },
  watch: {
    data: {
      handler (value) {
        this.initData()
      },
      deep: true
    },
    open (val) {
      let _this = this
      if (val && this.selectedData.length === 3) {
        document.onclick = function () {
          if (_this.selectedData.length === 3) {
            _this.open = false
          }
        }
      } else {
        document.onclick = null
      }
    },
    selectedData: {
      handler (val) {
        console.log(val)
        this.$emit('on-change', val)
      },
      deep: true
    }
  },
  destroyed () {
    document.onclick = null
  },
  created () {
    this.initData()
    if (this.selectedDataFormParent) {
      this.selectedData = this.selectedDataFormParent
      this.progress = this.selectedDataFormParent.length || 1
      this.initCache()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './cascader'
</style>
