<!--分页-->
<template>
    <div class="self-share-page" >
        <Page :total="total" :current.sync="curPageNum" :page-size="pageSize" 
              placement="top" @on-change="getPage"
              prev-text="上一页" next-text="下一页"></Page>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                curPageNum: this.pageNum,
            }
        },
        props: {
            pagingOption: {
                type: Object,
                default: function () {
                    return {
                        showPaging: true,
                        showTotal: true
                    }
                }
            },
            total: {
                type: Number,
            },
            pageNum: {
                type: Number,
                default:1,
            },
            pageSize: {
                type: Number,
                default:5,
            },
        },
        methods: {
            getPage (page){
                this.$emit('curPage', page)
            },
            // initCurPage () {
            //    this.getPage(1)
            //    this.pageNum = 1
            // }
        }
    }
</script>
<style scoped>
    .self-share-page {
        margin-top: 20px;
        text-align: center;
    }
</style>
