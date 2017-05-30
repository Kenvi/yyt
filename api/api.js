/**
 * Created by Administrator on 2017/5/30/030.
 */
"use strict"
export default {

  getInformationList:function () {
    return new Promise(function (resolve,reject) {
      wx.request({
        url: 'https://www.emtsos.com/emMiniApi.do',
        data: {
          method:'getInformationList',
        },
        success:function (res) {
          if(res.data.ret === 1){
            resolve(res.data.data.informationList)
          }
        },
        fail:function (err) {
          console.log(err)
          reject(err)
        }
      })
    })
  },
  getInformationContent:function (informationid) {
    return new Promise(function (resolve,reject) {
      wx.request({
        url: 'https://www.emtsos.com/emMiniApi.do',
        data: {
          method:'getInformationContent',
          informationid:informationid
        },
        success:function (res) {
          if(res.data.ret === 1){
            resolve(res.data.data)
          }
        },
        fail:function (err) {
          console.log(err)
          reject(err)
        }
      })
    })
  }
}