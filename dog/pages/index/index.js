//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    todos: [],
    current: '', //用户的当前在输入的todo
    motto: 'Hello World',
    userInfo: {}
  },
  addItem: function(e) {
    // 将用户输入的todo 拿到
    // 存储到野狗
    // 传统的js开发，document.querySelector(input).value  界面和数据模棱两可

    // 用户没输入 正在输入 完成 三种状态
    // current  数据项  数据维护
    // value = {{current}}
    // 现在编程是数据绑定的界面，我们应该尽量减少dom的查找及修改把这件事情交给框架去做（框架小程序, vue, mvvm)
    console.log(this.data.current);
    if(this.data.current !== '') {
      // 应用程序级别的逻辑
      // 当前页面的逻辑
      app.addItem(this.data.current)
      // 添加完了, 将input清空一下
      this.setData({
        current: ''
      }) 
    }
  },
  deleteItem: function (e) {
    // 数据集合的概念 collections
    // 传统意义上你可以想象成数据表 exccel
    // row -> child    column -> field 字段
    // NoSQL 对js友好 面向文档的数据库
    var key = e.target.dataset.key;
    this.ref.child(key).remove();
  },
  bindkeyInput: function(e) {
    this.data.current = e.detail.value
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.ref = app.getTodoRef() 
    this.ref.on('child_added', function(snapshot, prKey) {
      // 像一个事件监听 数据从小程序去到野狗的服务器
      // 异步的过程， 花时间 定义事件
      var key = snapshot.key()
      var text = snapshot.val()
      // todo json 对象 文档数据库存的就是json对象
      var newItem = {key:key, text:text}
      // 新增一条，维护好todos
      this.data.todos.push(newItem)
      // 通知页面更新
      this.setData({
        todos: this.data.todos
      })
    },this);
    this.ref.on('child_removed', function(snapshot) {
      var key = snapshot.key()
      // 如何在数组中删除一个存在的项? 
      // 遍历比对 
      // es6 
      var index = this.data.todos.findIndex(
        function(item, index) {
          if(item.key === key) return true
            return false
      })  
      //  splice 从某个位置 删除多少个
      if (index >=0) {
        this.data.todos.splice(index, 1);
        // 改数据 管界面
        this.setData({
          todos: this.data.todos
        })
      }
    },this)
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})

