/**
 * Created by Administrator on 2017/5/28/028.
 */
"use strict"
//index.js
//获取应用实例
const app = getApp()
const bmap  = require('../../libs/bmap-wx.min.js')
const config =   require('../../config/config')
const BMap = new bmap.BMapWX({
  ak: config.BaiDuMapAK
})

const objAssign = require('../../util/objectAssign')
import mainForm from  '../../components/mainForm/mainForm.js'
import otherForm from  '../../components/otherForm/otherForm.js'
import addressSelect from  '../../components/addressSelect/addressSelect.js'
import login from  '../../components/login/login.js'
import headTitle from  '../../components/headTitle/headTitle.js'
Page({
  data: {
    serveType:'ambulance',
    serveTit:'救护车预约',
    beginAddressDetail:{},
    endAddressDetail:{},
    agreeNoticePage:false
  },
  onLoad:function (opt) {
    if(opt.orderType) {
      this.setData({
        serveType:opt.orderType
      })
    }
    const that = this
    objAssign(that, mainForm,otherForm,addressSelect,login,headTitle)
    that.setData(that.data)
    that.getDate()
    that.initMap()
    console.log('mapHeight',that.data.mapHeight,'clientHeight',that.data.clientHeight)
  },
  onShow:function () {
    const orderType = wx.getStorageSync('orderType')
    if(orderType !== '') this.shiftServe(orderType)
  },
  onHide:function (opt) {
    console.log('hide')
  },
  onShareAppMessage: function () {
    return {
      title: '易医通-医疗转运',
      path: '/pages/order/order',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  onReachBottom:function () {

  },
  // 顶部tab切换
  shiftServe:function (e) {
    let params = {
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
    if(params.serveTit === '救护车预约'){
      params.customerOfferPrice = false
      if(this.checkAddressInput()) params.showPrice = true
    }else{
      params.customerOfferPrice = true
      params.showPrice = false
    }
    this.setData(params)
    wx.removeStorageSync('orderType')
  },
  //保存订单
  saveOrder:function () {
    const that = this

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
      userid:app.globalData.userId,
      uuid:that.generateOrderId(),
      lat1:that.data.beginAddressDetail.latitude,
      lng1:that.data.beginAddressDetail.longitude,
      address1:that.data.beginAddressDetail.address || that.data.beginAddressDetail.title,
      lat2:that.data.endAddressDetail.latitude,
      lng2:that.data.endAddressDetail.longitude,
      address2:that.data.endAddressDetail.address || that.data.endAddressDetail.title,
      province1:that.data.province1,
      province2:that.data.province2,
      city1:that.data.city1,
      city2:that.data.city2,
      district1:that.data.district1,
      district2:that.data.district2
    }

    //订单类型
    switch (that.data.serveType){
      case 'ambulance' : data.otype = 0;break;
      case 'aviation' : data.otype = 6;break;
      case 'highSpeedRail' : data.otype = 7;break;
      case 'helicopter' : data.otype = 8;break;
      default : data.otype = 0;break;
    }

    // 目的地信息
    if(!data.lat2 || !data.lng2 || !data.address2){
      data.lat2 = that.data.endAddressDetail.lat1
      data.lng2 = that.data.endAddressDetail.lng1
      data.address2 = that.data.endAddressDetail.hospitalname ? that.data.endAddressDetail.hospitalname : that.data.endAddressDetail.addr
    }

    //配套服务
    data.servicetype = ''
    if(!that.data.needRespirator && !that.data.needLitter && !that.data.needWheelChair){

    }else{
      let serveArr = [] , servicetype = ''
      app.globalData.orderParams.serviceoptiontypeList.forEach(function (item) {
        if(item.otype === data.otype){
          serveArr.push(item)
        }
      })
      if(that.data.needRespirator){
        serveArr.forEach(function (item) {
          if(item.needRespirator) {
            servicetype += item.serviceoptiontypeid + ','
          }
        })
      }
      if(that.data.needLitter){
        serveArr.forEach(function (item) {
          if(item.needLitter) {
            servicetype += item.serviceoptiontypeid + ','
          }
        })
      }
      if(that.data.needWheelChair){
        serveArr.forEach(function (item) {
          if(item.needWheelChair) {
            servicetype += item.serviceoptiontypeid + ','
          }
        })
      }
      data.servicetype = servicetype.replace(/,$/,'')
    }


    //出行人数
    data.option1 = that.data.personNum[that.data.currentPersonNum]

    //是否需要担架上楼
    data.option2 = that.data.ifShowFloorChange ? 1 : 0
    //担架上楼楼层
    if(that.data.ifShowFloorChange) data.option2num = parseInt(that.data.currentFloor) + 2

    //机场内外（未完成）
    data.option3 = '0'

    //出发时间
    data.departuredate = that.data.date + ' ' + that.data.time + ':00'

    //路程

    data.distance = that.data.distance

    //价格（未完成）
    data.price1 = that.data.totalPrice + that.data.floorPrice


    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      header: {
        'Charset': 'utf-8',
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'POST',
      data: data,
      success:function (res) {
        if(res.data.ret === 1){
          wx.setStorageSync('orderDetail', JSON.stringify(data))
          wx.navigateTo({
            url:'/pages/confirmOrder/confirmOrder'
          })
        }
      },
      fail:function (err) {
        console.log(err)
      }
    })

  },
  //生成订单号
  generateOrderId:function () {
    var userId = app.globalData.userId
    var timestamp = new Date().getTime()
    return userId + timestamp
  },
  //坐标转换城市
  coordinateToCity:function (lat,lng,cb) {
    if(lat && lng){
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
    }else{
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'坐标获取失败'
      })
      return
    }
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
            // console.log('getDistance')
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
        content:'坐标获取出错，下单后将由客服人员为你报价'
      })
      this.setData({
        customerOfferPrice:true
      })
      return
    }

  },
  // 计算价格
  getPrice:function (distance) {
    if(this.data.serveType !== 'ambulance'){ // 只计算救护车的费用
      this.setData({
        customerOfferPrice:true
      })
    }

    if(app.globalData.userId === null){

      return
    }

    distance = parseInt(distance)
    let price = 0
    if(distance > 200){
      price += distance * 15
    }else{
      price += distance * 10
    }

    const that = this,
      begin = that.data.beginAddressDetail,
      end = that.data.endAddressDetail,
      lat1 = begin.latitude,
      lng1 = begin.longitude,
      lat2 = end.lat1 || end.latitude,
      lng2 = end.lng1 || end.longitude

    const cityList = app.globalData.orderParams.cityList2
    const districtList = app.globalData.orderParams.cityList3

    that.coordinateToCity(lat1,lng1,function (data) {
      that.setData({
        province1 : data.province,
        city1 : data.city,
        district1 : data.district
      })
      that.coordinateToCity(lat2,lng2,function (data) {
        that.setData({
          province2 : data.province,
          city2 : data.city,
          district2 : data.district
        })

        // 计算最低价格
        let minPrice
        if(that.data.province1 === '广东省' && that.data.province2 === '广东省'){
          const city1 = that.data.city1,
            city2 = that.data.city2

          let price_01 = 0 , price_02 = 0
          if((city1 === '广州市' || city1 === '佛山市') && (city2 === '广州市' || city2 === '佛山市')){
            districtList.forEach(function (item) {
              if(item.areaname === that.data.district1){
                price_01 = item.price
              }
              if(item.areaname === that.data.district2){
                // console.log(item.areaname)
                price_02 = item.price
              }
            })
            minPrice = Math.max(price_01,price_02)

          }else{
            cityList.forEach(function (item) {
              if(city1 === '广州市') price_01 = 600
              if(city2 === '广州市') price_02 = 600
              if(item.areaname === city1){
                price_01 = item.price
              }
              if(item.areaname === city2){
                price_02 = item.price
              }
            })
            minPrice = Math.max(price_01,price_02)
          }

        }else{

          minPrice = 0
        }
        // console.log(price,minPrice)

        let priceData = {
          totalPrice:Math.max(price,minPrice)
        }

        if(that.data.serveType === 'ambulance') priceData.showPrice = true
        // console.log('getPrice')

        that.setData(priceData)


      })

    })




  },

  //医疗转运同意书
  checkNoticePageAgreement(){
    this.setData({
      agreeNoticePage: !this.data.agreeNoticePage
    })
  },
  //
  showNoticePage(){
    wx.navigateTo({
      url:"/pages/noticePage/noticePage"
    })
  },

  //常见问题
  toFaq(){
    wx.navigateTo({
      url:'/pages/faq/faq'
    })
  },
  //意见反馈
  toFeedBack(){
    wx.navigateTo({
      url:'/pages/feedback/feedback'
    })
  }
})