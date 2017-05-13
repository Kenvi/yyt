//logs.js
var bmap  = require('../../utils/bmap-wx.min.js')
var AK =  '3pcGRQbqAf19GeF1lFiO7BWeofRpsnQ9'
var wxMarkerData = [];  //定位成功回调对象
Page({
  data: {
    sugData: ''
  },
  bindKeyInput: function(e) {
    var that = this;
    // 新建百度地图对象
    var BMap = new bmap.BMapWX({
      ak: AK
    });
    var fail = function(data) {
      console.log(data)
    };
    var success = function(data) {
      var sugData = '';
      for(var i = 0; i < data.result.length; i++) {
        sugData = sugData + data.result[i].name + '\n';
      }
      console.log(sugData)
      that.setData({
        sugData: sugData
      });
    }
    // 发起suggestion检索请求
    setTimeout(function () {
      BMap.suggestion({
        query: e.detail.value,
        region: '广州',
        city_limit: true,
        fail: fail,
        success: function (data) {
          console.log(1111)
        }
      });
    },100)
  }
})