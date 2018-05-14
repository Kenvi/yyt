const app = getApp()
const objAssign = require('../../util/objectAssign')

import login from  '../../components/login/login.js'

Page({
  data: {
    headImg:'', // 临时储存头像路径，如果在当前页面退出登录再重新登录后返回的参数缺少头像
    userInfo:{
      avatarUrl:'https://www.emtsos.com/emt/v-v1-zh_CN-/emt/img/userheader.png',
      nickName:'注册/登录',
      unAuthority:true
    },
    myInfo:{
      userScore1:0,
      userScore2:0,
      userScore3:0
    },
    menuList:{},
    noAuth:false
  },
  onLoad: function() {
    const that = this
    objAssign(that,login)
    that.setData(that.data)   

  },
  onShow:function () {
    const that = this
    app.getUserInfo()
      .then(function () {
        app.getParams()
          .then(function () {
            if(app.globalData.userId === null){
              that.setData({
                showLoginModal:true
              })

            }else{
              that.setUserInfo()
              that.setMyInfo()
            }

            that.setMenuList()
          })
      }).catch(()=>{
        that.setData({
          noAuth:true
        })
    })
  },
  bindGetUserInfo(e){
    const that = this
    if(e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      app.getParams()
        .then(function () {
          if(app.globalData.userId === null){
            that.setData({
              showLoginModal:true
            })

          }else{
            that.setUserInfo()
            that.setMyInfo()
          }

          that.setMenuList()
        })
    }else{
      this.setData({
        showLoginModal:false
      })
    }

  },
  setUserInfo:function () {
    this.setData({
      userInfo:app.globalData.userInfo,
      headImg:app.globalData.userInfo.avatarUrl
    })
  },
  setMyInfo:function () {
    let info = app.globalData.orderParams.user
    info.avatarUrl = this.data.headImg
    this.setData({
      myInfo:app.globalData.orderParams.user,
      userInfo:info
    })
  },
  setMenuList:function () {
    const that = this
    let menuList = {}
    app.globalData.menuList.forEach(function (item) {
      menuList[item.menuname] = item.menusub
    })
    that.setData({
      menuList:menuList
    })
  },
  toPageOrderList:function () {
    if(app.globalData.userId !== null){
      wx.navigateTo({
        url:'/pages/orderList/orderList'
      })
    }else{
      this.userLogin()
    }

  }

})