<template>
  <div class="sider-menu" :style="{width}">
    <Menu width="100%" :active-name="currentLocation">
      <MenuItem name="/" to="/">
        <Icon type="md-swap" size="18"/>收支流水表
      </MenuItem>
      <MenuItem name="/hotelChannel" to="/hotelChannel">
        <Icon type="ios-paper" size="18"/>渠道对账表
      </MenuItem>
      <!-- <Submenu name="1">
        <template slot="title">
          <Icon type="ios-paper"/>内容管理
        </template>
        <MenuItem name="1-1">文章管理</MenuItem>
        <MenuItem name="1-2">评论管理</MenuItem>
        <MenuItem name="1-3">举报管理</MenuItem>
      </Submenu> -->
    </Menu>
  </div>
</template>

<script>
export default {
  name: "siderMenu",
  props: {
    width: {
      type: String,
      default: "198px"
    }
  },
  computed: {
      currentLocation () {
          return this.$route.path
      }
  }
};
</script>

<style lang="scss">
.sider-menu {
  position: absolute;
  height: 100%;
  left: 0;
  top: 70px;
  box-shadow: 4px 0 6px #ddd;
  min-height: calc(100vh - 70px);
  .ivu-menu {
    padding-top: 10px;
    .ivu-menu-item-active:not(.ivu-menu-submenu) {
      border: 0;
      border-left: 4px solid #0b8cef;
      background: none;
      color: #2d8cf0 !important;
    }
    .ivu-menu-submenu-title {
      border: 0;
      padding: 14px 15px 14px 40px;
      border-left: 4px solid transparent;
    }
    .ivu-menu-submenu {
      .ivu-menu-item {
        padding-left: 60px !important;
        border: 0;
        &.ivu-menu-item-active {
          background: #90d2fa;
          color: white !important;
        }
      }
      .ivu-menu-submenu-title:hover {
        background: #f3f3f3;
      }
      &.ivu-menu-item-active {
        .ivu-menu-submenu-title {
          border: 0;
          border-left: 4px solid #0b8cef;
        }
      }
    }
    .ivu-menu-item {
      padding: 0;
      border: 0;
      padding: 14px 15px 14px 40px;
      border-left: 4px solid transparent;
      &:after {
        display: none !important;
      }
      &:hover {
        background: #f3f3f3;
        color: inherit;
      }
    }
  }
}
</style>
