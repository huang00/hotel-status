<!--分页-->
<template>
    <div class="self-share-page" >
        <Page :total="total" :current.sync="pageNum" :page-size="pageSize" 
              placement="top" @on-change="getPage"
              prev-text="上一页" next-text="下一页"></Page>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                pageNum: 1
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
            // pageNum: {
            //     type: Number,
            //     default:2,
            // },
            pageSize: {
                type: Number,
                default:20,
            },
        },
        methods: {
            getPage (page){
                this.$emit('curPage', page)
            },
            initCurPage () {
               this.getPage(1)
               this.pageNum = 1
            }
        }
    }
</script>
<style scoped>
    .self-share-page {
        margin-top: 20px;
        text-align: center;
    }
</style>
