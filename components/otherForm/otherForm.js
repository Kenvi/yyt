/**
 * Created by Administrator on 2017/5/17/017.
 */
"use strict"
export default {
  data:{
    needRespirator:false,
    needLitter:false,
    needWheelChair:false,
    ifShowFloorChange:false,
    floors:[2,3,4,5,6,7,8,9],
    currentFloor:0,
    currentPersonNum:0,
    personNum:[1,2,3,4,5,6,7,8,9],
    customerOfferPrice:false,
    totalPrice:false
  },

  //呼吸机选择切换
  ambulanceAddRespirator:function (e) {
    this.setData({
      needRespirator: e.detail.value
    })
  },
  //是否需要呼吸机
  addRespirator:function () {
    this.setData({
      needRespirator: !this.data.needRespirator
    })
  },
  //是否需要担架
  addLitter:function () {
    this.setData({
      needLitter: !this.data.needLitter
    })
  },
  //是否需要轮椅
  addWheelChair:function () {
    this.setData({
      needWheelChair: !this.data.needWheelChair
    })
  },
  //担架上楼选择切换
  showFloorChange:function (e) {
    this.setData({
      ifShowFloorChange: e.detail.value
    })
  },
  //选择担架上楼后记录楼层变化
  bindFloorChange:function (e) {
    this.setData({
      currentFloor: e.detail.value
    })
  },
  //出行人数记录变化
  bindPersonNumChange:function (e) {
    this.setData({
      currentPersonNum: e.detail.value
    })
  }
}