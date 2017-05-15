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
    cityList:app.globalData.cityList,
    currentCity:'广州市',
    serveType:'ambulance',
    serveTit:'救护车预约',
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
    hideUsualCity:true,
    hideHospitalList:true,
    date:'2017-01-01',
    time:'00:00',
    floors:[2,3,4,5,6,7,8,9],
    currentFloor:2,
    hideNoticePage:true
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
  shiftServe:function (e) {
    var params = {
      serveType:e.currentTarget.dataset.serve
    }
    switch(e.currentTarget.dataset.serve){
      case 'ambulance' : params.serveTit = '救护车预约';break;
      case 'aviation' : params.serveTit = '航空医疗救援预约';break;
      case 'highSpeedRail' : params.serveTit = '高铁医疗救援预约';break;
      case 'helicopter' : params.serveTit = '直升机医疗救援预约';break;
      default : params.serveTit = '救护车预约';break;
    }
    this.setData(params)
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
  selectAddressConform:function (e) {
    var address = e.currentTarget.dataset.address,
      type = this.data.addressType
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
            beginAddress:wxMarkerData[0].address,
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
  showHospitalList:function () {
    this.setData({
      hideHospitalList:false,
      editAddress:''
    })
  },
  showUsualCity:function () {
    this.setData({
      hideUsualCity:false
    })
  },
  cancelChooseHospital:function () {
    this.setData({
      hideHospitalList:true,
      hideUsualCity:true,
      editAddress:''
    })
  },
  getDate:function () {
    var date = new Date(),
      Y = date.getFullYear(),
      M = date.getMonth()+1,
      D = date.getDate(),
      h = date.getHours(),
      m = date.getMinutes(),
      _format = function (num) {
        return num > 9 ? num : '0'+num
      }

    this.setData({
      date:Y+'-'+_format(M)+'-'+_format(D),
      time:_format(h)+':'+_format(m)
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
  },
  bindFloorChange:function (e) {
    this.setData({
      currentFloor: e.detail.value
    })
  },
  showNoticePage:function () {
    var ifShow = !this.data.hideNoticePage
    this.setData({
      hideNoticePage: ifShow
    })
  }
})