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
    // floors:[2,3,4,5,6,7,8,9],
    floors:['2楼','3楼','4楼','5楼','6楼','7楼','8楼','9楼或以上'],
    currentFloor:0,
    floorPrice:0,
    currentPersonNum:0,
    personNum:[1,2,3,4,5,6,7,8,9],
    customerOfferPrice:false,
    showPrice:false,
    totalPrice:false
  },

  //呼吸机选择切换
  ambulanceAddRespirator:function (e) {
    let data = {
      needRespirator: e.detail.value
    }
    if(this.data.serveType === 'ambulance') {
      let price
      if(e.detail.value){
        price = this.data.totalPrice + 400
      }else{
        price = this.data.totalPrice - 400
      }

      if(price === 0) price = false
      data.totalPrice = price
    }

    this.setData(data)
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
    let data = {
      ifShowFloorChange: e.detail.value
    }
    if(!e.detail.value) {
      data.currentFloor = 0
      data.floorPrice = 0
    }else{
      data.floorPrice = 150
    }
    this.setData(data)
  },
  //选择担架上楼后记录楼层变化
  bindFloorChange:function (e) {
    console.log(e)
    this.setData({
      currentFloor: e.detail.value
    })
    let price = 0
    switch (this.data.floors[this.data.currentFloor]){
      case '2楼' : price+=150;break;
      case '3楼' : price+=200;break;
      case '4楼' : price+=300;break;
      case '5楼' : price+=400;break;
      case '6楼' : price+=500;break;
      case '7楼' : price+=600;break;
      case '8楼' : price+=700;break;
      case '9楼或以上' : price+=800;break;
      default : price+=0;break;
    }
    this.setData({
      floorPrice:price
    })
  },
  //出行人数记录变化
  bindPersonNumChange:function (e) {
    this.setData({
      currentPersonNum: e.detail.value
    })
  }
}