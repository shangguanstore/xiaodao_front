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


    console.log('windowWidth',windowWidth)

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

        // canvasWidth: 500,
        // canvasHeight: 889,

        designWidth: 750,
        designHeight: 1206,
        canvasDesignWidth: 621,
        canvasDesignHeight: 1000,

        imageFile: '',

        responsiveScale: 1,
    },

    lifetimes: {
        ready() {
            // 以iphone6为设计稿，计算相应的缩放比例
            let {designWidth, designHeight} = this.data
            let {windowWidth, windowHeight} = wx.getSystemInfoSync()
            //let responsiveScale = windowHeight / ((windowWidth / designWidth) * designHeight)
            let responsiveScale = windowWidth / designWidth

            if (responsiveScale < 1) {
                this.setData({
                    responsiveScale,
                })
            }

            console.log('responsiveScale',responsiveScale)
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
            const {canvasDesignWidth, canvasDesignHeight} = this.data

            const bannerUrl = this.data.content.banner
            const bannerPromise = getImageInfo(bannerUrl)

            // const locationUrl = `http://static.xiaost.net/location1.png`
            // const locationPromise = getImageInfo(locationUrl)
            //
            // const oclockUrl = `http://static.xiaost.net/oclock.png`
            // const oclockPromise = getImageInfo(oclockUrl)

            //const backgroundPromise = getImageInfo('https://img.xiaomeipingou.com/_assets_home-share-bg.jpg')
            const backgroundPromise = getImageInfo('https://img.xiaost.net/shareBg2.png')

            const qrcodePromise = getMiniQrcode(this.data.pageUrl, this.data.scene)



            Promise.all([bannerPromise, backgroundPromise, qrcodePromise])
                .then(([banner, background, qrcode]) => {
                    let content = this.data.content

                    let ctx = wx.createCanvasContext('share', this)

                    // let canvasW = rpx2px(canvasDesignWidth * 2)
                    // let canvasH = rpx2px(canvasDesignHeight * 2)

                    let canvasW = this.data.canvasDesignWidth / 2;
                    let canvasH = this.data.canvasDesignHeight / 2;

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
                        y: 20,
                        w: 220,
                        fontStyle: {
                            lineHeight: 20,
                            textAlign: 'center',
                            textBaseline: 'top',
                            font: 'normal 23px arial',
                            fontSize: 18,
                            fillStyle: '#333'
                        }
                    })


                    // 绘制banner
                    const radius = rpx2px(30 * 2)
                    const bannerY = titleY + 40

                    let designBannerW = 542 / 2
                    let designBannerH = 300 / 2
                    let scaleDesign = designBannerW / designBannerH  //设计图的banner宽、高
                    let scaleBannerImg = banner.width / banner.height
                    let bannerW, bannerH
                    if(scaleDesign > scaleBannerImg) {
                        // bannerH = designBannerH;
                        // bannerW = designBannerH * scaleBannerImg;

                        bannerW = designBannerW
                        bannerH = bannerW / scaleBannerImg
                        if(bannerH > designBannerH) bannerH = designBannerH
                    }else{
                        // bannerW = designBannerW;
                        // bannerH = designBannerW / scaleBannerImg;

                        bannerH = designBannerH;
                        bannerW = designBannerH * scaleBannerImg;
                    }
                    console.log('bannerW', bannerW)
                    console.log('bannerH', bannerH)

                    // ctx.save();
                    // ctx.beginPath();
                    // ctx.strokeStyle = "rgba(0,0,0,0)";
                    // ctx.rect(66, 251, 621, 668);
                    // ctx.closePath();
                    // ctx.stroke();
                    //
                    // ctx.clip();
                    // // 画图片
                    // ctx.drawImage(res.path, ml + 66, mt + 251, drawW, drawH);
                    // ctx.restore();

                    ctx.drawImage(
                        banner.path,
                        canvasW / 2 - bannerW / 2,
                        bannerY,
                        bannerW,
                        bannerH
                    )


                    if (content.type == app.config.Activity.TYPE_GROUPON) {
                        // 拼团开始时间
                        ctx.setFontSize(14)
                        ctx.setTextAlign('center')
                        ctx.setFillStyle('#444')
                        ctx.fillText(
                            `团购开始时间：${content.pstart}`,
                            canvasW / 2,
                            bannerY + bannerH + radius * 1,
                        )

                        // 拼团结束时间
                        ctx.setFontSize(14)
                        ctx.setTextAlign('center')
                        ctx.setFillStyle('#444')
                        ctx.fillText(
                            `团购结束时间：${content.pend}`,
                            canvasW / 2,
                            bannerY + bannerH + radius * 2,
                        )
                    } else if (content.type == app.config.Activity.TYPE_NORMAL) {
                        // 活动开始时间
                        ctx.setFontSize(14)
                        ctx.setTextAlign('center')
                        ctx.setFillStyle('#444')
                        ctx.fillText(
                            `活动开始时间：${content.start}`,
                            canvasW / 2,
                            bannerY + bannerH + radius * 1,
                        )

                        // 活动结束时间
                        ctx.setFontSize(14)
                        ctx.setTextAlign('center')
                        ctx.setFillStyle('#444')
                        ctx.fillText(
                            `活动结束时间：${content.end}`,
                            canvasW / 2,
                            bannerY + bannerH + radius * 2,
                        )
                    } else if (content.type == app.config.Activity.TYPE_COURSE) {
                        ctx.setFontSize(14)
                        ctx.setTextAlign('center')
                        ctx.setFillStyle('#444')
                        ctx.fillText(
                            `分享一门有趣的课程给你`,
                            canvasW / 2,
                            bannerY + bannerH + radius * 1,
                        )
                    }


                    // 绘制小程序码
                    let qrcodeYStart = bannerY + bannerH + 90
                    let qrcodeW = qrcode.width / 2
                    let qrcodeH = qrcode.height / 2
                    ctx.drawImage(
                        qrcode.path,
                        canvasW / 2 - qrcodeW / 2,
                        qrcodeYStart,
                        qrcodeW,
                        qrcodeH
                    )

                    //绘制扫码提示
                    const qrcodeDesYStart = qrcodeYStart + qrcodeH + 10
                    ctx.setFontSize(14)
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