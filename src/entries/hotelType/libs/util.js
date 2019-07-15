import { all } from "when";

/*
 * @Author: huangchao 
 * @Date: 2019-01-09 10:28:25 
 * @Last Modified by: huangchao
 * @Last Modified by: huangchao
 * @Last Modified time: 2019-01-23 13:35:15

/**
 * 根据房型 创建 所有 包含房型以及房间名的数组
 * @param that
 * @returns {Array}
 */
export function creatRoomTypeAndRoomNumberName(that) {
    let checkRoomNameList = [];
    for (let c = 0, len = that.roomTypeAndRoomNumnerList.length; c < len; c++) {
        let roomTypeName = that.roomTypeAndRoomNumnerList[c].roomTypeName,
            roomTypeId = that.roomTypeAndRoomNumnerList[c].roomTypeId;
        let obj = {
            value: roomTypeId,
            label: roomTypeName
        };
        checkRoomNameList.push(obj);
    }
    return checkRoomNameList;
}

export function dateTrsition(str) {
    /* 
        减去了一个月，返回毫秒数
    */
    let date = new Date(str),
        year = date.getFullYear(),
        month = date.getMonth() - 1,
        day = date.getDate();
    return +new Date(year, month, day);
}

export function dateCalculation(startDate, date, type) {
    return type === '+' ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + date)) :
        new Date(new Date(startDate).setDate(new Date(startDate).getDate() - date))
}

/**
 * @param {array} 需要生成的数据
 * @param {array} 已经选中的数据
 * @returns {array} 树形数据
 * @description 创建树形数据
 */
export const creatTreeData = (list, selectedList) => {
    let res = []
    let ids = selectedList.map(item => item.id)
    /* 首先创建一级目录 */
    for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i]
        let index = ids.indexOf(item.id)
        if (item.level === 1)
            res.push({
                ...item,
                children: [],
                indeterminate:  index >= 0 ?
                    selectedList.filter(subItem => subItem.id === item.id)[0].indeterminate
                    : false,
                checkAll: false,
                checkAllGroup: []
            })
    }

    for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i]
        let index = ids.indexOf(item.id)
        if (item.level === 2) {
            /* 创建子目录 */
            for (let k = 0, lenk = res.length; k < lenk; k++) {
                let subItem = res[k]
                
                if (item.parentId === subItem.id) {
                    subItem.children.push({
                        ...item,
                        indeterminate: index >= 0 ?
                            selectedList.filter(subItem => subItem.id === item.id)[0].indeterminate
                            : false
                    })
                }
                if (index >= 0 && item.parentId === subItem.id)
                    subItem.checkAllGroup.push(ids[index])

                let subItemLen = subItem.children.length
                let checkAllGroupLen = subItem.checkAllGroup.length
                
                subItem.checkAll = !subItemLen && ids.indexOf(subItem.id) >= 0
                if (subItemLen === checkAllGroupLen && checkAllGroupLen > 0) {
                    subItem.checkAll = true
                    subItem.indeterminate = false
                } else if (subItemLen !== checkAllGroupLen && checkAllGroupLen > 0)
                    subItem.indeterminate = true
            }
        }
    }
    return res
}

/**
 * @param {array} 老数据
 * @param {array} 新数据
 * @returns {object} 对象
 * @description 计算增减量
 */
 export const computedOffset = (oldList, newList) => {
     let res = {
         offset: []
     }
     let oldListLen = oldList.length
     let newListLen = newList.length
     let oldListIds = oldList.map(item => item.id)
     let newListIds = newList.map(item => item.id)
     if (newListLen >= oldListLen) {
         res.type = 'increase'
         for (let i = 0, len = newListLen; i < len; i++) {
            let id = newList[i].id
            if (oldListIds.indexOf(id) === -1)
                res.offset.push(id)
         }
     } else {
         res.type = 'decrease'
         for (let i = 0, len = oldListLen; i < len; i++) {
            let id = oldList[i].id
            if (newListIds.indexOf(id) === -1)
                res.offset.push(id)
         }
     }
     return res
 }

 /**
 * @param {object} 新数据
 * @returns {object} 对象
 * @description 重新计算dlobalInnIds值
 */
export const reComputedGlobalInnIds = (localInnIds, maxLen) => {
    let res = []
    let allIds = []
    let emptyObj = {}
    for (let key in localInnIds) {
        let item = localInnIds[key]
        allIds = allIds.concat(item.map(subItem => subItem.id))
    }
    for (let i = 0, len = allIds.length; i < len; i++) {
        let item = allIds[i]
        emptyObj[item] ?
            emptyObj[item]++
            : (emptyObj[item] = 1)
    }
    for (let key in emptyObj) {
        let item = emptyObj[key]
        res.push({
            id: Number(key),
            indeterminate: item < maxLen
        })
    }
    return res
}

/**
 * @param {object} 目前已选择的权限
 * @param {array} 所有权限列表
 * @returns {object} 对象
 * @description 重新整理数据格式
 */
export const creatSubmitData = (localInnIds, allAuthority) => {
    let res = {}
    for (let key in localInnIds) {
        res[key] = []
        let item = localInnIds[key]
        let ids = item.map(subItem => subItem.id)
        res[key] = res[key].concat(ids)
        for (let k = 0, len = ids.length; k < len; k++) {
            for (let c = 0, clen = allAuthority.length; c < clen; c++) {
                let { id, level, parentId } = allAuthority[c]
                if (ids[k] === id && level === 2 && res[key].indexOf(parentId) === -1)
                    res[key].push(parentId)
            }
        }
    }
    return res
}
