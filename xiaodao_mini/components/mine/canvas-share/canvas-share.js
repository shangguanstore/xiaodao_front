function getImageInfo(url) {
    return new Promise((resolve, reject) => {
        wx.getImageInfo({
            src: url,
            success: resolve,
            fail: reject,
        })
    })
}

function getMiniQrcode(page, scene) {
    let url = 'api/weixin/mini/qrcode/get'
    let data = {
        page,
        scene
    }

    let apiPromise = new Promise((resolve, reject) => {
        request(url, 'post', data, res => {
            resolve(res)
        }, err => {
            reject(err)
        })
    })

    //promise 嵌套
    return apiPromise.then(res => {
        var url = res.data.data
        return getImageInfo(url)
    }, err => {

    })
}

function createRpx2px() {
    const {windowWidth} = wx.getSystemInfoSync()

    return function (rpx) {
        return windowWidth / 750 * rpx
    }
}

const rpx2px = createRpx2px()

function canvasToTempFilePath(option, context) {
    return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
            ...option,
            success: resolve,
            fail: reject,
        }, context)
    })
}

function saveImageToPhotosAlbum(option) {
    return new Promise((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
            ...option,
            success: resolve,
            fail: reject,
        })
    })
}


const request = require('../../../utils/request.js')
import CTB from '../../../utils/canvas-text-break'

