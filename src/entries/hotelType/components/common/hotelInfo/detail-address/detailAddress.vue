<template>
  <div class="detailAddress">
    <div style="width:545px;margin:0 auto;">
      <Row class="currentLocation">
        <Col span="4" class="formLabel">所属区域</Col>
        <Col span="20">
          <Area-choose :data="addressDataList" @on-change="onChangeAddress" ref="areaChoose" :address-info="addressInfo"></Area-choose>
          <!-- <app-cascader :data="addressDataList" :load-data="loadData" @on-change="onChangeAddress" :selectedDataFormParent="selectedData"></app-cascader> -->
        </Col>
      </Row>
      <Row class="searchLocation">
        <Col span="4" class="formLabel">详细地址</Col>
        <Col span="20">
          <Input :maxlength="40" v-model="searchValue" @on-focus="onFocus" @on-change="errinfo = ''" @on-enter="searchLocation" icon="ios-search" placeholder="请输入客栈详细地址，无需输入省市区" style="border-radius:6px;">
            <Button class="searchButton" @click="searchLocation" slot="append" icon="ios-search"></Button>
          </Input>
        </Col>
      </Row>
      <Row style="height: 20px;margin:5px 0">
        <Col span="18" offset="4" v-if="errinfo">
          <p style="color: #ff280b;">{{errinfo}}</p>
        </Col>
        <!-- <Col id="panel" class="panel open" span="10"></Col>
        <Col class="panel close" @click.native="backResultPanel" span="10" v-show="panelStatus === 'close'">
          <Icon type="chevron-left"></Icon>&nbsp;&nbsp;返回搜索结果
        </Col> -->
      </Row>
    </div>
    <main>
      <div id="map" ref="map">
        <div class="loading" v-show="loading">
          <Spin style="display:inline-block">
            <!-- <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
            <div>Loading</div> -->
          </Spin>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { hotelInforApiServers } from '../../../../api/API'
import AppCascader from '../app-cascader/'
import AreaChoose from 'hotelType/components/common/hotelInfo/AreaChoose/'


