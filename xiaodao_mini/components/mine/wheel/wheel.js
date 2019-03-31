// components/mine/wheel/wheel.js
const lib = require('../../../utils/lib/index.js')
const common = require('../../../utils/common.js')
const request = require('../../../utils/request.js')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lottery: {
      type: Array
    },
    activityId: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    circleList: [], //圆点数组
    awardList: [], //奖品数组
    colorCircleFirst: '#FFDF2F', //圆点颜色1
    colorCircleSecond: '#FE4D32', //圆点颜色2
    colorAwardDefault: '#fec901', //奖品默认颜色
    colorAwardSelect: 'rgba(21,30,38,0.35)', //奖品选中颜色

    indexSelect: 0, //被选中的奖品index
    isRunning: false, //是否正在抽奖
    imageAward: [
      '../../images/physical.png',
      '../../images/2.jpg',
      '../../images/coupon.png',
      '../../images/4.jpg',
      '../../images/5.jpg',
      '../../images/6.jpg',
      '../../images/7.jpg',
      '../../images/8.jpg',
    ], //奖品图片数组
    intime: 20, //值越大旋转时间越长
  },

  ready: function () {
    console.log('id',this.data.activityId)
    var _this = this;
    //圆点设置
    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    for (var i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 15;
        leftCircle = 15;
      } else if (i < 6) {
        topCircle = 7.5;
        leftCircle = leftCircle + 102.5;
      } else if (i == 6) {
        topCircle = 15
        leftCircle = 620;
      } else if (i < 12) {
        topCircle = topCircle + 94;
        leftCircle = 620;
      } else if (i == 12) {
        topCircle = 565;
        leftCircle = 620;
      } else if (i < 18) {
        topCircle = 570;
        leftCircle = leftCircle - 102.5;
      } else if (i == 18) {
        topCircle = 565;
        leftCircle = 15;
      } else if (i < 24) {
        topCircle = topCircle - 94;
        leftCircle = 7.5;
      } else {
        return
      }
      circleList.push({
        topCircle: topCircle,
        leftCircle: leftCircle
      });
    }

    this.setData({
      circleList: circleList
    })
    //圆点闪烁
    setInterval(function () {
      if (_this.data.colorCircleFirst == '#FFDF2F') {
        _this.setData({
          colorCircleFirst: '#FE4D32',
          colorCircleSecond: '#FFDF2F',
        })
      } else {
        _this.setData({
          colorCircleFirst: '#FFDF2F',
          colorCircleSecond: '#FE4D32',
        })
      }
    }, 500)
    //奖品item设置
    var awardList = [];
    //间距,怎么顺眼怎么设置吧.
    var topAward = 25;
    var leftAward = 25;
    for (var j = 0; j < 8; j++) {
      if (j == 0) {
        topAward = 25;
        leftAward = 25;
      } else if (j < 3) {
        topAward = topAward;
        //166.6666是宽.15是间距.下同
        leftAward = leftAward + 166.6666 + 15;
      } else if (j < 5) {
        leftAward = leftAward;
        //150是高,15是间距,下同
        topAward = topAward + 150 + 15;
      } else if (j < 7) {
        leftAward = leftAward - 166.6666 - 15;
        topAward = topAward;
      } else if (j < 8) {
        leftAward = leftAward;
        topAward = topAward - 150 - 15;
      }
      awardList.push({
        topAward: topAward,
        leftAward: leftAward
      });
    }

    console.log('awardList', awardList)

    let lottery = this.initLottery()

    awardList.map(function (item, index) {
      Object.assign(item, lottery[index]);
    })

    console.log('awardList', awardList)

    this.setData({
      awardList: awardList
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initLottery() {
      console.log('lottery', this.data.lottery)
      let lottery = this.data.lottery
      let newDisplay
      if (lottery.length < 8) {
        newDisplay = []
        let len = lottery.length
        for (var i = 0; i < 8; i++) {
          var index = i % len
          newDisplay.push(lottery[index])
        }
      }

      return newDisplay
    },
    startGame1: function () {
      this.setData({
        isRunning: true
      })
      let _this = this
      let indexSelect = 1
      console.log(indexSelect);

      var i = 0;
      var timer = setInterval(function () {
        indexSelect++;
        console.log('indexSelect', indexSelect)
        console.log(indexSelect % 8)
        //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
        i += 1;
        //用匀加速运动公式，计算转盘转动距离 s=V0*t + 1/2at^2
        var s = 200 * i - 20 * i ^ 2
        console.log('s', s)
        if (s > 10000) {
          //去除循环
          clearInterval(timer)
          //获奖提示

          wx.showModal({
            title: '恭喜您',
            content: '获得了第' + indexSelect + "个优惠券",
            showCancel: false, //去掉取消按钮
            success: function (res) {
              if (res.confirm) {
                _this.setData({
                  isRunning: false
                })
              }
            }
          })
        }
        indexSelect = indexSelect % 8;
        _this.setData({
          indexSelect: indexSelect
        })
      }, (_this.data.times))
    },

    startGame: function () {
      this.setData({
        isRunning: true
      })
      let _this = this

      let index = 0
      let interval = setInterval(function(item) {
        if (index > 7) {
          index = 0;
        }
        _this.setData({
          indexSelect: index,
        })
        index++
      },500)
      

      let url = 'api/activity/lottery/draw'
      let data = {
        activity_id: this.data.activityId
      }
      request(url, 'post', data, function (res) {
        //res就是我们请求接口返回的数据
        let lottery = res.data.data

        clearInterval(interval)

        let which = 0
        for(var i = 0, len = _this.data.awardList.length; i < len; i++) {
          if (_this.data.awardList[i].lottery_id == lottery.lottery_id) {
            which = i
            console.log('1111')
            break
          }
        }
        console.log('which', which)

        _this.stopLuck(which, index, _this.data.intime, 2);
      }, function (res) {
        console.log('res',res)
        wx.showToast({
          title: '加载数据失败',
          icon: 'none'
        })
      })
    },

    /**
     * which:中奖位置
     * index:当前位置
     * time：时间标记
     * splittime：每次增加的时间 值越大减速越快
     */
    stopLuck: function (which, index, time, splittime) {
      var _this = this;
      //值越大出现中奖结果后减速时间越长
      setTimeout(function () {
        //重置前一个位置
        if (index > 7) {
          index = 0;
        }
        _this.setData({
          indexSelect: index,
        })

        //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
        //直到旋转至中奖位置
        if (time < 200 || index != which) {
          //越来越慢
          splittime++;
          time += splittime;
          //当前位置+1
          index++;
          _this.stopLuck(which, index, time, splittime);
        } else {
          //1秒后显示弹窗
          setTimeout(function () {
            if (index == which) {
              //中奖
              wx.showModal({
                title: '提示',
                content: '恭喜中奖:' + _this.data.awardList[index].name,
                showCancel: false,
                success: function (res) {
                  
                }
              })
            } else {
              //未中奖
              wx.showModal({
                title: '提示',
                content: '很遗憾未中奖',
                showCancel: false,
                success: function (res) {
                  
                }
              })
            }
          }, 300);
        }
      }, time);
      // console.log(time);
    }
  }
})