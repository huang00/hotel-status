<template>
  <div class="channelItem">
    <div>
      <div v-if="model">
        <Input v-model="data.channelName" :class="empty ? 'errNote':''" :maxlength="15" placeholder="渠道名称" @on-focus="onFocus">
          <Button slot="append" @click="switchModel">确认</Button>
        </Input>
      </div>
      <div v-else class="showChannel">
        <template>
          <div class="channelName" :style="{borderBottomColor: data.channelColor}" @click="switchModel">{{ data.channelName }}</div>
          <span :style="{borderColor: data.channelColor, color: data.channelColor}" :class="['logo', getClassName(data.channelCode)]">
            {{ !getClassName(data.channelCode) ? data.channelName.slice(0, 1):'' }}
          </span>
        </template>
        <div class="colorFrame" v-if="isEdit">
          <p class="title">设置渠道颜色</p>
          <div class="defaultColor">
            <span class="colorItem" v-for="(item, index) in defaultColor" @click="setColor(item)" :key="index" :style="{background: item}"></span>
          </div>
          <span class="more" @click="moreColor">更多</span>
        </div>
        <div class="delete" v-if="isEdit" @click="del">
          <Icon type="md-remove-circle" color="#EB5454" size="20"></Icon>
        </div>
      </div>
    </div>
    <input type="color" ref="colorPicker" v-model="data.channelColor" @change="setColor()" style="display: none;">
    <OBJECT id=myColor CLASSID="clsid:3050f819-98b5-11cf-bb82-00aa00bdce0b" width="0px" height="0px"></OBJECT>
  </div>
</template>

<script>
import { trimAll, getCookie } from 'common_libs/util.js'
import { innRoomTypeApiServers } from '../../../api/API'

export default {
  name: 'channelItem',
  props: {
    /* isEdit: {
      type: Boolean,
      default: true
    }, */
    data: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      model: false,
      isEdit: true,
      empty: false,
      defaultColor: ['#FF0000', '#FFFF00', '#009944', '#F29B76', '#7ECEF4', '#2577E2',
        '#004986', '#59493F', '#1D2088', '#7F2D00', '#A6937C', '#707070', '#F8B551', '#E4007F', '#001C58']
    }
  },
  methods: {
    switchModel () {
      /* 模式切换 */
      if (this.data.channelType === 1) {
        console.log('不可编辑')
        return false
      }
      if (this.model) {
        if (!trimAll(this.data.channelName)) {
          console.log('没有值')
          this.empty = true
          return false
        }
        this.data.channelName = this.data.channelName.replace(/^\s+|\s+$/g, '')
        this.updateDateList(this.data).then(result => {
          if (result.code === '000000') {
            this.data.id = result.content.id
            this.model = false
          }
        })
      } else {
        this.model = !this.model
      }
    },
    onFocus () {
      this.empty = false
    },
    setColor (color) {
      /* 颜色设置 */
      color = color || this.$refs.colorPicker.value
      this.data.channelColor = color
      this.updateDateList(this.data)
    },
    del () {
      this.$emit('on-delete', this.data)
    },
    moreColor () {
      if (navigator.userAgent.indexOf('.NET') >= 0) {
        let myColor = document.getElementById('myColor')
        let sColor = myColor.ChooseColorDlg(item.color)
        if (sColor.length < 6) {                                //如果颜色小于6位
          let sTempString = '000000'.substring(0, 6 - sColor.length);//格式化为6位
          sColor = sTempString.concat(sColor);
        }
        this.setColor(sColor)
      } else {
        let colorPicker = this.$refs.colorPicker
        colorPicker.click()
      }
    },
    getClassName (code) {
      let calssName = ''
      switch(code) {
        case '000001':
          calssName = 'ctrip';
          break;
        case '000002':
          calssName = 'ctrip';
          break;
        case '000003':
          calssName = 'ctrip';
          break;
        case '000011':
          calssName = 'qunar';
          break;
        case '000012':
          calssName = 'qunar';
          break;
        case '000021':
          calssName = 'elong';
          break;
        case '000022':
          calssName = 'elong';
          break;
        case '000031':
          calssName = 'meituan';
          break;
        case '000041':
          calssName = 'fliggy';
          break;
        case '000051':
          calssName = 'booking';
          break;
        case '000061':
          calssName = 'tongcheng';
          break;
        case '000071':
          calssName = 'lvmama';
          break;
        case '000081':
          calssName = 'mafengwo';
          break;
        case '000091':
          calssName = 'tuniu';
          break;
        case '000101':
          calssName = 'tujia';
          break;
        case '000111':
          calssName = 'yiqiyou';
          break;
        case '000121':
          calssName = 'airbnb'
          break;
        case '000131':
          calssName = 'xiaozhu'
          break;
        case '000141':
          calssName = 'agoda'
          break;
      }
      return calssName
    },
    updateDateList (params) {
      /* 新建/修改渠道 */
      return innRoomTypeApiServers.updateOwnChannel({...params, userId: getCookie('userId'), innId: getCookie('innId')})
    }
  },
  created () {
    this.isEdit = this.data.channelType === 2
    this.model = !this.data.id
  }
}
</script>

