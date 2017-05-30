/**
 * Created by Administrator on 2017/5/30/030.
 */
"use strict"
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