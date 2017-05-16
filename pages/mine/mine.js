//logs.js
var bmap  = require('../../libs/bmap-wx.min.js')
var AK =  '3pcGRQbqAf19GeF1lFiO7BWeofRpsnQ9'
var wxMarkerData = [];  //定位成功回调对象
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {}
  },
  makertap: function(e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  },
  onLoad: function() {
    var that = this;
    // 新建百度地图对象
    var BMap = new bmap.BMapWX({
      ak: AK
    });
    var fail = function(data) {
      console.log(data)
    };
    var success = function(data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData
      });
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
    }
    // 发起regeocoding检索请求
    BMap.regeocoding({
      fail: fail,
      success: success,
      iconPath: '/images/marker.png',
      iconTapPath: '/images/marker.png'
    });
  },
  showSearchInfo: function(data, i) {
    var that = this;
    that.setData({
      rgcData: {
        address: '地址：' + data[i].address + '\n',
        desc: '描述：' + data[i].desc + '\n',
        business: '商圈：' + data[i].business
      }
    });
  }

})