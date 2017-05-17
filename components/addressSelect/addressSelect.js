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
    controls:[],
    markers: [],
    hideUsualCity:true,
    hospitalList:[],
    hideHospitalList:true,
    cityList:app.globalData.cityList,
    currentCity:'广州市',
    currentCityAreaId:''
  },
  hideAddressSelect:function () {
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
        content:'该地点无明确位置，请重新选择其他地点'
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
    var address = e.currentTarget.dataset.address,
      type = this.data.addressType,
      data = {
        isShowAddressSelect:false,
        editAddress:'',
        addressType:''
      }
    if(type === 'endLocation'){ // 判断是否为目的地定位地点
      data.hideTotalPrice = false
      data.endAddress = address
      data.endAddressDetail = this.data.markers[0]
      this.setData(data)
    }else{
      data.beginAddress = address
      data.beginAddressDetail = this.data.markers[0]
      this.setData(data)
    }
  },
  //获取当前定位坐标
  getLocation:function (setBeginAddress) {
    var that = this
    BMap.regeocoding({
      fail: function (err) {
        console.log(err)
      },
      success: function (data) {
        var wxMarkerData = data.wxMarkerData
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
    if(e.type==='end'){
      this.getCenterLocation()
    }

  },
  //点击标记物
  markertap : function(e) {
    console.log(e)
  },
  //点击地图左下角按钮回到当前定位位置
  controltap : function(e) {
    console.log(e)
    // this.moveToLocation()
    this.getLocation()
  },
  //地图变换后切换标记物到中心前获取该标记物位置信息
  getCenterLocation: function () {
    var that = this
    this.mapCtx.getCenterLocation({
      success: function (res) {
        BMap.regeocoding({
          location:res.latitude+','+res.longitude,
          fail: function (err) {
            console.log(err)
          },
          success: function (data) {
            var  wxMarkerData = data.wxMarkerData
            wxMarkerData[0].title = wxMarkerData[0].address
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
      }
    })
  },
  //移动到当前定位
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  //获取医院列表
  getHospitalList:function (areaid) {
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
        }
      },
      fail:function (err) {
        console.log(err)
      }
    })
  },
  //获取区域id
  getAreaId:function () {
    var areaId = this.data.currentCityAreaId
    if(areaId === ''){
      switch (this.data.currentCity){
        case '广州市' : areaId = 1947;break;
        case '北京市' : areaId = 1;break;
        case '上海市' : areaId = 792;break;
        case '深圳市' : areaId = 1971;break;
        default : areaId = 1947;break;
      }
    }
    return areaId
  },
  //选择医院
  selectHospital:function (e) {
    var item = e.currentTarget.dataset.item
    var data = {
      endAddressDetail:item,
      hideTotalPrice:false,
      hideHospitalList:true,
      hideSugInfo:true,
      editAddress:''
    }
    if(item.addr && item.hospitalname){
      data.endAddress = item.addr + ' ' + item.hospitalname
    }else{ // 如果没有该参数则是输入关键字搜索的结果，需要对结果数据重新组装
      data.endAddress = item.name
      data.endAddressDetail = {
        iconPath: "/images/marker.png",
        id: item.uid,
        title:item.name,
        address:item.name,
        latitude: item.location.lat,
        longitude: item.location.lng
      }
    }
    this.setData(data)
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
  }
}