const app = getApp()
Component({
    properties: {
        visible: {
            type: Boolean,
            value: false,
            observer(visible) {
                if (visible && !this.beginDraw) {
                    this.draw()
                    this.beginDraw = true
                }
            }
        },
        pageUrl: {
            type: String,
            value: ''
        },
        scene: {
            type: String,
            value: ''
        },
        content: {
            //拼团类型字段：type,title,banner,pstart(开始拼团时间),pend;
            // 活动类型字段： type,title,banner,start,end,
            // 课程： type,title,banner
            type: Object,
            value: ''
        },
    },

    data: {
        beginDraw: false,
        isDraw: false,

        canvasWidth: 843,
        canvasHeight: 1500,

        imageFile: '',

        responsiveScale: 1,
    },

    lifetimes: {
        ready() {
            const designWidth = 375
            const designHeight = 603 // 这是在顶部位置定义，底部无tabbar情况下的设计稿高度

            // 以iphone6为设计稿，计算相应的缩放比例
            const {windowWidth, windowHeight} = wx.getSystemInfoSync()
            const responsiveScale =
                windowHeight / ((windowWidth / designWidth) * designHeight)
            if (responsiveScale < 1) {
                this.setData({
                    responsiveScale,
                })
            }
        },
    },

    methods: {
        handleClose() {
            this.triggerEvent('close')
        },
        handleSave() {
            const {imageFile} = this.data

            if (imageFile) {
                saveImageToPhotosAlbum({
                    filePath: imageFile,
                }).then(() => {
                    wx.showToast({
                        icon: 'none',
                        title: '分享图片已保存至相册',
                        duration: 2000,
                    })
                })
            }
        },
        draw() {
            wx.showLoading()
            const {canvasWidth, canvasHeight} = this.data

            const bannerUrl = this.data.content.banner
            console.log('bannerUrl', bannerUrl)
            const bannerPromise = getImageInfo(bannerUrl)

            // const locationUrl = `http://static.xiaost.net/location1.png`
            // const locationPromise = getImageInfo(locationUrl)
            //
            // const oclockUrl = `http://static.xiaost.net/oclock.png`
            // const oclockPromise = getImageInfo(oclockUrl)

            //const backgroundPromise = getImageInfo('https://img.xiaomeipingou.com/_assets_home-share-bg.jpg')
            const backgroundPromise = getImageInfo('https://img.xiaost.net/shareBg2.png')

            console.log('this.data.scene', this.data.scene)
            const qrcodePromise = getMiniQrcode(this.data.pageUrl, this.data.scene)

            Promise.all([bannerPromise, backgroundPromise, qrcodePromise])
                .then(([banner, background, qrcode]) => {
                    const content = this.data.content

                    const ctx = wx.createCanvasContext('share', this)

                    const canvasW = rpx2px(canvasWidth * 2)
                    const canvasH = rpx2px(canvasHeight * 2)

                    // 绘制背景
                    ctx.drawImage(
                        background.path,
                        0,
                        0,
                        canvasW,
                        canvasH
                    )

                    // 绘制标题
                    // ctx.setFontSize(40)
                    // ctx.setTextAlign('center')
                    // ctx.setFillStyle('#333')
                    // ctx.fillText(
                    //     content.title,
                    //     canvasW / 2,
                    //     rpx2px(150 * 2),
                    // )

                    const titleY = CTB({
                        ctx,
                        text: content.title,
                        x: canvasW / 2,
                        y: rpx2px(150 * 2),
                        w: 550,
                        fontStyle: {
                            lineHeight: 50,
                            textAlign: 'center',
                            textBaseline: 'top',
                            // font: 'normal 23px arial',
                            fontSize: 40,
                            fillStyle: '#333'
                        }
                    })


                    // 绘制banner
                    const radius = rpx2px(90 * 2)
                    const bannerY = titleY + rpx2px(150 * 1)
                    console.log('banner', banner)
                    ctx.drawImage(
                        banner.path,
                        canvasW / 2 - banner.width / 2,
                        bannerY,
                        banner.width,
                        banner.height
                    )


                    if (content.type == app.config.Activity.TYPE_GROUPON) {
                        // 拼团开始时间
                        ctx.setFontSize(30)
                        ctx.setTextAlign('center')
                        ctx.setFillStyle('#444')
                        ctx.fillText(
                            `团购开始时间：${content.pstart}`,
                            canvasW / 2,
                            bannerY + banner.height + radius * 1,
                        )

                        // 拼团结束时间
                        ctx.setFontSize(30)
                        ctx.setTextAlign('center')
                        ctx.setFillStyle('#444')
                        ctx.fillText(
                            `团购结束时间：${content.pend}`,
                            canvasW / 2,
                            bannerY + banner.height + radius * 2,
                        )
                    } else if (content.type == app.config.Activity.TYPE_NORMAL) {
                        // 活动开始时间
                        ctx.setFontSize(30)
                        ctx.setTextAlign('center')
                        ctx.setFillStyle('#444')
                        ctx.fillText(
                            `活动开始时间：${content.start}`,
                            canvasW / 2,
                            bannerY + banner.height + radius * 1,
                        )

                        // 活动结束时间
                        ctx.setFontSize(30)
                        ctx.setTextAlign('center')
                        ctx.setFillStyle('#444')
                        ctx.fillText(
                            `活动结束时间：${content.end}`,
                            canvasW / 2,
                            bannerY + banner.height + radius * 2,
                        )
                    } else if (content.type == app.config.Activity.TYPE_COURSE) {
                        ctx.setFontSize(30)
                        ctx.setTextAlign('center')
                        ctx.setFillStyle('#444')
                        ctx.fillText(
                            `分享一门有趣的课程给你`,
                            canvasW / 2,
                            bannerY + banner.height + radius * 1,
                        )
                    }

                    // 绘制时间图片
                    // const textXStar = rpx2px(45 * 2)
                    // const iconImgWidth = 30
                    // const iconImgHeight = 30
                    // ctx.drawImage(
                    //     oclock.path,
                    //     textXStar,
                    //     bannerY + banner.height + radius * 2 - 30,
                    //     iconImgWidth,
                    //     iconImgHeight
                    // )

                    // 绘制时间
                    // ctx.setFontSize(40)
                    // ctx.setTextAlign('left')
                    // ctx.setFillStyle('#666')
                    // ctx.fillText(
                    //     `2019-06-01 00:00:00`,
                    //     textXStar + 40,
                    //     bannerY + banner.height + radius * 2,
                    // )

                    // 绘制地点图片
                    // ctx.drawImage(
                    //     location.path,
                    //     textXStar,
                    //     bannerY + banner.height + radius * 3 - 30,
                    //     iconImgWidth,
                    //     iconImgHeight
                    // )

                    // 绘制地点
                    // const locationTextXStart = textXStar + 40
                    // const locationTextYStart = bannerY + banner.height + radius * 3
                    // ctx.setFontSize(40)
                    // ctx.setTextAlign('left')
                    // ctx.setFillStyle('#666')
                    // ctx.fillText(
                    //     `校事通河西万达中心`,
                    //     locationTextXStart,
                    //     locationTextYStart,
                    // )


                    // 绘制小程序码
                    const qrcodeYStart = bannerY + banner.height + radius * 3 + 80
                    ctx.drawImage(
                        qrcode.path,
                        canvasW / 2 - qrcode.width / 2,
                        qrcodeYStart,
                        qrcode.width,
                        qrcode.height
                    )

                    //绘制扫码提示
                    const qrcodeDesYStart = qrcodeYStart + qrcode.height + 50
                    ctx.setFontSize(30)
                    ctx.setTextAlign('center')
                    ctx.setFillStyle('#666')
                    ctx.fillText(
                        `长按识别小程序码查看详情`,
                        canvasW / 2,
                        qrcodeDesYStart,
                    )

                    ctx.stroke()

                    ctx.draw(false, () => {
                        canvasToTempFilePath({
                            canvasId: 'share',
                        }, this).then(({tempFilePath}) => this.setData({imageFile: tempFilePath}))
                    })

                    wx.hideLoading()
                    this.setData({isDraw: true})
                })
                .catch(err => {
                    console.log('err', err)
                    this.setData({beginDraw: false})
                    wx.hideLoading()
                })
        }
    }
})