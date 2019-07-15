<template>
    <div class="hotel-people" v-if="data.employees.length">
        <span class="hotel-name fontSize16">{{ data.innName }}</span>
        <Card style="margin-top: 15px; border-radius: 10px; padding: 0 34px;">
            <ul class="people-list fontSize14 textCent">
                <template v-if="data.employees.length">
                    <li class="people-list-head fontSize16">
                        <div class="item-name">员工名称</div>
                        <div class="item-name">用户名</div>
                        <div class="item-name">手机号</div>
                        <div class="item-name">操作</div>
                    </li>
                    <li
                        class="people-item"
                        v-for="item in data.employees"
                        :key="item.id"
                    >
                        <div class="item-name">{{ item.employeeName }}{{item.telephone === phoneNumber? '（我的账号）':''}}</div>
                        <div class="item-name">{{ item.username }}</div>
                        <div class="item-name">{{ item.telephone }}</div>
                        <div class="item-name">
                            <div class="buttons-wrapper margin_x_c">
                                <template v-if="item.master === 1">
                                    <span
                                        :class="{
                                            'public-buttons': true,
                                            remove: !vDisabled(item),
                                            disabled: vDisabled(item)
                                        }"
                                        @click="removeStaff(item)"
                                    >移交
                                    </span>
                                </template>
                                <template v-else>
                                    <span
                                        :class="{
                                            'public-buttons': true,
                                            del: !vDisabled(item),
                                            disabled: vDisabled(item)
                                        }"
                                        @click="delStaff(item)"
                                    >删除
                                    </span>
                                    <span
                                        :class="{
                                            'public-buttons': true,
                                            edit: !vDisabled(item),
                                            disabled: vDisabled(item)
                                        }"
                                        @click="editStaff(item)"
                                    >编辑</span>
                                </template>
                            </div>
                        </div>
                    </li>
                </template>
                <!-- <template v-else>
                    <li class="textCent fontSize16" style="display: inline-block;">该客栈还没有员工！</li>
                </template> -->
            </ul>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'HotelPeople',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    computed: {
        phoneNumber () {
            return this.$store.getters.userInfo.phoneNumber
        }
    },
    methods: {
        removeStaff (item) {
            if (this.vDisabled(item))
                return false
            this.$emit('on-remove', item)
        },
        delStaff (item) {
            if (this.vDisabled(item))
                return false
            this.$emit('on-delete', item)
        },
        editStaff (item) {
            if (this.vDisabled(item))
                return false
            this.$emit('on-update', item)
        },
        vDisabled (item) {
            /* 判断是否是主账号 和 自身 */
            let { telephone, master } = item
            if (
                (telephone !== this.phoneNumber && master === 1) ||
                (telephone === this.phoneNumber && master === 0)
            )
                return true
            else
                false
        }
    }
}
</script>

<style lang="scss" scoped>
    $base-color: #235F92;
    .hotel-people {
        color: $base-color;
        margin-bottom: 45px;
        .hotel-name {
            margin-left: 15px;
        }
        .people-list {
            .people-item {
                color: #999999;
                background-color: #FAFAFA;
                border-left: 4px solid $base-color;
                margin-bottom: 20px;
                cursor: pointer;
                .buttons-wrapper {
                    width: 230px;
                    text-align: left;
                }
            }
            .people-item:hover{
                background-color: #E8EDF8 !important;
            }
        }
        li {
            display: flex;
            .item-name {
                flex: 1;
                line-height: 46px;
            }
        }
    }
</style>

