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
    needRespirator:false,
    needLitter:false,
    needWheelChair:false,
    ifShowFloorChange:false,
    floors:[2,3,4,5,6,7,8,9],
    currentFloor:0,
    currentPersonNum:0,
    personNum:[1,2,3,4,5,6,7,8,9],
    hideNoticePage:true,
    agreeNoticePage:false
  },
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('startlocate')
    this.getDate()
    this.getLocation(true)
    var info = wx.getSystemInfoSync()
    console.log(info)
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
      needRespirator:false,
      needLitter:false,
      needWheelChair:false,
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
        if(!item.latitude){ // 判断是否已经保存有目的地信息，如果没有则使用起点坐标
          item = this.data.beginAddressDetail
        }
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
    var data = {
      endAddressDetail:item,
      hideHospitalList:true,
      hideSugInfo:true,
      editAddress:''
    }
    if(item.addr && item.hospitalname){
      data.endAddress = item.addr + ' ' + item.hospitalname
    }else{
      data.endAddress = item.name
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
  //呼吸机选择切换
  ambulanceAddRespirator:function (e) {
    this.setData({
      needRespirator: e.detail.value
    })
  },
  //是否需要呼吸机
  addRespirator:function () {
    this.setData({
      needRespirator: !this.data.needRespirator
    })
  },
  //是否需要担架
  addLitter:function () {
    this.setData({
      needLitter: !this.data.needLitter
    })
  },
  //是否需要轮椅
  addWheelChair:function () {
    this.setData({
      needWheelChair: !this.data.needWheelChair
    })
  },
  //担架上楼选择切换
  showFloorChange:function (e) {
    this.setData({
      ifShowFloorChange: e.detail.value
    })
  },
  //选择担架上楼后记录楼层变化
  bindFloorChange:function (e) {
    this.setData({
      currentFloor: e.detail.value
    })
  },
  //出行人数记录变化
  bindPersonNumChange:function (e) {
    this.setData({
      currentPersonNum: e.detail.value
    })
  },
  //显示医疗转运通知书
  showNoticePage:function () {
    var ifShow = !this.data.hideNoticePage
    this.setData({
      hideNoticePage: ifShow
    })
  },
  //同意医疗转运通知书
  checkNoticePageAgreement:function (e) {
    this.setData({
      agreeNoticePage: !this.data.agreeNoticePage
    })
  },
  //保存订单
  saveOrder:function () {
    var that = this
    var data = {
      method:'saveOrder',
      userId:app.globalData.userId,
      uuid:that.generateOrderId(),
      lat1:that.data.beginAddressDetail.latitude,
      lng1:that.data.beginAddressDetail.longitude,
      address1:that.data.beginAddressDetail.address,
      lat2:that.data.endAddressDetail.latitude,
      lng2:that.data.endAddressDetail.longitude,
      address2:that.data.endAddressDetail.address,
    }

    //订单类型
    switch (that.data.serveType){
      case 'ambulance' : data.otype = '0';break;
      case 'aviation' : data.otype = '6';break;
      case 'highSpeedRail' : data.otype = '7';break;
      case 'helicopter' : data.otype = '8';break;
      default : data.otype = '0';break;
    }

    //出发地信息
    that.coordinateToCity(data.lat1,data.lng1,function (cityData) {
      data.province1 = cityData.province
      data.city1 = cityData.city
      data.district1 = cityData.district
    })

    // 目的地信息
    if(!data.lat2 || !data.lng2 || !data.address2){
      data.lat2 = that.data.endAddressDetail.lat1
      data.lng2 = that.data.endAddressDetail.lng1
      data.address2 = that.data.endAddressDetail.addr
    }
    that.coordinateToCity(data.lat2,data.lng2,function (cityData) {
      data.province2 = cityData.province
      data.city2 = cityData.city
      data.district2 = cityData.district
    })

    //配套服务（未完成）
    data.servicetype = '10003,10004'

    //出行人数
    data.option1 = that.data.personNum[that.data.currentPersonNum]

    //是否需要担架上楼
    data.option2 = that.data.ifShowFloorChange ? '1' : '0'
    //担架上楼楼层
    if(that.data.ifShowFloorChange) data.option2num = that.data.floors[that.data.currentFloor]

    //机场内外（未完成）
    data.option3 = '0'

    //出发时间
    data.departuredate = that.data.date + ' ' + that.data.time + ':00'

    //路程（未完成）
    data.distance = '22'

    //价格（未完成）
    data.price1 = '600'
    console.log(data)

  },
  //生成订单号
  generateOrderId:function () {
    var userId = app.globalData.userId
    var timestamp = new Date().getTime()
    return userId + timestamp
  },
  //坐标转换城市
  coordinateToCity:function (lat,lng,cb) {
    BMap.regeocoding({
      location:lat+','+lng,
      fail: function (err) {
        console.log(err)
      },
      success: function (data) {
        var cityData = {
          province:data.originalData.result.addressComponent.province,
          city:data.originalData.result.addressComponent.city,
          district:data.originalData.result.addressComponent.district
        }
        typeof cb == "function" && cb(cityData)
      }
    })
  }
})