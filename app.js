//app.js
const config = require('/config/config')
import api from 'api/api'
App({
  onLaunch: function () {
    const that = this
    that.api = api
    //调用API从本地缓存中获取数据
    const CityList = wx.getStorageSync('CityList')

    if(CityList === ''){
      that.getCityList()
    }else{
      that.globalData.cityList = CityList
    }
    that.checkWxSession()
      .then(function () {
        that.getUserInfo()
      })
      .then(function () {
        that.getParams()
      })

  },
  checkWxSession:function (cb) {
    const that = this
    return new Promise(function (resolve,reject) {
      wx.checkSession({
        success:function (res) {
          // console.log(res)
          // typeof cb == "function" && cb()
          resolve()
        },
        fail:function (err) {
          console.log(err)
          that.wxLogin()
          reject(err)
        }
      })
    })

  },
  getUserInfo:function(cb){
    var that = this
    return new Promise(function (resolve,reject) {
      wx.getUserInfo({
        success:function (res) {
          that.globalData.userInfo = res.userInfo
          // typeof cb == "function" && cb(res.userInfo)
          resolve()
        },
        fail:function () {
          wx.showModal({
            title:'提示',
            content:'用户拒绝授权，无法获取微信信息，请点击右上角->关于易医通->点击右上角->设置->允许获取用户信息授权',
            showCancel:false
          })
          reject()
        }
      })
    })
  },
  wxLogin:function (cb) {
    var that = this
    //调用登录接口
    wx.login({
      success: function (res) {
        that.getUserInfo()
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://www.emtsos.com/emMiniApi.do',
            data: {
              method:'getWXUserinfo',
              code: res.code
            },
            success:function (data) {
              if(data.data.ret === 1){
                typeof cb == "function" && cb(data.data.data.userinfo.openid)
              }
            },
            fail:function (err) {
              console.log(err)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  getCityList:function () {
    const that = this
    wx.request({
      url: 'https://www.emtsos.com/emMiniApi.do',
      data: {
        method:'getCityList'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.ret === 1){
          var CityList = {}
          CityList.NEIDI = res.data.data.cityList
          CityList.GANGAO = res.data.data.cityList4
          CityList.Usual = res.data.data.cityList1
          wx.setStorageSync('CityList', CityList)
          that.globalData.cityList = CityList
        }
      }
    })
  },
  getParams:function (cb) {
    const that = this
    return new Promise(function (resolve,reject) {
      wx.showLoading({
        title:'加载中',
        mask:true
      })
      const Account = wx.getStorageSync('Account')
      let data = {
        method:'getParams',
        account:Account
      }
      if(that.globalData.userInfo !== null){
        data.wx_nickname = that.globalData.userInfo.nickName
        data.wx_headimgurl = that.globalData.userInfo.avatarUrl
        data.wx_sex = that.globalData.userInfo.gender === 1 ? '男' : '女'
      }
      wx.request({
        url: 'https://www.emtsos.com/emMiniApi.do',
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method:'POST',
        success: function(res) {
          if(res.data.ret === 1){
            wx.hideLoading()

            let OrderParams = res.data.data

            // 器官移植 手术预约 陪诊 住院安排 专家预约 未作处理
            OrderParams.serviceoptiontypeList.forEach(function (item) {
              if(item.serviceoptiontypename === '呼吸机'){
                item.needRespirator = true
              }
              if(item.serviceoptiontypename === '担架上机' || item.serviceoptiontypename === '担架上车'){
                item.needLitter = true
              }
              if(item.serviceoptiontypename === '轮椅上机' || item.serviceoptiontypename === '轮椅上车'){
                item.needWheelChair = true
              }
            })
            that.globalData.orderParams = OrderParams
            that.globalData.menuList = OrderParams.menuList
            if(OrderParams.user !== null){
              that.globalData.userId = OrderParams.user.userid
            }
            // typeof cb == "function" && cb()
            resolve()
          }
        },
        fail:function (err) {
          reject(err)
        }
      })
    })

  },
  globalData:{
    userInfo:null,
    userId:null,
    cityList:null,
    orderParams:null,
    menuList:[]
  }
})