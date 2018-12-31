import { allPageloaadServers } from './pageonload'

allPageloaadServers.pageLoadPublicStyle();
export default {
  headRightServer
}
export const headRightServer = {
  /* 通过旧密码修改新密码 */
  updateOldPassword (params) {
    return httpRequestor.get('/user/updateOldPassword', params).catch(err => {
      console.log('请检查网络环境', err);
    })
  },
  getMessageList (params) {
    return httpRequestor.post('/message/message-service/findMessagePage', params).catch(err => {
      console.log('请检查网络环境', err);
    })
  },
  readMessage (params) {
    /* 设置消息已读 */
    return httpRequestor.post('/message/message-service/multy/readMessage', params).catch(err => {
      console.log('请检查网络环境', err);
    })
  },
  readAllMessage (params) {
    /* 设置消息已读 */
    return httpRequestor.get('/message/message-service/readAllMessage', params).catch(err => {
      console.log('请检查网络环境', err);
    })
  },
  getHotelOrderFrom: (param) => {
    return httpRequestor.get('/order/from', param).catch(err => {
        console.log('请检查网络环境', err);
    })
  }
}
