<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    this.detectionEquipment()
  },
  methods: {
    // 检测是否手机访问
    detectionEquipment() {
      if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        this.setFont(750, 750) // 开启移动端适配
      }
    },
    // 移动端rem转化
    setFont(designWidth, maxWidth) {
      let doc = document,
        win = window;
      let docEl = doc.documentElement;
      let tid;
      let rootItem, rootStyle;

      function refreshRem() {
        let width = docEl.getBoundingClientRect().width;
        if(!maxWidth) {
          maxWidth = 540;
        };
        if(width > maxWidth) {
          width = maxWidth;
        }
        //与淘宝做法不同，直接采用简单的rem换算方法1rem=100px
        let rem = width * 100 / designWidth
        //兼容UC开始
        rootStyle = "html{font-size:" + rem + 'px !important}'
        rootItem = document.getElementById('rootsize') || document.createElement("style")
        if(!document.getElementById('rootsize')) {
          document.getElementsByTagName("head")[0].appendChild(rootItem)
          rootItem.id = 'rootsize'
        }
        if(rootItem.styleSheet) {
          rootItem.styleSheet.disabled || (rootItem.styleSheet.cssText = rootStyle)
        } else {
          try {
            rootItem.innerHTML = rootStyle
          } catch(f) {
            rootItem.innerText = rootStyle
          }
        }
        //兼容UC结束
        docEl.style.fontSize = rem + "px"
      }
      refreshRem()

      win.addEventListener("resize", function() {
        clearTimeout(tid); //防止执行两次
        tid = setTimeout(refreshRem, 300);
      }, false)

      win.addEventListener("pageshow", function(e) {
        if(e.persisted) { // 浏览器后退的时候重新计算
          clearTimeout(tid);
          tid = setTimeout(refreshRem, 300)
        }
      }, false)

      if(doc.readyState === "complete") {
        doc.body.style.fontSize = "16px"
      } else {
        doc.addEventListener("DOMContentLoaded", function(e) {
          doc.body.style.fontSize = "16px"
        }, false)
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Microsoft YaHei";
}
body {
  background: #F3F7F8;
}
</style>
