/**
 * Created by Administrator on 2017/5/30/030.
 */
"use strict"
const app = getApp()
Page({
  data:{
    newsDetail:[],
    detailTitle:''
  },
  onLoad:function (opts) {
    const that = this
    if(!opts || !opts.id || !opts.title){
      wx.showModal({
        title:'提示',
        showCancel:false,
        content:'无法找到该资讯，请在资讯中心页重新查找',
        success:function (res) {
          if(res.confirm){
            wx.navigateTo({
              url:'/pages/newsList/newsList'
            })
          }
        }
      })

    }else{
      app.api.getInformationContent(opts.id)
        .then(function (content) {
          // let imgList = [] , indexArr = []
          // if(content.informationContentList){
          //   content.informationContentList.forEach(function (item,index) {
          //
          //     if(item.type === 1){
          //       imgList.push(that.getImageOpts(item,index,item.content))
          //       indexArr.push(index)
          //     }
          //   })
          //   Promise.all(imgList)
          //     .then(function (res) {
          //       res.forEach(function (item) {
          //         content.informationContentList[item.index] = item
          //       })
          //       return content
          //     })
          //     .then(function (final) {
          //       that.setData({
          //         newsDetail:final,
          //         detailTitle:opts.title
          //       })
          //     })
          // }
          that.setData({
            newsDetail:content,
            detailTitle:opts.title
          })
        })


    }
  },
  getImageOpts:function (opts,index,path) {
    const info = wx.getSystemInfoSync()
    let img = new Image()
    return new Promise(function (resolve,reject) {
      img.src= path
      img.onload = function (img) {
        opts.index = index
        // opts.width = img.path[0].width
        opts.height = img.path[0].height / img.path[0].width * (info.windowWidth-30)
        resolve(opts)
      }
    })
  }
})