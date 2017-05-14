//index.js
//获取应用实例
var app = getApp()
var bmap  = require('../../utils/bmap-wx.min.js')
var AK =  '3pcGRQbqAf19GeF1lFiO7BWeofRpsnQ9'
var BMap = new bmap.BMapWX({
  ak: AK
})
Page({
  data: {
    locate:{
      lat:'',
      lng:''
    },
    controls:[],
    markers: [],
    sugData: '',
    isShowAddressSelect:false,
    beginAddress:'',
    endAddress:'',
    editAddress:'',
    addressType:'',
    hideSugInfo:true,
    date:'2017-01-01',
    time:'00:00'
  },
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('startlocate')
    this.getDate()
    this.getLocation(true)
    var info = wx.getSystemInfoSync()
    this.setData({
      controls: [{
        id: 1,
        iconPath: '/images/aim.png',
        position: {
          left: 15,
          top: info.windowHeight-100,
          width: 30,
          height: 30
        },
        clickable: true
      }]
    })
  },
  showAddressSelect:function (e) {
    if(this.data.beginAddress === ''){
      wx.showModal({
        title:'提示',
        content:'正在定位，请稍后再次尝试'
      })
      return
    }
    if(e.target.dataset.type){
      this.setData({
        addressType:e.target.dataset.type
      })
    }
    this.setData({
      isShowAddressSelect:true
    })
  },
  hideBeginAddressSelect:function () {
    this.setData({
      isShowAddressSelect:false,
      addressType:''
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
  selectAddressConform:function (e) {
    var address = e.target.dataset.address,
      type = e.target.dataset.type
    if(type === 'endLocation'){
      this.setData({
        isShowAddressSelect:false,
        endAddress:address,
        addressType:''
      })
    }else{
      this.setData({
        isShowAddressSelect:false,
        beginAddress:address,
        addressType:''
      })
    }
  },
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
            beginAddress:wxMarkerData[0].address
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
  regionchange:function (e) {
    if(e.type==='end'){
      this.getCenterLocation()
    }

  },
  markertap : function(e) {
    console.log(e)
  },
  controltap : function(e) {
    console.log(e)
    this.moveToLocation()
    this.getLocation()
  },
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
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  getDate:function () {
    var date = new Date(),
      Y = date.getFullYear(),
      M = date.getMonth()+1,
      D = date.getDate(),
      h = date.getHours(),
      m = date.getMinutes()

    this.setData({
      date:Y+'-'+M+'-'+D,
      time:h+':'+m
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  }
})