<template>
    <div class="select-authority fontSize14">
        <div class="switch-config-method" @click="switchConfigMethod">
            {{unifiedDis? '分客栈配置权限': '统一配置权限'}}
        </div>
        <div class="tabs-navs-hotel" v-if="!unifiedDis">
            <tabs-nav :list="hotelList" @on-change="onSwitchHotel"></tabs-nav>
        </div>
        <div style="height: 20px;" v-else></div>
        <ul>
            <li
                class="authority-item"
                v-for="item in treeMenuList"
                :key="item.id"
            >
                <p>
                    <template v-if="item.level === 1 && item.children.length">
                        <Checkbox
                            :indeterminate="item.indeterminate"
                            :value="item.checkAll"
                            @click.prevent.native="handleCheckAll(item)"
                        >
                            {{ item.name }}
                        </Checkbox>
                    </template>
                    <template v-if="item.level === 1 && !item.children.length">
                        <Checkbox
                            v-model="item.checkAll"
                            :indeterminate="item.indeterminate"
                            @click.prevent.native="handleSingleCheck(item)"
                        >
                            {{ item.name }}
                        </Checkbox>
                    </template>
                </p>
                <p style="padding-left: 18px;" v-if="item.children">
                    <CheckboxGroup v-model="item.checkAllGroup" @on-change="checkAllGroupChange(item)">
                        <Checkbox
                            :label="subItem.id"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                            :indeterminate="subItem.indeterminate"
                            @click.native="subItem.indeterminate = false"
                        >
                        {{ subItem.name }}
                        </Checkbox>
                    </CheckboxGroup>
                </p>
            </li>
        </ul>
        <div class="check-all">
            <Checkbox
                style="width: 60px;"
                v-model="checkAll"
                @on-change="handlerCheckAll"
                :indeterminate="indeterminate"
            >
            全选
            </Checkbox>
        </div>
    </div>
</template>

<script>
import TabsNav from 'common_components/TabsNav'
import {
    creatTreeData,
    computedOffset,
    reComputedGlobalInnIds,
    creatSubmitData
} from 'hotelType/libs/util'
import {
    deepCopy
} from 'common_libs/util'

