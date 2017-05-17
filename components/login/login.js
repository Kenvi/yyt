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
        code:that.data.messageCode,
        ps:that.data.password,
        openid:'asdadad',
        nickname:app.globalData.userInfo.userInfo.nickName,
        photo:app.globalData.userInfo.userInfo.avatarUrl,
        sex:app.globalData.userInfo.userInfo.gender === 1 ? '男' : '女'
      }
      if(that.data.loginType === 'login'){
        data.method = 'userLogin'
      }else{
        data.method = 'userRegist'
      }
    }

    console.log(data)
  }
}