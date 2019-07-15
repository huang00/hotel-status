/*
 * @Author: huangchao 
 * @Date: 2018-12-12 09:31:54 
 * @Last Modified by: huangchao
 * @Last Modified time: 2018-12-12 09:44:23
 * @describe  拖动选择，多选单选
 */

export default {
    methods: {
        selectNodes (clientY, clientX) {
            /* 拖拽时筛选过滤数据，过滤出最终显示在视图上的数据 */
            let hotelRoomList = this.hotelRoomList
            let temporaryClinteX = 0
            let temporaryClinteY = 0
            if (hotelRoomList.length > 0) {
                for (let i = 0, len = hotelRoomList.length; i < len; i++) {
                    let realPriceList = hotelRoomList[i].realPriceList
                    for (let j = realPriceList.length; j--;) {
                        let item = realPriceList[j]
                        let nowSelectIndex = this.nowSelectItems.indexOf(item)
                        let realSelectIndex = this.realSelectItems.indexOf(item)
                        temporaryClinteX = item.clientX
                        temporaryClinteY = item.clientY
                        if ((temporaryClinteX >= this.selectStartCoorX && temporaryClinteX <= clientX ||
                            temporaryClinteX <= this.selectStartCoorX && temporaryClinteX >= clientX) &&
                            (temporaryClinteY >= this.selectStartCoorY && temporaryClinteY <= clientY ||
                            temporaryClinteY <= this.selectStartCoorY && temporaryClinteY >= clientY)) {
                                if (nowSelectIndex < 0 && !item.checked)
                                    this.nowSelectItems.push(item)
                                realSelectIndex >= 0
                                    ? (item.checked = false): (item.checked = true)
                            }
                        else {
                            realSelectIndex >= 0 && (item.checked = true)
                            if (nowSelectIndex >= 0) {
                                item.checked = false
                                this.nowSelectItems.splice(nowSelectIndex, 1)
                            }
                        }
                    }
                }
            }
        }
    }
}