<style scoped lang="scss">
  .channelItem {
    width: 100%;
    position: relative;
    .showChannel {
      position: relative;
      padding-left: 10px;
      cursor: pointer;
      .channelName {
          border-bottom: 36px solid;
          border-left: 22px solid transparent;
          font-size: 16px;
          color: white;
          text-align: center;
          line-height: 32px;
          height: 0;
      }
      .logo {
          height: 34px;
          width: 34px;
          border: 1px solid;
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: 0;
          font-size: 20px;
          text-align: center;
          background-color: white;
      }
      .logo.ctrip{
        background: url('./img/ctrip.png') white no-repeat center center;
        background-size: 100% 100%;
        background-size: 89% 88%;
      }
      .logo.qunar{
        background: url('./img/qunar.png') white no-repeat center center;
        background-size: 100% 100%;
        background-size: 89% 88%;
      }
      .logo.elong{
        background: url('./img/elong.png') white no-repeat center center;
        background-size: 100% 100%;
        background-size: 89% 88%;
      }
      .logo.meituan {
        background: url('./img/meituan.png') white no-repeat center center;
        background-size: 100% 100%;
        background-size: 89% 88%;
      }
      .logo.fliggy {
        background: url('./img/fliggy.png') white no-repeat 2px 4px;
        background-size: 80% 81%;
      }
      .logo.booking {
        background: url('./img/booking.png') white no-repeat center center;
        background-size: 80% 81%;
      }
      .logo.tongcheng {
        background: url('./img/tongcheng.png') white no-repeat center center;
        background-size: 90% 90%;
      }
      .logo.lvmama {
        background: url('./img/lvmama.png') white no-repeat center center;
        background-size: 85% 85%;
      }
      .logo.mafengwo {
        background: url('./img/mafengwo.png') white no-repeat center center;
        background-size: 90% 85%;
      }
      .logo.tuniu {
        background: url('./img/tuniu.png') white no-repeat center center;
        background-size: 90% 85%;
      }
      .logo.tujia {
        background: url('./img/tujia.png') white no-repeat center center;
        background-size: 85% 60%;
      }
      .logo.airbnb {
        background: url('./img/airbnb.png') white no-repeat center center;
        background-size: 80% 70%;
      }
      .logo.xiaozhu {
        background: url('./img/xiaozhu.png') white no-repeat 2px center;
        background-size: 94% 83%;
      }
      .logo.agoda {
        background: url('./img/agoda.png') white no-repeat center center;
        background-size: 85% 59%;
      }
      .logo.yiqiyou {
        background: url('./img/yiqiyou.png') white no-repeat center center;
        background-size: 85% 59%;
      }
      .colorFrame {
        display: none;
        z-index: 3;
        left: 0;
        width: 100%;
        border: 1px solid #CDCDCD;
        box-shadow:0px 1px 4px 0px rgba(205,205,205,1);
        position: absolute;
        background-color: white;
        text-align: center;
        padding-bottom: 10px;
        .title {
          line-height: 30px;
          font-size: 12px;
          padding-left: 5px;
          text-align: left;
        }
        .defaultColor {
          text-align: left;
          .colorItem {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 1px solid #AAAAAA;
            border-radius: 3px;
            margin: 0 5px;
            cursor: pointer;
          }
        }
        .more {
          border: 1px solid #2577E2;
          color: #2577E2;
          border-radius: 4px;
          padding: 0 10px;
          cursor: pointer;
        }
      }
      .delete {
        display: none;
        position: absolute;
        border: 2px solid white;
        top: -9px;
        right: -8px;
        border-radius: 50%;
        background-color: white;
        height: 23px;
        width: 23px;
        cursor: pointer;
      }
    }
    .showChannel:hover {
      .colorFrame, .delete { display: block; }
    }
  }
</style>
