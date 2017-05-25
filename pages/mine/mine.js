const app = getApp()
const objAssign = require('../../util/objectAssign')

import login from  '../../components/login/login.js'

Page({
  data: {
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
    menuList:{}
  },
  onLoad: function() {
    const that = this
    objAssign(that,login)
    that.setData(that.data)

    if(app.globalData.userId === null){
      that.setData({
        showLoginModal:true
      })

    }else{
      that.setUserInfo()
      that.setMyInfo()
    }

    that.setMenuList()
  },
  setUserInfo:function () {
    this.setData({
      userInfo:app.globalData.userInfo
    })
  },
  setMyInfo:function () {
    this.setData({
      myInfo:app.globalData.orderParams.user
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