export default {
    name: 'SelectAuthority',
    props: {
        hotelListIds: {
            type: Array,
            default () {
                return []
            }
        },
        authorityObj: {
            type: Object,
            default () {
                return {}
            }
        },
        model: {
            type: String,
            default: 'add'
        }
    },
    data () {
        return {
            unifiedDis: true, // 统一配置权限
            indeterminate: false,
            checkAll: false,
            checkAllGroup: [],
            innIdPermission: {},
            treeMenuList: [],
            currentInnId: 0,
            globalInnIds: [],
            singleCheckboxId: 0
        }
    },
    created() {
        if (this.model === 'add') {
            for (let i = 0, len = this.hotelListIds.length; i < len; i++) {
                let item = this.hotelListIds[i]
                this.innIdPermission[item] = this.allPermissionList.map(item => {
                    return {
                        id: item.id,
                        indeterminate: false
                    }
                })
            }
            this.globalInnIds = this.allPermissionList.map(item => {
                return {
                    id: item.id,
                    indeterminate: false
                }
            })
            this.treeMenuList = creatTreeData(this.allPermissionList, this.globalInnIds)
        } else {
            let authorityObjIds = []
            for (let key in this.authorityObj)
                authorityObjIds.push(Number(key))

            for (let i = 0, len = this.hotelListIds.length; i < len; i++) {
                let item = this.hotelListIds[i]
                if (authorityObjIds.indexOf(item) >= 0) {
                    this.innIdPermission[item] = this.authorityObj[item].map(subItem => {
                        return {
                            id: subItem.permissionId,
                            indeterminate: false
                        }
                    })
                } else {
                    this.innIdPermission[item] = this.allPermissionList.map(item => {
                        return {
                            id: item.id,
                            indeterminate: false
                        }
                    })
                }
            }
            this.globalInnIds = reComputedGlobalInnIds(this.innIdPermission, this.hotelList.length)
            this.treeMenuList = creatTreeData(this.allPermissionList, this.globalInnIds)
        }
    },
    components: {
        TabsNav
    },
    computed: {
        hotelList () {
            let hotelList = []
            this.$store.getters.hotelList.map(item => {
                if (this.hotelListIds.indexOf(item.innId) >= 0) {
                    hotelList.push({
                        value: item.innId,
                        label: item.innName
                    })
                }
            })
            return hotelList
        },
        allPermissionList () {
            return this.$store.getters.allPermissionList
        }
    },
    methods: {
        onSwitchHotel (data) {
            this.currentInnId = data.value
            this.treeMenuList = creatTreeData(this.allPermissionList, this.innIdPermission[this.currentInnId])
        },
        switchConfigMethod () {
            /* 设置分配方式 */
            let ids = []
            if (this.unifiedDis) {
                this.currentInnId = this.hotelList[0].value
                ids = this.innIdPermission[this.currentInnId]
            } else
                ids = this.globalInnIds
            this.treeMenuList = creatTreeData(this.allPermissionList, ids)
            this.unifiedDis = !this.unifiedDis
        },
        handlerCheckAll (val) {
            /* 全选 */
            this.indeterminate = false
            this.checkAll = !this.checkAll
            this.treeMenuList.map(item => {
                if (val) {
                    if (item.children) {
                        let ids = item.children.map(subItem => subItem.id)
                        item.checkAllGroup = ids
                        item.indeterminate = false
                        item.checkAll = true
                    } else {
                        item.checked = true
                    }
                } else {
                    if (item.children) {
                        item.checkAllGroup = []
                        item.indeterminate = false
                        item.checkAll = false
                    } else {
                        item.checked = false
                    }
                }
                item.children.map(subItem => {
                    subItem.indeterminate = false
                })
            })
        },
        handleCheckAll (data) {
            if (data.indeterminate) {
                data.checkAll = false;
            } else {
                data.checkAll = !data.checkAll;
            }
            data.indeterminate = false;

            if (data.checkAll) {
                let ids = data.children.map(item => item.id)
                data.checkAllGroup = ids
            } else 
                data.checkAllGroup = []
            data.children.map(item => {
                item.indeterminate = false
            })
        },
        handleSingleCheck (data) {
            data.checkAll = !data.checkAll
            if (this.unifiedDis)
                data.indeterminate = false
        },
        checkAllGroupChange (data) {
            let checkedLen = data.checkAllGroup.length
            let len = data.children.length
            if (checkedLen === len) {
                data.indeterminate = false;
                data.checkAll = true;
            } else if (checkedLen > 0) {
                data.indeterminate = true;
                data.checkAll = true;
            } else {
                data.indeterminate = false;
                data.checkAll = false;
            }
        },
        globalTreeChange (oldValue, newValue) {
            let offset = computedOffset(oldValue, newValue)
            let ids = offset.offset
            if (offset.type === 'increase') {
                for (let key in this.innIdPermission) {
                    let singleIds = this.innIdPermission[key].map(item => item.id)
                    for (let i = 0, len = ids.length; i < len; i++) {
                        let item = ids[i]
                        if (singleIds.indexOf(item) === -1)
                            this.innIdPermission[key].push({
                                id: item,
                                indeterminate: false
                            })
                    }
                }
            } else if (offset.type === 'decrease') {
                for (let key in this.innIdPermission) {
                    let single = this.innIdPermission[key]
                    for (let i = single.length; i--;) {
                        let item = single[i]
                        if (ids.indexOf(item.id) >= 0)
                            single.splice(i, 1)
                    }
                }
            }
        },
        localTreeChange () {
            this.globalInnIds = reComputedGlobalInnIds(this.innIdPermission, this.hotelList.length)
        }
    },
    watch: {
        treeMenuList: {
            handler (val) {
                let checkAllGroup = []
                let checkAllInnds = []
                let allLen = 0
                let checkedLen = 0
                val.map(item => {
                    if (item.children.length) {
                        allLen += item.children.length
                        checkedLen += item.checkAllGroup.length
                        checkAllInnds = checkAllInnds.concat(item.checkAllGroup)
                        if (this.unifiedDis) {
                            if (
                                allLen === checkedLen &&
                                item.children.some(subItem => subItem.indeterminate === true) &&
                                checkedLen > 0
                            ) {
                                item.indeterminate = true
                            }
                        }
                    } else {
                        allLen += 1
                        if (item.checkAll) {
                            checkedLen += 1
                            checkAllInnds = checkAllInnds.concat(item.id)
                        }
                    }
                })
                for (let i = 0, len = checkAllInnds.length; i < len; i++) {
                    let item = checkAllInnds[i]
                    checkAllGroup.push({
                        id: item,
                        indeterminate: false
                    })
                }
                if (this.unifiedDis) {
                    let oldGlobalInnIds = deepCopy(this.globalInnIds)
                    this.globalInnIds = checkAllGroup
                    this.globalTreeChange(oldGlobalInnIds, this.globalInnIds)
                } else {
                    this.innIdPermission[this.currentInnId] = checkAllGroup
                    this.localTreeChange()
                }
                if (allLen === checkedLen) {
                    this.checkAll = true
                    this.indeterminate = false
                } else if (checkedLen > 0) {
                    this.indeterminate = true;
                    this.checkAll = true;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
                this.$emit('on-change', creatSubmitData(this.innIdPermission, this.allPermissionList))
            },
            deep: true
        }
    }
}
</script>

<style lang="scss">
    .select-authority {
        color: #666666;
        padding-left: 45px;
        .authority-item {
            padding: 5px 0;
        }
        .tabs-navs-hotel {
            min-height: 30px;
            width: 440px;
            margin-left: -15px;
            background-color: #FBFBFB;
            margin-bottom: 10px;
        }
        .switch-config-method {
            position: absolute;
            top: 8px;
            right: 30px;
            color: #215D91;
            text-decoration: underline;
            cursor: pointer;
        }
        .check-all {
            position: absolute;
            bottom: 15px;
            z-index: 1;
        }
        .ivu-checkbox-wrapper {
            margin-top: 10px;
        }
    }
</style>
