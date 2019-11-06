<template>
  <div class="task-manage">
    <mu-sub-header>任务查询</mu-sub-header>
    <div class="query">
      <mu-flex wrap="wrap" justify-content="between" align-items="center">
        <mu-flex class="flex-content">
          <mu-text-field v-model="query.task.taskName" label="任务名称" label-float></mu-text-field>
        </mu-flex>
        <mu-flex>
          <mu-select v-model="query.task.taskState" label="任务状态" label-float>
            <mu-option label="全部" :value="-1"></mu-option>
            <mu-option
              v-for="(state,index) in TASK_STATE"
              :key="state+index"
              :label="state"
              :value="index"
            ></mu-option>
          </mu-select>
        </mu-flex>
        <mu-flex>
          <mu-select v-model="query.task.taskLevel" label="优先级" label-float>
            <mu-option label="全部" :value="-1"></mu-option>
            <mu-option
              v-for="(level,index) in TASK_LEVEL"
              :key="level+index"
              :label="level"
              :value="index"
            ></mu-option>
          </mu-select>
        </mu-flex>
        <mu-flex>
          <mu-select v-model="query.task.taskOwner" label-float label="负责人">
            <mu-option label="全部" :value="-1"></mu-option>
            <mu-option
              v-for="(user,index) in userList"
              :key="user.userId+index"
              :label="user.userName"
              :value="user.userId"
            ></mu-option>
          </mu-select>
        </mu-flex>
      </mu-flex>
      <mu-flex wrap="wrap" justify-content="between" align-items="center">
        <mu-flex>
          <mu-date-input
            v-model="query['taskPlanFinishDateStart']"
            label="计划完成时间"
            help-text="开始日期"
            icon="today"
            label-float
            full-width
            no-display
          ></mu-date-input>
        </mu-flex>
        <mu-flex>
          <mu-date-input
            v-model="query['taskPlanFinishDateEnd']"
            icon="today"
            label="计划完成时间"
            help-text="结束日期"
            label-float
            full-width
            no-display
          ></mu-date-input>
        </mu-flex>
        <mu-flex>
          <mu-date-input
            v-model="query['taskFinishDateStart']"
            help-text="开始日期"
            label="实际完成时间"
            icon="today"
            label-float
            full-width
            no-display
          ></mu-date-input>
        </mu-flex>
        <mu-flex>
          <mu-date-input
            v-model="query['taskFinishDateEnd']"
            icon="today"
            help-text="结束日期"
            label="实际完成时间"
            label-float
            full-width
            no-display
          ></mu-date-input>
        </mu-flex>
      </mu-flex>
      <div class="text-center buttons">
        <mu-button color="primary" @click="queryTaskList">
          查询任务
          <mu-icon right value="search" />
        </mu-button>
        <mu-button class="add-task" color="green" @click="add">
          添加任务
          <mu-icon right value="add" />
        </mu-button>
        <mu-button color @click="reset">
          重置
          <mu-icon right value="refresh" />
        </mu-button>
      </div>
    </div>
    <mu-sub-header>任务列表</mu-sub-header>
    <task-table @flush="getTaskList" :start="startIndex" :list="taskList" :users="userList" />
    <mu-flex v-if="total>pageSize" justify-content="center" style="margin: 32px 0;">
      <mu-pagination
        @change="changePage"
        raised
        :total="total"
        :current.sync="curPage"
        :page-size="pageSize"
      ></mu-pagination>
    </mu-flex>
    <!-- 添加任务对话框 -->
    <add-task class="add-task" @flush="getTaskList" :open.sync="addOpen" :users="userList" />
  </div>
</template>

<script>
import taskTable from "@/components/task-table";
import { TASK_PROP_MAP, TASK_STATE, TASK_LEVEL } from "@/util/const";
import addTask from "@/components/add-task";
let QUERY_INIT = {
  task: { taskName: "" },
  taskPlanFinishDateStart: null,
  taskPlanFinishDateEnd: null,
  taskFinishDateStart: null,
  taskFinishDateEnd: null
};
export default {
  data() {
    return {
      taskList: [],
      userList: [],
      query: this.$clone(QUERY_INIT),
      TASK_PROP_MAP,
      TASK_STATE,
      TASK_LEVEL,
      addOpen: false,
      curPage: 1,
      pageSize: 20,
      total: 20
    };
  },
  components: {
    taskTable,
    addTask
  },
  computed: {
    startIndex() {
      return (this.curPage - 1) * this.pageSize;
    }
  },
  created() {
    this.getUserList();
    this.getTaskList();
  },
  methods: {
    formatDateQuery() {
      let dateKeys = [
        "taskPlanFinishDateStart",
        "taskPlanFinishDateEnd",
        "taskFinishDateStart",
        "taskFinishDateEnd"
      ];
      for (const key of dateKeys) {
        let date = this.query[key];
        if (date != null) {
          this.query[key].setHours(0, 0, 0);
        }
      }
    },
    preQuery() {
      Object.keys(this.query.task).map(key => {
        parseInt(this.query.task[key]) == -1 && delete this.query.task[key];
      });
      this.formatDateQuery();
    },
    queryTaskList(){
      this.curPage=1;
      this.getTaskList();
    },
    changePage() {
      this.getTaskList();
    },
    reset() {
      this.query = this.$clone(QUERY_INIT);
    },
    async getTaskList() {
      this.preQuery();
      const loading = this.$loading();
      try {
        let { data } = await this.$http.post(
          `task/query?start=${this.startIndex}&limit=${this.pageSize}`,
          this.query
        );
        this.taskList = [];
        if (data.code == 0) {
          this.taskList.push(...data.data);
          this.total = data.count;
        }
      } finally {
        loading&&loading.close();
      }
    },
    async getUserList() {
      let { data } = await this.$http.get(`/user/query`);
      this.userList = data.data;
    },
    add() {
      this.addOpen = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.task-manage {
  text-align: center;
  .query {
    padding: 0 20px;
  }
  .query-label {
    padding: 20px 0;
    width: 46%;
  }
  .buttons {
    padding: 20px 0;
    .mu-button {
      margin: 0 10px;
    }
  }
}
</style>