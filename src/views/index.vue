<template>
  <div class="page">
    <mu-appbar style="width: 100%;" color="primary">
      <mu-button icon slot="left">
        <mu-icon value="menu"></mu-icon>
      </mu-button>任务表
      <mu-button slot="right" flat @click="open=true">添加任务</mu-button>
    </mu-appbar>
    <task-table :list="taskList" :users="users" />
    <task-view :open.sync="open" :users="users" />
  </div>
</template>

<script>
import taskTable from "@/components/task-table";
import taskView from "@/components/task-view";
import { TASK_PROP_MAP, TASK_STATE, TASK_LEVEL } from "@/util/const";

export default {
  name: "index",
  data() {
    return {
      open: false,
      newTask: {},
      TASK_PROP_MAP,
      TASK_STATE,
      TASK_LEVEL,
      taskList: [],
      users: []
    };
  },
  components: {
    taskTable,
    taskView
  },
  created() {
    this.getUsers();
    this.getTaskList();
  },
  methods: {
    async getTaskList() {
      let { data } = await this.$http.post(`task/query`);
      data.data.map(d => {
        if (d.parentTask != null) this.taskList.push(d);
      });
    },
    async getUsers() {
      let { data } = await this.$http.get(`/user/query`);
      this.users = data.data;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>