// pages/calendar/calendar.js

const util = require('../../utils/util.js')

const getDateStr = util.getDateStr
const strToDate = util.strToDate
const getTimeStr = util.getTimeStr

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekIndex: ['日', '一', '二', '三', '四', '五', '六'],
    weekDays: [],
    weekDaysStr: [],
    currentWeekIndex: 1,
    currentDay: getDateStr(new Date()),
    today: getDateStr(new Date()),
    currentIndex: 0,
    images: ['https://mmbiz.qpic.cn/mmbiz_png/STgL38QeY7WjQialoAIias1OlgbVyEmAlVX1I4RhichF8Z0CBC3Jb8thWxbMPhMa7icaSIdHQE7ib3bdVmTKXsM0BQw/0?wx_fmt=png'],
    currentImage: 0,
    pageCenterHeight: 500,
    isShowAction: false,
    actions: [{name: '回到今天', color: '#07c160'},{name: '跳转到指定日期'}],
    isShowCalendar: false,
    minDate: new Date(2020, 0, 1).getTime(),
    maxDate: new Date(2021, 11, 31).getTime(),
    defaultDate: new Date().getTime()
  },

  generateWeekDays: function (currentDay) {
    console.log(currentDay)
    var weekIndex = currentDay.getDay()
    console.log(weekIndex)
    var weekDays = [new Date(currentDay), new Date(currentDay), new Date(currentDay), new Date(currentDay), new Date(currentDay), new Date(currentDay), new Date(currentDay)]
    for (var i = 0; i < 7; i++) {
      weekDays[i].setDate(currentDay.getDate() + (i - weekIndex))
    }
    return weekDays;
  },

  getYearWeek: function(dt){
    let d1 = new Date(dt);
    let d2 = new Date(dt);
    d2.setMonth(0);
    d2.setDate(1);
    let rq = d1 - d2;
    let days = Math.ceil(rq / (24 * 60 * 60 * 1000));
    let num = Math.ceil(days / 7);
    return num;
  },

  getYearMonthDayStr: function (weekdays) {
    var weekDayStr = []
    for (var i = 0; i < weekdays.length; i++) {
      weekDayStr.push(getDateStr(weekdays[i]))
    }
    return weekDayStr
  },

  getWeekDayStr: function(weekdays) {
    var weekDayStr = []
    for (var i = 0; i < weekdays.length; i++) {
      weekDayStr.push(''+weekdays[i].getDate())
    }
    return weekDayStr
  },

  setNavBarTitle: function(date) {
    wx.setNavigationBarTitle({
      title: date.toDateString().substr(4),
    })
  },

  setCurrentDay: function(currentDay) {
    // console.log(currentDay.getTime())
    var weekDays = []
    var weekDaysStr = []
    var currentWeekIndex = 1
    //生成上周的日期
    var beforeWeekDay = new Date(new Date(currentDay).setDate(currentDay.getDate()-7))
    console.log(currentDay)
    console.log(beforeWeekDay)
    var beforeWeek = this.generateWeekDays(beforeWeekDay)
    weekDays.push(this.getYearMonthDayStr(beforeWeek))
    weekDaysStr.push(this.getWeekDayStr(beforeWeek))

    //生成本周的日期
    var currentWeek = this.generateWeekDays(currentDay)
    weekDays.push(this.getYearMonthDayStr(currentWeek))
    weekDaysStr.push(this.getWeekDayStr(currentWeek))
    currentWeekIndex = 1

    //生成下周的日期
    var afterWeekDay = new Date(new Date(currentDay).setDate(currentDay.getDate()+7))
    console.log(afterWeekDay)
    var afterWeek = this.generateWeekDays(afterWeekDay)
    weekDays.push(this.getYearMonthDayStr(afterWeek))
    weekDaysStr.push(this.getWeekDayStr(afterWeek))

    //设置图片
    var images = this.getImageUrls(currentDay)

    // 设置数据
    this.setData({
      weekDays: weekDays,
      weekDaysStr: weekDaysStr,
      currentDay: getDateStr(currentDay),
      currentIndex: currentDay.getDay(),
      currentWeekIndex: currentWeekIndex,
      images: images,
      currentImage: 1
    }, ()=>{
      this.setNavBarTitle(currentDay)
    })
  },

  /**
   * 通过点击切换日期
   */
  setCurrentIndex: function(newIndex) {
    var currentDayStr = this.data.weekDays[this.data.currentWeekIndex][newIndex]
    var currentDay = strToDate(currentDayStr)
    //设置图片
    var images = this.getImageUrls(currentDay)

    // console.log('sss')
    this.setData({
      currentDay: currentDayStr,
      currentIndex: newIndex,
      images: images,
      currentImage: 1
    }, () => {
      this.setNavBarTitle(currentDay)
    })
  },

  getImageUrls: function (currentDay) {
    var beforeDay = new Date(new Date(currentDay).setDate(currentDay.getDate() - 1))
    var afterDay = new Date(new Date(currentDay).setDate(currentDay.getDate() + 1))
    var images = []
    images.push(this.getImageUrl(beforeDay))
    images.push(this.getImageUrl(currentDay))
    images.push(this.getImageUrl(afterDay))
    return images
  },

  getImageUrl: function (date) {
    if (date.getFullYear() < 2020) { //|| date.getFullYear() > 2020
      return "http://image.onlyfew.cn/shengcairili/only2020.png"
    }
    var dateStr = getDateStr(date)
    var todayStr = getDateStr(new Date())
    if (dateStr == todayStr) {
      //8:30前
      if (getTimeStr(new Date()) < "08:30:00") {
        //宜等待
        return "http://image.onlyfew.cn/shengcairili/waitingtoday.png"
      }
    }
    else if(dateStr > todayStr) {
      //宜期待
      return "http://image.onlyfew.cn/shengcairili/tomorrow.png"
    }
    return "http://image.onlyfew.cn/shengcairili/" + dateStr + ".png"
  },

  /**
   * 设置中间区域的高度
   */
  setPageCenterHeight: function () {
    var res = wx.getSystemInfoSync()
    let windowHeight = (res.windowHeight * (750 / res.windowWidth))
    this.setData({
      pageCenterHeight:windowHeight-220
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setPageCenterHeight()
    if(options.day) {
      this.setCurrentDay(strToDate(options.day))
    }
    else {
      this.setCurrentDay(new Date())
      // this.setCurrentDay(strToDate('2020-03-04'))
    }
  },

  /**
   * 周次头部的滑动切换事件
   */
  weekChange(e) {
    console.log(e)
    if (e.detail.source != "touch") {
      return
    }
    var newWeekIndex = e.detail.current
    var currentDay = strToDate(this.data.currentDay)
    currentDay.setDate(currentDay.getDate() + (newWeekIndex-this.data.currentWeekIndex)*7)
    this.setCurrentDay(currentDay)
  },

  dayChange(e) {
    console.log(e)
    var newIndex = e.currentTarget.dataset.dayindex
    if (newIndex != this.data.currentIndex) {
      this.setCurrentIndex(newIndex)
    }
  },

  imageChange(e) {
    console.log(e)
    if (e.detail.source != "touch") {
      return
    }

    var stepIndex = (e.detail.current == 0 ? (-1) : 1)
    var oldCurrentDay = strToDate(this.data.currentDay)
    var newCurrentDay = new Date(new Date(oldCurrentDay).setDate(oldCurrentDay.getDate() + stepIndex))
    var newIndex = this.data.currentIndex + stepIndex
    if(newIndex<0 || newIndex>6) {
      //跨周
      this.setCurrentDay(newCurrentDay)
    }
    else {
      //不跨周
      this.setCurrentIndex(newIndex)
    }
  },

  handleSaveImage(e) {
    //必须https的
    wx.getImageInfo({
      src: this.getImageUrl(strToDate(this.data.currentDay)),
      success(res) {
        console.log(res)
      }
    })
  },

  handleToday(e) {
    this.setData({ isShowAction: true });
    // this.setCurrentDay(new Date())
  },

  handleImagePreview(e) {
    wx.previewImage({
      urls: [this.getImageUrl(strToDate(this.data.currentDay))]
    })
  },

  handleBuy(e) {
    wx.navigateTo({ url: '/pages/buy/buy'})
  },

  handleComment(e) {
    // var currentDay = strToDate(this.data.currentDay)
    var currentDay = this.data.currentDay
    const db = wx.cloud.database()
    db.collection('gongdu_topic').where({
      date_str: currentDay
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        var topics = res.data
        console.log(topics)
        if (topics.length > 0) {
          wx.navigateToMiniProgram({
            appId: 'wx4f706964b979122a',
            path: 'pages/topicdetail/topicdetail?topic_id='+topics[0].topic_id
          })
        }
        else {
          var nickName = wx.getStorageSync('nickName')
          console.log(nickName)
          if (nickName.indexOf("支离书") != -1 || nickName.indexOf("黄小鱼") != -1) {
            wx.navigateTo({
              url: '/pages/topic/topic?dateStr='+currentDay,
              // url: '/pages/topic/topic',
              success(res) {
                console.log(res)
              },
              fail(res) {
                console.log(res)
              }
            })
          }
          else {
            wx.showToast({
              title: '无法跳转到星球作业页面，请稍候再试',
              icon: 'none',
              duration: 2000
            })  
          }        
        }
      }
    })

  },

  handleAbout(e) {
    wx.navigateTo({ url: '/pages/about/about' })
    /*
    wx.showLoading({
      title: '加载中',
    })
    var imgSrc = ['https://mmbiz.qpic.cn/mmbiz_png/STgL38QeY7WjQialoAIias1OlgbVyEmAlVlLccSH7h12Sibhicuk4yiaIgm8GzIoqIhDSznJuz1sELLDqWoO6JmGLwg/0?wx_fmt=png', 'https://mmbiz.qpic.cn/mmbiz_png/STgL38QeY7WjQialoAIias1OlgbVyEmAlVOq0Jsh1dZvhzwcqhG8ae5v1h5ewOicOUyBLHg4w7zFLJ77XlvU9Rib7Q/0?wx_fmt=png','https://mmbiz.qpic.cn/mmbiz_png/STgL38QeY7WjQialoAIias1OlgbVyEmAlV98TjvyDtia6eQkNEw1q7mdRx5H4A5WnCky9xzf20c8yt0GdZ0JcbjHg/0?wx_fmt=png']
    var imgPreviewSrc = []

    wx.getImageInfo({
      src: imgSrc[0],
      success(res0) {
        imgPreviewSrc.push(res0.path)
        wx.getImageInfo({
          src: imgSrc[1],
          success(res1) {
            imgPreviewSrc.push(res1.path)
            wx.getImageInfo({
              src: imgSrc[2],
              success(res2) {
                wx.hideLoading()
                imgPreviewSrc.push(res2.path)
                wx.previewImage({
                  urls: imgPreviewSrc
                })
              }
            })
          }
        })
      }
    })
    */
  },

  onCloseAction() {
    this.setData({ isShowAction: false });
  },

  onSelectAction(event) {
    console.log(event.detail);
    if (event.detail.name == '回到今天') {
      this.setCurrentDay(new Date())
    }
    else {
      this.setData({ isShowCalendar: true });
    }
  },

  onCloseCalendar() {
    this.setData({ isShowCalendar: false });
  },

  onConfirmCalendar(event) {
    console.log(event)
    this.onCloseCalendar()
    this.setCurrentDay(event.detail)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    const slogans = ['你的每个日子，都很值钱', '让有日历的先富起来', '每天钱进一点点', '翻一翻，是钱的声音', '送你一个致富锦囊']
    return {
      title: slogans[Math.floor(Math.random() * 10)%5],
      path: 'pages/calendar/calendar?day='+this.data.currentDay
    }
  }
})