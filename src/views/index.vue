<template>
  <div class="page">
    <mu-drawer :open.sync="open" class="drawer">
      <h4>
        TASK
        <br />MANAGE
      </h4>
      <!-- <div class="h1">TASK MANAGE</div> -->
      <mu-sub-header>用户菜单</mu-sub-header>
      <mu-divider></mu-divider>
      <mu-list>
        <mu-list-item
          v-for="menu in menus"
          :key="menu.title"
          @click="clickMenu(menu)"
          button
          style="padding:20px 0;"
        >
          <mu-list-item-action>
            <mu-icon :value="menu.icon"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>{{ menu.title }}</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-drawer>
    <div :class="open ? 'app-open' : ''">
      <mu-appbar color="primary">
        <mu-button icon slot="left" @click="open = !open">
          <mu-icon value="menu"></mu-icon> </mu-button
        >TASK MANAGE
      </mu-appbar>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      open: true,
      menus: [
        {
          title: "任务管理",
          icon: "format_list_numbered",
          link: "/task-manage"
        },
        {
          title: "用户管理",
          icon: "person",
          link: "/user-manage"
        }
      ],
      newTask: {},
      activeTab: 0
    };
  },
  methods: {
    clickMenu(menu) {
      this.$router.push(menu.link);
    }
  }
};
</script>

<style lang="scss" scoped>
$open-width: 256px;
$sm: 576px;
$md: 768px;
$lg: 992px;
$xl: 1200px;
.page {
  text-align: center;
  @media (min-width: $xl) {
    .app-open {
      padding-left: $open-width;
    }
  }
  @media (max-width: $xl) {
    .drawer {
      display: none;
    }
  }
  .drawer-title {
    font-size: 34px;
    font-weight: 100;
    padding: 50px 0;
  }
}
</style>
