const app = getApp()
const objAssign = require('../../util/objectAssign')

import login from  '../../components/login/login.js'

Page({
  data: {
    userInfo:{
      avatarUrl:'https://www.emtsos.com/emt/v-v1-zh_CN-/emt/img/userheader.png',
      nickName:'注册/登录'
    }
  },
  onLoad: function() {
    console.log(app.globalData)
    var that = this
    objAssign(that,login)
    that.setData(that.data)
    if(app.globalData.userInfo !== null){
      that.setData({
        userInfo:app.globalData.userInfo
      })
    }

  }

})