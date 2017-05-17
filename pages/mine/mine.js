const app = getApp()
Page({
  data: {
    userInfo:{
      avatarUrl:'https://www.emtsos.com/emt/v-v1-zh_CN-/emt/img/userheader.png',
      nickName:'注册/登录'
    }
  },
  onLoad: function() {
    console.log(app.globalData)
    var that = this;
    if(app.globalData.userInfo.userInfo){
      that.setData({
        userInfo:app.globalData.userInfo.userInfo
      })
    }

  }

})