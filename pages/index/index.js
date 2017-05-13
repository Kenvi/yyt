//index.js
//获取应用实例
var app = getApp()
var bmap  = require('../../utils/bmap-wx.min.js')
var AK =  '3pcGRQbqAf19GeF1lFiO7BWeofRpsnQ9'
Page({
  data: {
    locate:{
      lat:'',
      lng:''
    },
    markers: [],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    sugData: '',
    isShowBeginAddressSelect:false,
    beginAddress:'',
    hideSugInfo:false
  },
  showBeginAddressSelect:function () {
    this.setData({
      isShowBeginAddressSelect:true
    })
  },
  hideBeginAddressSelect:function () {
    this.setData({
      isShowBeginAddressSelect:false,
      beginAddress:''
    })
  },
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
    var BMap = new bmap.BMapWX({
      ak: AK
    });
    BMap.suggestion({
      query: e.detail.value,
      region: '广州',
      city_limit: true,
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
  selectAddress:function (e) {
    var item = e.target.dataset.item
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
      longitude: item.location.lng,
      width: 15,
      height: 19
    }]
    this.setData({
      beginAddress:item.name,
      markers:markers,
      locate:{
        lat:item.location.lat,
        lng:item.location.lng
      },
      hideSugInfo:true
    })
  },
  selectAddressConform:function () {
    this.setData({
      isShowBeginAddressSelect:false
    })
  },
  regionchange : function(e) {
    console.log(e.type)
  },
  markertap : function(e) {
     const that = this
     wx.getLocation({
       success:function (res) {
         that.setData({
           locate:{
             lat:res.latitude,
             long:res.longitude
           }
         })
       }
     })
  },
  controltap : function(e) {
    this.moveToLocation()
  },
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('startlocate')
    var info = wx.getSystemInfoSync()
    this.setData({
      controls: [{
        id: 1,
        iconPath: '/images/aim.png',
        position: {
          left: 10,
          top: info.windowHeight-50,
          width: 30,
          height: 30
        },
        clickable: true
      }]
    })
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  }
})