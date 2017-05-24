const app = getApp()
const objAssign = require('../../util/objectAssign')

import login from  '../../components/login/login.js'

Page({
  data: {
    userInfo:{
      avatarUrl:'https://www.emtsos.com/emt/v-v1-zh_CN-/emt/img/userheader.png',
      nickName:'注册/登录',
      unAuthority:true
    }
  },
  onLoad: function() {
    const that = this
    objAssign(that,login)
    that.setData(that.data)
    if(app.globalData.userInfo !== null){
      that.setData({
        userInfo:app.globalData.userInfo
      })
    }
    if(app.globalData.userId === null){
      that.setData({
        showLoginModal:true
      })

    }


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