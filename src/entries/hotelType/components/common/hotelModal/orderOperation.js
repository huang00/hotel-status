/**
 * Created with fly.
 * User: z1163764648@qq.com
 * Date: 18-6-7
 * Time: 上午10:57
 *
 */
import {forEach as _forEach, clone as _clone} from 'lodash'
import {orderOperation} from 'common_libs/util.js'

let orderModel;

export function mainorderOperation(mainObj) {
    orderModel = orderOperation();
    _forEach(orderModel, (value, key) => {
        _forEach(mainObj, (value1, key1) => {
            if (key1 === key) {
                orderModel[key1] = value1
            }
        })
    });
    return orderModel;
}

export function subOrderOperation(subOrderObj) {
    let newSubOrder = _clone(orderModel.suborders[0]);
    _forEach(newSubOrder, (value, key) => {
        _forEach(subOrderObj, (value1, key1) => {
            if (key1 === key) {
                newSubOrder[key1] = value1
            }
        })
    });
    return orderModel.suborders.push(newSubOrder);
}


export function subOrderDetailOperation(everDayPriceList, start) {
    start += 1;
    let newSubOrderDetaile = _clone(orderModel.suborders[0].details[0]);
    let details = [];
    for (let i = 0; i < everDayPriceList.length; i++) {
        _forEach(newSubOrderDetaile, (value, key) => {
            _forEach(everDayPriceList[i], (value1, key1) => {
                if (key1 === key) {
                    newSubOrderDetaile[key1] = value1
                }
            })
        });
        details.push(newSubOrderDetaile);
    }
    return orderModel.suborders[start].details = details;
}

export function subOrderClientsOperation(orderUserInfoList, start) {
    start += 1;
    let newSubOrderClients = _clone(orderModel.suborders[0].clients[0]);
    let clients = [];
    for (let i = 0; i < orderUserInfoList.length; i++) {
        _forEach(newSubOrderClients, (value, key) => {
            _forEach(orderUserInfoList[i], (value1, key1) => {
                if (key1 === key) {
                    newSubOrderClients[key1] = value1
                }
            })
        });
        clients.push(newSubOrderClients);
    }
    return orderModel.suborders[start].clients = clients;
}


export function recordsOperation(newRecords) {
    let records = [];
    for (let i = 0; i < newRecords.length; i++) {
        let newRecordsObj = _clone(orderModel.records[0]);
        _forEach(newRecordsObj, (value, key) => {
            _forEach(newRecords[i], (value1, key1) => {
                if (key1 === key) {
                    newRecordsObj[key1] = Number(value1)
                }
            })
        });
        records.push(newRecordsObj)
    }
    orderModel.records = records;
}

export function getLastOrderModel() {
    orderModel.suborders.splice(0, 1);
    for (let i = 0; i < orderModel.suborders.length; i++) {
        orderModel.suborders[i].clients.splice(0, 1);
    }
    return orderModel
}
