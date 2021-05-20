//获取应用实例
var app = getApp()
Page({
  data: {
    imageObject: {},
    inputValue:'',
    date_str:''
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //事件处理函数
  onLoad: function (option) {
    console.log('onLoad')
    console.log(option)
    var that = this;
    this.setData({
      date_str: option.dateStr,
      inputValue: ''
    })
  },
  didPressChooesImage: function() {
    var that = this;
    const db = wx.cloud.database()
    db.collection('gongdu_topic').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        date_str: that.data.date_str,
        topic_id: that.data.inputValue
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        wx.showToast({
          title: '保存成功',
          duration: 2000,
          success(res) {
            wx.navigateBack()
          }
        }) 
      }
    })
  },
    didCancelTask: function() {
      this.data.cancelTask()
    }
});