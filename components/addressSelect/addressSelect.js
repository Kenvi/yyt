/**
 * Created by Administrator on 2017/5/17/017.
 */
"use strict"
const app = getApp()
const bmap  = require('../../libs/bmap-wx.min.js')
const config =   require('../../config/config')
const BMap = new bmap.BMapWX({
  ak: config.BaiDuMapAK
})
export default {
  data:{
    isShowAddressSelect:false,
    editAddress:'',
    addressType:'',
    hideSugInfo:true,
    sugData: '',
    locate:{
      lat:'',
      lng:''
    },
    centerLocation:{
      lat:0,
      lng:0
    },
    controls:[],
    markers: [],
    hideUsualCity:true,
    hospitalList:[],
    hideHospitalList:true,
    cityList:app.globalData.cityList,
    currentCity:'广州市',
    currentCityAreaId:'',
    distance:'',
    changing:false
  },
  initMap:function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('startlocate')
    this.getLocation(true)
    const info = wx.getSystemInfoSync()
    // console.log(info)
    this.setData({
      controls: [{
        id: 1,
        iconPath: '/images/aim.png',
        position: {
          left: 15,
          top: info.windowHeight-150,
          width: 30,
          height: 30
        },
        clickable: true
      }],
      // clientWidth:info.windowWidth,
      // clientHeight:info.screenHeight - info.windowWidth/375 * 112,
      // mapHeight:info.screenHeight - info.windowWidth/375 * (90+112),
      clientHeight:info.windowHeight,
      mapHeight:info.windowHeight - info.windowWidth/375 * 50,
      // confirmTop:info.windowHeight - info.windowWidth/375 * 40
    })
  },
  hideAddressSelect:function () {
    if(wx.showTabBar){
      wx.showTabBar({
        animation:true
      })
    }
    this.setData({
      isShowAddressSelect:false,
      addressType:''
    })
  },
  //地址输入
  bindKeyInput: function(e) {
    var that = this;
    that.setData({
      hideSugInfo:false
    })
    if (e.detail.value === '') {
      that.setData({
        sugData: ''
      });
      return;
    }
    BMap.suggestion({
      query: e.detail.value,
      region: '广州',
      city_limit: false,
      fail: function(data) {
        console.log(data)
      },
      success: function(data) {
        that.setData({
          sugData: data.result
        });
      }
    });
  },
  //选择地址
  selectAddress:function (e) {
    var item = e.currentTarget.dataset.item
    if(!item.location){
      wx.showModal({
        title:'提示',
        content:'该地点无明确位置，请重新选择其他地点',
        showCancel:false
      })
      return
    }
    var markers = [{
      iconPath: "/images/marker.png",
      id: item.uid,
      title:item.name,
      latitude: item.location.lat,
      longitude: item.location.lng
    }]
    this.setData({
      editAddress:item.name,
      markers:markers,
      locate:{
        lat:item.location.lat,
        lng:item.location.lng
      },
      hideSugInfo:true
    })
  },
  //确认地址
  selectAddressConform:function (e) { // 确认定位地点为目标地点
    const address = e.currentTarget.dataset.address,
          type = this.data.addressType
    let data = {
      isShowAddressSelect:false,
      editAddress:'',
      addressType:''
    }
    if(type === 'endLocation'){ // 判断是否为目的地定位地点
      if(address === '') {
        data.endAddress = this.data.markers[0].address
      }else{
        data.endAddress = address
      }
      data.endAddressDetail = this.data.markers[0]
      this.setData(data)
    }else{
      data.beginAddress = address
      data.beginAddressDetail = this.data.markers[0]
      this.setData(data)
    }
    // console.log('confirmAddress')
    const lat = this.data.beginAddressDetail.latitude,
      lng = this.data.beginAddressDetail.longitude,
      lat1 = this.data.endAddressDetail.latitude || this.data.endAddressDetail.lat1,
      lng1 = this.data.endAddressDetail.longitude || this.data.endAddressDetail.lng1
    // console.log(lat,lng,lat1,lng1)
    if(lat && lng && lat1 && lng1){
      this.getDistance(lat,lng,lat1,lng1)
    }

    if(wx.showTabBar){
      wx.showTabBar({
        animation:true
      })
    }
  },
  //获取当前定位坐标
  getLocation:function (setBeginAddress) {
    wx.showLoading({
      title:'正在定位',
      mask:true
    })
    var that = this
    BMap.regeocoding({
      fail: function (err) {
        wx.hideLoading()
        wx.showModal({
          title:'提示',
          content:'用户拒绝授权，无法使用定位功能，请点击右上角->关于易医通->点击右上角->设置->允许地理位置授权',
          showCancel:false
        })
      },
      success: function (data) {
        wx.hideLoading()

        let wxMarkerData = data.wxMarkerData
        wxMarkerData[0].title = wxMarkerData[0].address
        if(setBeginAddress){
          that.setData({
            beginAddress:wxMarkerData[0].address,
            beginAddressDetail:wxMarkerData[0],
            currentCity:data.originalData.result.addressComponent.city
          })
        }
        that.setData({
          locate:{
            lat:wxMarkerData[0].latitude,
            lng:wxMarkerData[0].longitude
          },
          markers: wxMarkerData,
          editAddress:wxMarkerData[0].address
        })
      },
      iconPath: '/images/marker.png',
      iconTapPath: '/images/marker.png'
    })

  },
  //地图变换后切换标记物到中心
  regionchange:function (e) {
    console.log(this.data.changing)
    if(e.type==='end' && !this.data.changing){
      this.getCenterLocation()
    }

  },
  //点击标记物
  markertap : function(e) {
    if(e.markerId !== 0){
      this.getCenterLocation('notChangeEditAddress')
    }
  },
  //点击地图左下角按钮回到当前定位位置
  controltap : function(e) {
    console.log(e)
    // this.moveToLocation()
    this.getLocation()
  },
  //地图变换后切换标记物到中心前获取该标记物位置信息
  getCenterLocation: function (change) {
    this.setData({
      changing:true
    })
    const that = this
    this.mapCtx.getCenterLocation({
      success: function (res) {
        if(!that.centerLocation){
          that.centerLocation = {lat:0,lng:0}
        }
        if(res.latitude === that.centerLocation.lat && res.longitude === that.centerLocation.lng){
          that.setData({
            changing:false
          })
          return
        }else{
          that.centerLocation.lat = res.latitude
          that.centerLocation.lng = res.longitude
          BMap.regeocoding({
            location:res.latitude+','+res.longitude,
            fail: function (err) {
              wx.showModal({
                title:'提示',
                content:'用户拒绝授权，无法使用定位功能',
                showCancel:false
              })
              that.setData({
                changing:false
              })
            },
            success: function (data) {
              let  wxMarkerData = data.wxMarkerData
              const province = data.originalData.result.addressComponent.province
              const city = data.originalData.result.addressComponent.city
              const address = wxMarkerData[0].address
              wxMarkerData[0].title = address.replace(province,'').replace(city,'')

              let settings = {
                locate:{
                  lat:wxMarkerData[0].latitude,
                  lng:wxMarkerData[0].longitude
                },
                markers: wxMarkerData
              }

              if(change && change === 'notChangeEditAddress'){

              }else{
                settings.editAddress = wxMarkerData[0].address
              }
              that.setData(settings)

              setTimeout(()=>{
                that.setData({
                  changing:false
                })
              },500)
              // console.log(that.data.changing)
            },
            iconPath: '/images/marker.png',
            iconTapPath: '/images/marker.png'
          })
        }

      },
      fail:function(err){
        that.setData({
          changing:false
        })
        console.log(err)
      }
    })
  },
  centerSuccess:function () {
    return new Promise(function (resolve,reject) {

    })
  },
  //移动到当前定位
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  //获取医院列表
  getHospitalList:function (areaid) {
    wx.showLoading({
      title:'加载中'
    })
    var that = this
    var params = {
      method:'getHospitalList',
      t:0
    }
    if(areaid){
      params.areaid = areaid
    }else{
      params.areaid = '1947'
    }
    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      data: params,
      success:function (res) {
        if(res.data.ret === 1){
          that.setData({
            hospitalList:res.data.data.hospitalList
          })
          wx.hideLoading()
        }
      },
      fail:function (err) {
        console.log(err)
      }
    })
  },
  //获取区域id
  getAreaId:function () {
    let areaId = this.data.currentCityAreaId
    if(areaId === ''){
      switch (this.data.currentCity){
        case '广州市' : areaId = 1947;break;
        case '北京市' : areaId = 1;break;
        case '上海市' : areaId = 792;break;
        case '深圳市' : areaId = 1971;break;
        case '珠海市' : areaId = 1978;break;
        case '佛山市' : areaId = 1990;break;
        default : areaId = 1947;break;
      }
    }
    return areaId
  },
  //选择医院
  selectHospital:function (e) {
    const that = this,
          item = e.currentTarget.dataset.item,
          lat = that.data.beginAddressDetail.latitude,
          lng = that.data.beginAddressDetail.longitude
    let   lat1 ,  lng1
    let data = {
      endAddressDetail:item,
      hideHospitalList:true,
      hideSugInfo:true,
      editAddress:''
    }
    if(item.addr && item.hospitalname){
      data.endAddress =  item.hospitalname
      lat1 = item.lat1
      lng1 = item.lng1
    }else{ // 如果没有该参数则是输入关键字搜索的结果，需要对结果数据重新组装
      if(!item.location){
        wx.showModal({
          title:'提示',
          content:'该地点无明确位置，请重新选择其他地点',
          showCancel:false
        })
        return
      }
      data.endAddress = item.name
      data.endAddressDetail = {
        iconPath: "/images/marker.png",
        id: item.uid,
        title:item.name,
        address:item.name,
        latitude: item.location.lat,
        longitude: item.location.lng
      }
      lat1 = item.location.lat
      lng1 = item.location.lng
    }
    that.setData(data)

    this.getDistance(lat,lng,lat1,lng1)

  },
  //显示本地缓存的常用城市
  showUsualCity:function () {
    this.setData({
      hideUsualCity:false
    })
  },
  //选择城市
  chooseCity:function (e) {
    var item = e.currentTarget.dataset.item
    this.setData({
      currentCity:item.areaname,
      currentCityAreaId:item.areaid,
      hideSugInfo:true,
      hideUsualCity:true
    })
    this.showHospitalList()
  },
  //取消选择医院
  cancelChooseHospital:function () {
    this.setData({
      hideHospitalList:true,
      hideUsualCity:true,
      hideSugInfo:true,
      editAddress:''
    })
  },
  // 检查地址是否输入
  checkAddressInput:function () {
    return JSON.stringify(this.data.beginAddressDetail) !== "{}" && JSON.stringify(this.data.endAddressDetail) !== "{}"
  }
}