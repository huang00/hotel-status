/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-5-17
 * Time: 上午9:45
 *
 */

/* eslint-disable*/

import {allPageloaadServers} from '../../../common_libs/pageonload'

allPageloaadServers.pageLoadPublicStyle();

/**
 * 客栈管理系统
 * @type {{findRegisterUser: (function(*=)), findUserByName: (function(*=)), editUserInfo: (function(*=)), freezeAccount: (function(*=))}}
 */
export let innRoomTypeApiServers = {
    getBaseInfo: (param) => {
        /* 获取用户基本信息 */
        return httpRequestor.get('/auth/base', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    findRoomTypeAllRoom: (param) => {
        /* 获取所有房型 */
        return httpRequestor.get('/inn/roomtype/findall', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    addRoomType: (param) => {
        /* 添加房型 */
        return httpRequestor.post('/inn/roomtype/addRoomType', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    updateWeekPrice: (param) => {
        /* 更新、设置周末价格 */
        return httpRequestor.get('/inn/roomtypeprice/updateRoomTypePrice', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    addWeekPrice: (param) => {
        /* 添加房型周一到周日的价格 */
        return httpRequestor.get('/inn/roomtypeprice/addRoomTypePrice', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    searchPrice: (param) => {
        /* 根据日期查询一个月内该客栈所有房型每一天的实际价格.默认是当前日期前4天到后25天. 如果指定了日期,则查询指定日期内的数据 */
        return httpRequestor.get('/inn/roomtypeprice/realprice', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    addSpecialPrice: (param) => {
        /* 设置房型在一段时间内的特殊价格 */
        return httpRequestor.get('/inn/roomtypeprice/addSpecialPrice', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    updateSpecialPrice: (param) => {
        /* 更新房型在一段时间内的特殊价格 */
        return httpRequestor.get('/inn/roomtypeprice/updateSpecialPrice', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getSpecialPrice: (param) => {
        /* 根据特殊价格ID查询房型特殊价格 */
        return httpRequestor.get('/inn/roomtypeprice/getSpecialPrice', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getRoomTypeToWeekendPrice: (param) => {
        /* 获取房型周末价格 */
        return httpRequestor.get('/inn/roomtypeprice/getRoomTypePrice', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getRoomTypeToSpeciaPrice: (param) => {
        /* 获取特殊周末价格 */
        return httpRequestor.get('/inn/roomtypeprice/getRoomTypePrice', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    delRoomType: (param) => {
        /* 删除房型 */
        return httpRequestor.get('/inn/roomtype/deleteRoomType', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    updateRoomType: (param) => {
        /* 更新房型 */
        return httpRequestor.post('/inn/roomtype/updateRoomType', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    isRoomCanDelete: (param) => {
        /* 更新房型 */
        return httpRequestor.get('/inn/room/isRoomCanDelete', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    sortRoomType: (param) => {
        /* 房型的顺序修改 */
        return httpRequestor.post('/inn/roomtype/sortRoomType', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    sortRoom: (param) => {
        /* 房间排序、以及房间归属修改 */
        return httpRequestor.post('/inn/room/sortRoom', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getFestival: (param) => {
        /* 获取选择日期内的节日集合 */
        return httpRequestor.get('/inn/festival/getFestival', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getInnInfo: (param) => {
        return httpRequestor.get('/inn/inn/getInn', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* ------------------------直联api----------------------- */
    getChannelList: (param) => {
        /* 获取渠道信息 */
        return httpRequestor.post('/direct/channel/getList', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    fintIsCanConnect: (param) => {
        /* 查询是否可以直连 */
        return httpRequestor.get('/direct/can/direct', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    openChannel: (param) => {
        /* 开通渠道直联 */
        return httpRequestor.post('/direct/channel/openChannel', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getMapping: (param) => {
        /* 获取mapping房型 */
        return httpRequestor.post('/direct/roomtype/getMapping', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getPmsRoomType: (param) => {
        /* 获取pms房型 */
        return httpRequestor.post('/direct/roomtype/pmsList', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    updateMapping: (param) => {
        /* 修改、新增房型匹配关系 */
        return httpRequestor.post('/direct/roomtype/mapping', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    removeMapping: (param) => {
        /* 解除房型匹配关系 */
        return httpRequestor.post('/direct/roomtype/delete', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getUptodateHotelType: (param) => {
        /* 获取最新ato房型数据 */
        return httpRequestor.post('/direct/channel/update', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getAuditingRoomType: (param) => {
        /* 获取审核状态 */
        return httpRequestor.post('/direct/channel/getStatus', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    findDirectChannel: (param) => {
        /* 查询直连渠道 */
        return httpRequestor.get('/order/channel/findDirectChannel', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* ------------------------房量管理api----------------------- */
    getSumOfType: (param) => {
        /* 根据时间范围获取日期下总房量 */
        return httpRequestor.post('/direct/amout/sumOfType', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getNumOfType: (param) => {
        /* 根据时间范围获取日期下总房量 */
        return httpRequestor.post('/direct/amout/numOfType', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    toggleSellType: (param) => {
        /* 根据时间范围获取日期下总房量 */
        return httpRequestor.post('/direct/amout/openOrClose', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    getQuestionAndAnswer: (param) => {
        return httpRequestor.get('/finance/getQuestionAndAnswer', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* ------------------------自有渠道 api----------------------- */
    findOwnChannel: (param) => {
        /* 查询自有渠道 */
        return httpRequestor.get('/order/channel/findMyChannel', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    findDirectChannel: (param) => {
        /* 查询直连渠道 */
        return httpRequestor.get('/order/channel/findDirectChannel', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    updateOwnChannel: (param) => {
        /* 新建/修改渠道 */
        return httpRequestor.post('/order/channel/saveChannel', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    deleteChannel: (param) => {
        /* 新建/修改渠道 */
        return httpRequestor.get('/order/channel/deleteChannel', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },

    // 多门店
    getInnList: () => {
        /* 查询用户的所有关联客栈 */
        return httpRequestor.get('/user/get/inn/list').catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    addInn: (param) => {
        /* 添加客栈 */
        return httpRequestor.postFormData('/user/addInn', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    sortInn: (param) => {
        /* 排序客栈 */
        return httpRequestor.post('/user/sort/inn', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    updatePhone: (param) => {
        /* 排序客栈 */
        return httpRequestor.post('/user/update/phone', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
};

export const hotelInforApiServers = {
    /* ------------------------客栈信息 api----------------------- */
    getAllProvinceAdresse: (param) => {
        return httpRequestor.post('/inn/area/findProvince', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    /**
     * 根据父级ID获取城市
     * @param param
     * @returns {Promise<any>}
     */
    getAllCityAdresse: (param) => {
        return httpRequestor.get('/inn/area/findCity', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    getHotelInfo: (param) => {
        return httpRequestor.get('/inn/inn/getInn', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    },
    updateHotelInfo: (param) => {
        return httpRequestor.post('/inn/inn/updateInn', param).catch(err => {
            console.log('请检查网络环境', err);
            alert('服务器请求失败，请检查网络环境。')
        })
    }
}

export const staffAccountApiServer = {
    /* ------------------------员工账号 api----------------------- */
    getStaffList: (param) => {
        return httpRequestor.get('/user/employee/list', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 确定 移交客栈 */
    confirmRemove: (param) => {
        return httpRequestor.postFormData('/user/transInn', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
     /* 移交客栈 第一步进行检测 */
    transInnFirst: (param) => {
        return httpRequestor.postFormData('/user/transInn/check', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
     /* 移交客栈 第二步进行检测 */
     transInnSecond: (param) => {
        return httpRequestor.postFormData('/user/judge/transInn', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 添加员工 */
    addEmployee: (param) => {
        return httpRequestor.postFormData('/user/employee/add', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    judgeExists: (param) => {
        return httpRequestor.postFormData('/user/employee/judge/exists', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 删除员工 */
    deleteEmployee: (param) => {
        return httpRequestor.postFormData('/user/employee/delete', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 编辑员工 */
    editEmployee: (param) => {
        return httpRequestor.postFormData('/user/employee/edit', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 根据userId 查询该用户的权限列表 */
    permissionListByUerId: (param) => {
        return httpRequestor.get('/user/employee/inn/permission/list', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    },
    /* 根据userId 查询用户主账号客栈列表 */
    masterHotelByUserId: (param) => {
        return httpRequestor.get('/user/get/master/innList', param).catch(err => {
            console.log('请检查网络环境', err);
        })
    }
}
