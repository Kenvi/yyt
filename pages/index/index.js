//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    markers: [{
      iconPath: "/resources/others.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/images/aim.png',
      position: {
        left: 10,
        top: 540 - 40,
        width: 30,
        height: 30
      },
      clickable: true
    }]
  },
  regionchange : function(e) {
    console.log(e.type)
  },
  markertap : function(e) {
     const that = this
     wx.getLocation({
       success:function (res) {
         wx.openLocation({
           latitude:res.latitude,
           longitude:res.longitude
         })
       }
     })
  },
  controltap : function(e) {
    this.moveToLocation()
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('startlocate')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  }
})