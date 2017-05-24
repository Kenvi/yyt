/**
 * Created by Administrator on 2017/5/17/017.
 */
"use strict"
const app = getApp()

export default {
  data:{
    showLoginModal:false,
    loginType:'login',
    phoneNumber:'',
    messageCode:'',
    countDownSeconds:'getCode',
    password:''
  },
  hideLoginModal:function () {
    this.setData({
      showLoginModal:false
    })
  },
  changeLoginType:function (e) {
    this.setData({
      loginType:e.currentTarget.dataset.type,
      phoneNumber:'',
      messageCode:'',
      password:''
    })
  },
  getMessageCode:function () {
    const that = this
    that.setData({
      countDownSeconds:60
    })
    let inter = setInterval(function () {
      that.setData({
        countDownSeconds:that.data.countDownSeconds-1
      })
      if(that.data.countDownSeconds === 0){
        clearInterval(inter)
        that.setData({
          countDownSeconds:'getCode'
        })
      }
    },1000)

  },
  inputPhoneNumber:function (e) {
    this.setData({
      phoneNumber:e.detail.value
    })
  },
  inputMessageCode:function (e) {
    this.setData({
      messageCode:e.detail.value
    })
  },
  inputPassword:function (e) {
    this.setData({
      password:e.detail.value
    })
  },
  submitData:function () {
    const that = this
    let data = {}
    if(that.data.loginType === 'forget'){
      data = {
        method:'userForgetPass',
        account:that.data.phoneNumber,
        code:that.data.messageCode
      }
    }else{
      data = {
        account:that.data.phoneNumber,
        ps:that.data.password,
        nickname:app.globalData.userInfo.nickName,
        photo:app.globalData.userInfo.avatarUrl,
        sex:app.globalData.userInfo.gender === 1 ? '男' : '女'
      }
      if(that.data.loginType === 'login'){
        data.method = 'userLogin'
      }else{
        data.method = 'userRegist'
        data.code = that.data.messageCode
      }
    }

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
          switch(data.method) {
            case 'userForgetPass' :
              wx.showModal({
                title:'提示',
                showCancel:false,
                content:res.data.msg
              });
              break;
            case 'userRegist' :
              that.hideLoginModal();
              wx.showModal({
                title:'提示',
                showCancel:false,
                content:'注册成功'
              });
              wx.setStorageSync('Account', res.data.data.user.account)
              app.globalData.userId  = res.data.data.user.userid
              break;
            case 'userLogin' :
              that.hideLoginModal();
              wx.setStorageSync('Account', res.data.data.user.account)
              app.globalData.userId  = res.data.data.user.userid
              app.globalData.menuList  = res.data.data.menuList
              if(that.data.menuList) that.setMenuList()
              break;
          }
        }else if(res.data.ret === 0){
          wx.showModal({
            title:'提示',
            showCancel:false,
            content:res.data.msg
          })
        }
      },
      fail:function (err) {
        console.log(err)
      }
    })
  },
  wxLogout:function () {
    const that = this
    app.globalData.userInfo = null
    if(that.data.userInfo){

      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000,
        success:function () {
          wx.removeStorageSync('Account')
          app.globalData.userId = null
          that.setData({
            userInfo:{
              avatarUrl:'https://www.emtsos.com/emt/v-v1-zh_CN-/emt/img/userheader.png',
              nickName:'注册/登录',
              logout:true
            }
          })
        }
      })

    }

  },
  userLogin:function () {
    const that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        showLoginModal:true,
        userInfo:userInfo
      })
    })

  }
}