/**
 * Created by Administrator on 2017/5/29/029.
 */
"use strict"
const app = getApp()
const objAssign = require('../../util/objectAssign')
import headTitle from  '../../components/headTitle/headTitle.js'
Page({
  data:{

  },
  onLoad:function () {
    const that = this
    objAssign(that, headTitle)
  }
})