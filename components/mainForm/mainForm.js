/**
 * Created by Administrator on 2017/5/17/017.
 */
"use strict"
export default {
  data:{
    beginAddress:'',
    endAddress:'',
    date:'2017-01-01',
    time:'00:00'
  },
  //显示，隐藏地图
  showAddressSelect:function (e) {
    var that = this
    if(this.data.beginAddress === ''){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'正在定位，请稍后再次尝试'
      })
      return
    }
    if(e.currentTarget.dataset.type && e.currentTarget.dataset.type==='endLocation'){
      var item = this.data.endAddressDetail
      var data = {
        isShowAddressSelect:true,
        addressType:e.target.dataset.type
      }
      if(this.data.endAddress !== ''){
        data.editAddress = this.data.endAddress
      }else{
        data.editAddress = ''
      }
      if(item.lat1 && item.lng1){
        data.locate = {
          lat:item.lat1,
          lng:item.lng1
        }
        data.markers = [{
          id:'0',
          latitude:item.lat1,
          longitude:item.lng1,
          address:item.hospitalname,
          desc:item.addr,
          iconPath: '/images/marker.png',
          iconTapPath: '/images/marker.png',
          alpha:1
        }]
        this.setData(data)
      }else{
        if(!item.latitude){ // 判断是否已经保存有目的地信息，如果没有则使用起点坐标
          item = this.data.beginAddressDetail
        }
        data.locate = {
          lat:item.latitude,
          lng:item.longitude
        }
        data.markers = [item]
        this.setData(data)
      }
    }else{
      var data = {
        isShowAddressSelect:true,
        markers:[that.data.beginAddressDetail],
        locate:{
          lat:that.data.beginAddressDetail.latitude,
          lng:that.data.beginAddressDetail.longitude
        }
      }
      if(this.data.beginAddress !== '') {
        data.editAddress = this.data.beginAddress
      }else{
        data.editAddress = ''
      }

      this.setData(data)
    }

  },
  //显示医院列表
  showHospitalList:function () {
    this.setData({
      hideHospitalList:false,
      editAddress:''
    })
    var areaId = this.getAreaId()
    this.getHospitalList(areaId)
  },
  //日期控件变换
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //时间控件变换
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  //获取当前时间并格式化
  getDate:function () {
    var date = new Date(),
      Y = date.getFullYear(),
      M = date.getMonth()+1,
      D = date.getDate(),
      h = date.getHours(),
      m = date.getMinutes(),
      _format = function (num) {
        return num > 9 ? num : '0'+num
      }

    this.setData({
      date:Y+'-'+_format(M)+'-'+_format(D),
      time:_format(h)+':'+_format(m)
    })
  }
}