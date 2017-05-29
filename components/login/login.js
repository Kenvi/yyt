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

    if(!that.checkPhoneNumber(that.data.phoneNumber)){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'请输入正确的手机号'
      })
      return
    }

    let data = {
      method:'sendCode',
      mobile:that.data.phoneNumber
    }

    switch (that.data.loginType){
      case 'regist' : data.stype = 1 ; break;
      case 'forget' : data.stype = 2 ; break;
    }

    wx.request({
      url: 'https://www.emtsos.com/emApp.do',
      header: {
        'Charset': 'utf-8',
        'content-type': 'application/x-www-form-urlencoded'
      },
      method:'POST',
      data: data,
      success:function (res) {
        console.log(res)
        if(res.data.ret === 1){
          wx.showToast({
            title: '验证码发送成功',
            icon: 'success',
            duration: 2000
          })
          that.countDownFunc()
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
  countDownFunc:function () {
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
  submitData:function (cb) {
    const that = this

    if(!that.checkPhoneNumber(that.data.phoneNumber)){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'请输入正确的手机号'
      })
      return
    }

    if(that.data.password === ''){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'请输入密码'
      })
      return
    }

    wx.showLoading({
      title:'Loading',
      mask:true
    })
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
        ps:that.data.password
      }
      if(app.globalData.userInfo !== null){
        data.nickname = app.globalData.userInfo.nickName
        data.photo = app.globalData.userInfo.avatarUrl
        data.sex = app.globalData.userInfo.gender
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
          wx.hideLoading()
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
              if(that.data.userInfo) that.setData({userInfo:res.data.data.user})
              app.getParams()
                .then(function () {
                  if(that.data.menuList) that.setMenuList()
                  if(that.data.myInfo) that.setMyInfo()
                })
              break;
            case 'userLogin' :
              that.hideLoginModal();
              wx.setStorageSync('Account', res.data.data.user.account)
              if(that.data.userInfo) that.setData({userInfo:res.data.data.user})
              app.getParams()
                .then(function () {
                  if(that.data.menuList) that.setMenuList()
                  if(that.data.myInfo) that.setMyInfo()
                })

              break;
          }
        }else if(res.data.ret === 0){
          wx.hideLoading()
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
    wx.showModal({
      title:'提示',
      content:'确认退出登陆吗',

      success:function (res) {
        if(res.confirm){
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
                    nickName:'注册/登录'
                  },
                  myInfo:{
                    userScore1:0,
                    userScore2:0,
                    userScore3:0
                  },
                  menuList:{}
                })
              }
            })

          }
        }
      }
    })


  },
  userLogin:function () {
    const that = this
    if(that.data.userInfo.gender){
      return
    }
    that.setData({
      showLoginModal:true
    })

  },
  checkPhoneNumber:function (phone) {
    return /^1[34578][0-9]{9}$/.test(phone)
  }
}