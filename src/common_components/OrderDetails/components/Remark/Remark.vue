<template>
    <div class="order-remark padding-l-r-10">
        <div class="edit" v-if="edit" key="1">
            <Row>
                <Col span="2" v-if="!hideLabel">
                    <span style="font-size: 16px;">备注：</span>
                </Col>
                <Col :span="hideLabel ? 24:22">
                    <Input
                        v-model="data.remarks"
                        type="textarea"
                        :autosize="{minRows: 4,maxRows: 7}"
                        placeholder="备注"
                        :maxlength="100" />
                </Col>
            </Row>
        </div>
        <div class="edit" v-else key="2">
            <Row>
                <Col span="2">
                    <span style="font-size: 16px;">备注：</span>
                </Col>
                <Col span="22">
                    <div class="content">
                        {{data.remarks || '无'}}
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Remark',
        props: {
            edit: {
                type: Boolean,
                default: true
            },
            data: {
                type: Object,
                default () {
                    return {}
                }
            },
            hideLabel: { // 隐藏标签
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang="scss">
    .order-remark {
        margin-top: 20px;
        .content {
            font-size: 14px;
            line-height: 24px;
        }
    }
</style>
