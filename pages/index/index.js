//index.js
//获取应用实例
const app = getApp()
const bmap  = require('../../libs/bmap-wx.min.js')
const config =   require('../../config/config')
const BMap = new bmap.BMapWX({
  ak: config.BaiDuMapAK
})

const objAssign = require('../../util/objectAssign')
import noticePage from  '../../components/noticePage/noticePage.js'
import mainForm from  '../../components/mainForm/mainForm.js'
import otherForm from  '../../components/otherForm/otherForm.js'
import addressSelect from  '../../components/addressSelect/addressSelect.js'
import login from  '../../components/login/login.js'
Page({
  data: {
    serveType:'ambulance',
    serveTit:'救护车预约',
    beginAddressDetail:{},
    endAddressDetail:{},
  },
  onLoad:function () {
    var that = this
    objAssign(that, mainForm,otherForm,noticePage,addressSelect,login)
    that.setData(that.data)
  },
  onReady: function () {
    this.getDate()
    this.initMap()

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
  //保存订单
  saveOrder:function () {
    var that = this

    if(JSON.stringify(that.data.beginAddressDetail) == "{}"){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'请输入出发地'
      })
      return
    }

    if(JSON.stringify(that.data.endAddressDetail) == "{}"){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'请输入目的地'
      })
      return
    }

    if(!that.data.agreeNoticePage){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'请阅读“医疗转运知情同意书”，并勾选同意'
      })
      return
    }

    if(app.globalData.userId === null){
      this.setData({
        showLoginModal:true
      })
      return
    }


    var data = {
      method:'saveOrder',
      source:'4',
      userId:app.globalData.userId,
      uuid:that.generateOrderId(),
      lat1:that.data.beginAddressDetail.latitude,
      lng1:that.data.beginAddressDetail.longitude,
      address1:that.data.beginAddressDetail.address,
      lat2:that.data.endAddressDetail.latitude,
      lng2:that.data.endAddressDetail.longitude,
      address2:that.data.endAddressDetail.address || that.data.endAddressDetail.title,
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

    //路程

    // that.getDistance(data.lat1,data.lng1,data.lat2,data.lng2,function (res) {
    //   data.distance = res.distance
    // })

    //价格（未完成）
    data.price1 = '600'
    console.log(data)
    // wx.setStorageSync('orderDetail', JSON.stringify(data))
    // wx.navigateTo({
    //   url:'/pages/confirmOrder/confirmOrder'
    // })

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
  },
  //计算距离
  getDistance:function (lat,lng,lat1,lng1,cb) {
    if(lat && lng && lat1 && lng1){
      const that = this
      wx.request({
        url: 'https://www.emtsos.com/emMiniApi.do',
        data: {
          method:'getDistance',
          lat:lat,
          lng:lng,
          lat1:lat1,
          lng1:lng1
        },
        success:function (res) {
          if(res.data.ret === 1){
            that.setData({
              distance:res.data.data.distance
            })
            that.getPrice(res.data.data.distance)
            typeof cb == "function" && cb(res.data.data)
          }
        },
        fail:function (err) {
          console.log(err)
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'坐标获取出错，请重新选择出发地或目的地'
      })
      return
    }

  },
  // 计算价格
  getPrice:function (distance) {
    let price = parseInt(distance)
    console.log(price)
  }
})