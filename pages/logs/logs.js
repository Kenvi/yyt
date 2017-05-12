//logs.js
var bmap  = require('../../utils/bmap-wx.min.js')
var AK =  '3pcGRQbqAf19GeF1lFiO7BWeofRpsnQ9'
var wxMarkerData = [];  //定位成功回调对象
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    placeData: {}
  },
  makertap: function(e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
    that.changeMarkerColor(wxMarkerData, id);
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
    // 发起POI检索请求
    BMap.search({
      "query": '酒店',
      fail: fail,
      success: success,
      // 此处需要在相应路径放置图片文件
      iconPath: '/images/marker.png',
      // 此处需要在相应路径放置图片文件
      iconTapPath: '/images/marker.png'
    });
  },
  showSearchInfo: function(data, i) {
    var that = this;
    that.setData({
      placeData: {
        title: '名称：' + data[i].title + '\n',
        address: '地址：' + data[i].address + '\n',
        telephone: '电话：' + data[i].telephone
      }
    });
  },
  changeMarkerColor: function(data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        // 此处需要在相应路径放置图片文件
        data[j].iconPath = "/images/marker.png";
      } else {
        // 此处需要在相应路径放置图片文件
        data[j].iconPath = "/images/marker.png";
      }
      markers[j](data[j]);
    }
    that.setData({
      markers: markers
    });
  }
})