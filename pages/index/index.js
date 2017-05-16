//index.js
//获取应用实例
var app = getApp()
var bmap  = require('../../libs/bmap-wx.min.js')
var config =   require('../../config/config')
var BMap = new bmap.BMapWX({
  ak: config.BaiDuMapAK
})
Page({
  data: {
    cityList:app.globalData.cityList,
    currentCity:'广州市',
    currentCityAreaId:'',
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
    beginAddressDetail:{},
    endAddress:'',
    endAddressDetail:{},
    editAddress:'',
    addressType:'',
    hideSugInfo:true,
    hideUsualCity:true,
    hospitalList:[],
    hideHospitalList:true,
    date:'2017-01-01',
    time:'00:00',
    floors:[2,3,4,5,6,7,8,9],
    currentFloor:0,
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
  // 顶部tab切换
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
  //显示，隐藏地图
  showAddressSelect:function (e) {
    var that = this
    if(this.data.beginAddress === ''){
      wx.showModal({
        title:'提示',
        content:'正在定位，请稍后再次尝试'
      })
      return
    }
    if(e.currentTarget.dataset.type && e.currentTarget.dataset.type==='endLocation'){
      var item = this.data.endAddressDetail
      var data = {
        isShowAddressSelect:true,
        addressType:e.target.dataset.type
      }
      if(this.data.endAddress !== ''){
        data.editAddress = this.data.endAddress
      }else{
        data.editAddress = ''
      }
      if(item.lat1 && item.lng1){
        data.locate = {
          lat:item.lat1,
          lng:item.lng1
        }
        data.markers = [{
          id:'0',
          latitude:item.lat1,
          longitude:item.lng1,
          address:item.hospitalname,
          desc:item.addr,
          iconPath: '/images/marker.png',
          iconTapPath: '/images/marker.png',
          alpha:1
        }]
        this.setData(data)
      }else{
        data.locate = {
          lat:item.latitude,
          lng:item.longitude
        }
        data.markers = [item]
        this.setData(data)
      }
      console.log(data)
    }else{
      var data = {
        isShowAddressSelect:true,
        markers:[that.data.beginAddressDetail],
        locate:{
          lat:that.data.beginAddressDetail.latitude,
          lng:that.data.beginAddressDetail.longitude
        }
      }
      if(this.data.beginAddress !== '') {
        data.editAddress = this.data.beginAddress
      }else{
        data.editAddress = ''
      }

      this.setData(data)
    }

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
      type = this.data.addressType
    if(type === 'endLocation'){ // 判断是否为目的地定位地点
      this.setData({
        isShowAddressSelect:false,
        endAddress:address,
        endAddressDetail:this.data.markers[0],
        editAddress:'',
        addressType:''
      })
    }else{
      this.setData({
        isShowAddressSelect:false,
        beginAddress:address,
        beginAddressDetail:this.data.markers[0],
        editAddress:'',
        addressType:''
      })
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
  //显示医院列表
  showHospitalList:function () {
    this.setData({
      hideHospitalList:false,
      editAddress:''
    })
    var areaId = this.getAreaId()
    this.getHospitalList(areaId)
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
    console.log(item)
    this.setData({
      endAddressDetail:item,
      endAddress:item.addr + ' ' + item.hospitalname,
      hideHospitalList:true,
      editAddress:''
    })
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
      hideUsualCity:true
    })
    this.showHospitalList()
  },
  //取消选择医院
  cancelChooseHospital:function () {
    this.setData({
      hideHospitalList:true,
      hideUsualCity:true,
      editAddress:''
    })
  },
  //获取当前时间并格式化
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
  //日期控件变换
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //时间控件变换
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  //选择担架上楼后记录楼层变化
  bindFloorChange:function (e) {
    this.setData({
      currentFloor: e.detail.value
    })
  },
  //显示医疗转运通知书
  showNoticePage:function () {
    var ifShow = !this.data.hideNoticePage
    this.setData({
      hideNoticePage: ifShow
    })
  }
})