export default {
  name: 'detailAddress',
  components: {
    AppCascader,
    AreaChoose
  },
  // computed: {
  //   // a computed getter
  //   addressInfo: function () {
  //     alert(11)
  //   }
  // },
  // props: {
  //   addressInfo: {
  //     type: Object,
  //     default () {
  //       return {}
  //     }
  //   }
  // },
  data () {
    return {
      map: null,
      myGeo: null,
      overlay: null,
      searchValue: '',
      panelStatus: '',
      addressDataList: [],
      point: [],
      pointPut: {},
      selectedData: [],
      isInitAddress: false,
      errinfo: '',
      callbackData: {},
      polygons:[],
      loading:false,
      addressInfo:null,
      setPointFlag:false
    }
  },
  methods: {
    onFocus () {
      this.errinfo = ''
    },
    searchChange (val) {
      /* 监听输入给值 */
      this.callbackData.address = this.searchValue
      this.$emit('on-address', this.callbackData)
    },
    searchLocation () {
      /* 搜索本地 */
      let _this = this
      if(!this.searchValue){
        this.$Message.error('请输入详细地址！')
        return
      }
      _this.map.clearMap();
      if(this.$refs.areaChoose.selectData.length < 2){
        this.$Message.error('请先完善省市区！')
        return
      }
      let selectDataLength = this.$refs.areaChoose.selectData.length
      let searchRange = this.$refs.areaChoose.selectData[selectDataLength-1].label

      AMap.plugin('AMap.PlaceSearch', function(){
        var autoOptions = {
          city: searchRange,
          citylimit: true,
        }
        var placeSearch = new AMap.PlaceSearch(autoOptions);
        placeSearch.search(_this.searchValue, function(status, result) {
          if(result.info == 'OK'){
            if(result.poiList.count > 0){
              let searchResult = result.poiList.pois[0]
              let lng = searchResult.location.lng
              let lat = searchResult.location.lat
              var marker = new AMap.Marker({
                position: new AMap.LngLat(lng, lat),
                draggable: true
              });
              _this.pointPut.lng = lng
              _this.pointPut.lat = lat
              _this.setPointFlag = true
              AMap.event.addListener(marker,'dragend',function(e){
                let lng = e.lnglat.lng
                let lat = e.lnglat.lat
                _this.pointPut.lng = lng
                _this.pointPut.lat = lat
                _this.setPointFlag = true
                // AMap.plugin('AMap.Geocoder', function(){
                //   let geocoder = new AMap.Geocoder();
                //   geocoder.getAddress([lng,lat], function(status, result) {
                //     if (status === 'complete'&&result.regeocode) {
                //       // _this.searchValue = result.regeocode.formattedAddress
                //         _this.searchValue = result.regeocode.addressComponent.township + result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber
                //     }else{alert(JSON.stringify(result))}
                //   });
                // })
              });
              _this.map.setCenter([lng,lat]);
              _this.map.add(marker);
              _this.map.setZoom(16);
            }
          }else{
            _this.errinfo = '*  未查询到该地址，请尝试手动标注！'
            let len = _this.$refs.areaChoose.selectData.length;
            _this.map.clearMap();
            if(_this.$refs.areaChoose.selectData[len-1].lng){
              let lng = _this.$refs.areaChoose.selectData[len-1].lng
              let lat = _this.$refs.areaChoose.selectData[len-1].lat
              var marker = new AMap.Marker({
                position: new AMap.LngLat(lng, lat),
                draggable: true
              });
              _this.map.add(marker);
              // _this.map.setFitView()
            }
            _this.map.setZoom(12);
            AMap.event.addListener(marker,'dragend',function(e){
              let lng = e.lnglat.lng
              let lat = e.lnglat.lat
              _this.pointPut.lng = lng
              _this.pointPut.lat = lat
              _this.errinfo = ''
              _this.setPointFlag = true
              // AMap.plugin('AMap.Geocoder', function(){
              //   let geocoder = new AMap.Geocoder();
              //   geocoder.getAddress([lng,lat], function(status, result) {
              //     if (status === 'complete'&&result.regeocode) {
              //       // _this.searchValue = result.regeocode.formattedAddress
              //         _this.searchValue = result.regeocode.addressComponent.township + result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber
              //     }else{alert(JSON.stringify(result))}
              //   });
              // })
            });
          }
          // 搜索成功时，result即是对应的匹配数据
          // var node = new PrettyJSON.view.Node({
          //     el: document.querySelector("#input-info"),
          //     data: result
          // });
        })
      })
    },
    setLocation (point, times = 17) {
      this.map.clearOverlays()
      let marker = new AMap.Marker(point)
      this.map.centerAndZoom(point, times);
      this.map.addOverlay(marker);
      marker.enableDragging()
      this.setSearchValue(marker)
      marker.addEventListener('dragend', (data) => {
        this.setSearchValue(data)
      })
    },
    setSearchValue(item) {
      /* 点击选择点后，赋值给searchValue */
      this.callbackData = {
        address: this.searchValue,
        point: item.point,
        cascaderData: this.selectedData
      }
      this.$emit('on-address', this.callbackData)
    },
    initMap (lng, lat) {
      console.log(lng)
      console.log(lat)
      let _this = this
      this.searchValue = this.addressInfo.address


      const map = this.map = new AMap.Map('map',{
        resizeEnable: true,
        center: [lng, lat],//地图中心点
        zoom: 16 //地图显示的缩放级别
      })
      

      var marker = new AMap.Marker({
          position: new AMap.LngLat(lng, lat),
          draggable: true
          // offset: new AMap.Pixel(-10, -10),
      });

      this.map.add(marker);
      // _this.setPointFlag = true
      AMap.event.addListener(marker,'dragend',function(e){
        let lng = e.lnglat.lng
        let lat = e.lnglat.lat
        _this.pointPut.lng = lng
        _this.pointPut.lat = lat
        _this.setPointFlag = true
        // AMap.plugin('AMap.Geocoder', function(){
        //   let geocoder = new AMap.Geocoder();
        //   geocoder.getAddress([lng,lat], function(status, result) {
        //     if (status === 'complete'&&result.regeocode) {
        //       // _this.searchValue = result.regeocode.formattedAddress
        //         _this.searchValue = result.regeocode.addressComponent.township + result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber
        //     }else{alert(JSON.stringify(result))}
        //   });
        // })
      });
    },
    onChangeAddress (data) {
      console.log(data)
      let _this = this
      _this.loading = true
      let selectData = data.selectData
      _this.map.clearMap();
      _this.map.remove(_this.polygons)
      _this.polygons=[];

      AMap.plugin('AMap.DistrictSearch', function(){
        console.log(selectData)
        let district = null
        _this.polygons=[];
        if(!district){
          //实例化DistrictSearch
          var opts = {
              subdistrict: 1,   //获取边界不需要返回下级行政区
              extensions: 'all',  //返回行政区边界坐标组等具体信息
              level: 'district',  //查询行政级别为 市
          };
          district = new AMap.DistrictSearch(opts);
        }
        //行政区查询
        let search = ''
        let zoom = 6
        if(data.type == 1){
          district.setLevel('province')
          search = selectData[0].label
          zoom = 6
        }else if(data.type == 2){
          district.setLevel('city')
          search = selectData[1].label
          zoom = 8
        }else{
          district.setLevel('district')
          search = selectData[2].label
          zoom = 12
        }
        district.search(search, function(status, result) {
          if(result.info == 'OK'){
            _this.map.remove(_this.polygons)//清除上次结果
            _this.polygons = [];
            var bounds = result.districtList[0].boundaries;
            if (bounds) {
                for (var i = 0, l = bounds.length; i < l; i++) {
                    //生成行政区划polygon
                    var polygon = new AMap.Polygon({
                        strokeWeight: 0.5,
                        path: bounds[i],
                        fillOpacity: 0,
                        fillColor: '#80d8ff',
                        strokeColor: '#0091ea'
                    });
                    _this.polygons.push(polygon);
                }
            }
            _this.map.add(_this.polygons)
            _this.map.setFitView(_this.polygons);//视口自适应
            _this.map.setZoom(zoom);

            var lng = result.districtList[0].center.lng;
            var lat = result.districtList[0].center.lat;
            _this.pointPut.lng = lng
            _this.pointPut.lat = lat
            var marker = new AMap.Marker({
                position: new AMap.LngLat(lng, lat),
                draggable: true
            });
            _this.map.setCenter([lng,lat]);
            _this.map.add(marker);

            AMap.event.addListener(marker,'dragend',function(e){
              let lng = e.lnglat.lng
              let lat = e.lnglat.lat
              _this.pointPut.lng = lng
              _this.pointPut.lat = lat
              _this.setPointFlag = true
              // AMap.plugin('AMap.Geocoder', function(){
              //   let geocoder = new AMap.Geocoder();
              //   geocoder.getAddress([lng,lat], function(status, result) {
              //     if (status === 'complete'&&result.regeocode) {
              //       // _this.searchValue = result.regeocode.formattedAddress
              //         _this.searchValue = result.regeocode.addressComponent.township + result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber
              //     }else{alert(JSON.stringify(result))}
              //   });
              // })
            });
          }else{
            console.log('搜索不到该区域')
            // 澳门特殊处理
            if(selectData[0].id == 820000 || selectData[0].value == 820000){
                if(selectData[1].id == 820100){
                    let data = {
                        type: 1,
                        selectData: selectData
                    }
                    _this.onChangeAddress(data)
                }
            }else{
                let data = {
                    type: 2,
                    selectData: selectData
                }
                _this.onChangeAddress(data)
            }
          }
          _this.loading = false
        })
      })
    },
    loadData (data, callback) {
      let param = {parentid: data.value}
      if (data.level === 3) {
        callback()
        return false
      }
      hotelInforApiServers.getAllCityAdresse(param).then(result => {
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
          data.children = emptyList
          callback()
        }
      })
    },
    getAllProvinceAdresse () {
      hotelInforApiServers.getAllProvinceAdresse().then(result => {
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
          this.addressDataList = emptyList
        }
      })
    },
    initCacheData() {
      if(!this.addressInfo.city){
        // 无地址的默认北京市地址
        this.addressInfo.city = 110000
      }
      hotelInforApiServers.getAllCityAdresse({parentid: this.addressInfo.city}).then(result => {
        console.log(result)
        if (result.code === '000000') {
          // let lng = 0
          // let lat = 0
          // let list =  result.content
          // for (let i = 0, len = list.length; i < len; i++) {
          //   let item = list[i]
          //   if (this.addressInfo.region === item.id) {
          //     lng = item.lng
          //     lat = item.lat
          //   }
          // }
          let lng = this.addressInfo.innLongitude
          let lat = this.addressInfo.innLatitude
          if(lng == 'undefined' || lat == 'undefined' || !lng || !lat){
            lng = 116.397477
            lat = 39.908692
          }
          if(lng && lat){
            this.initMap(lng, lat)
          }
        }
      })
      
      // this.selectedData = [
      //   {value: this.addressInfo.province, label: this.addressInfo.provinceName},
      //   {value: this.addressInfo.city, label: this.addressInfo.cityName},
      //   {value: this.addressInfo.region, label: this.addressInfo.regionName}
      // ]
    }
  },
  created () {
    let addressInfo = this.$parent.$parent.addressInfo
    this.addressInfo = addressInfo
    this.getAllProvinceAdresse()
    // this.initCacheData()

    // this.callbackData = {
    //   point: {
    //     lat: this.addressInfo.innLatitude,
    //     lng: this.addressInfo.innLongitude
    //   },
    //   address: this.addressInfo.address,
    //   selectedData: [
    //     { label: this.addressInfo.provinceName, value: this.addressInfo.province },
    //     { label: this.addressInfo.cityName, value: this.addressInfo.city },
    //     { label: this.addressInfo.regionName, value: this.addressInfo.region },
    //   ]
    // }
  },
  mounted() {
    let addressInfo = this.$parent.$parent.addressInfo
    this.addressInfo = addressInfo
    console.log(this.addressInfo)
    this.initCacheData()

    this.callbackData = {
      point: {
        lat: this.addressInfo.innLatitude,
        lng: this.addressInfo.innLongitude
      },
      address: this.addressInfo.address,
      selectedData: [
        { label: this.addressInfo.provinceName, value: this.addressInfo.province },
        { label: this.addressInfo.cityName, value: this.addressInfo.city },
        { label: this.addressInfo.regionName, value: this.addressInfo.region },
      ]
    }
  }
}
</script>

<style lang="scss">
@import './detailAddress'
</style>

