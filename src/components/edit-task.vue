<template>
  <mu-dialog title="编辑任务" :open="open" @update:open="updateOpen" scrollable>
    <mu-container>
      <mu-row gutter>
        <mu-col span="3">
          <mu-text-field v-model="task.taskName" label-float label="任务名称"></mu-text-field>
        </mu-col>
        <mu-col span="3">
          <mu-select v-model="task.taskOwner" label-float label="负责人">
            <mu-option
              v-for="(user,index) in users"
              :key="user.userId+index"
              :label="user.userName"
              :value="user.userId"
            ></mu-option>
          </mu-select>
        </mu-col>
        <mu-col span="3">
          <mu-select v-model="task.taskLevel" label-float label="优先级">
            <mu-option
              v-for="(level,index) in TASK_LEVEL"
              :key="level+index"
              :label="level"
              :value="index"
            ></mu-option>
          </mu-select>
        </mu-col>
        <mu-col span="3">
          <mu-select
            v-model="task.taskState"
            label="状态"
            @change="parentTaskStateChange"
            label-float
            full-width
          >
            <mu-option
              v-for="(state,index) in TASK_STATE"
              :key="state+index"
              :label="state"
              :value="index"
            ></mu-option>
          </mu-select>
        </mu-col>
      </mu-row>
      <mu-row>
        <mu-col span="10">
          <mu-sub-header style="padding-left:0px;">任务明细</mu-sub-header>
        </mu-col>
        <mu-col span="2" style="text-align:right;">
          <mu-button
            color="primary"
            :disabled="!taskDetailList[taskDetailList.length-1].taskName"
            icon
            @click="addDetail"
          >
            <mu-icon value="add"></mu-icon>
          </mu-button>
          <mu-button color="secondary" :disabled="taskDetailList.length<=1" icon @click="delDetail">
            <mu-icon value="remove"></mu-icon>
          </mu-button>
        </mu-col>
      </mu-row>
      <mu-row gutter v-for="(item,index) in taskDetailList" :key="index">
        <mu-col span="1">
          <mu-badge :content="index+1+''" color="primary" class="row-badge"></mu-badge>
        </mu-col>
        <mu-col span="3">
          <mu-text-field
            v-model="taskDetailList[index].taskName"
            full-width
            label-float
            label="任务明细"
          ></mu-text-field>
        </mu-col>
        <mu-col span="2">
          <mu-date-input
            v-model="taskDetailList[index].taskPlanFinishDate"
            label="计划完成时间"
            label-float
            full-width
            no-display
          ></mu-date-input>
        </mu-col>
        <mu-col span="2">
          <mu-date-input
            v-model="taskDetailList[index].taskFinishDate"
            label="实际完成时间"
            label-float
            full-width
            no-display
          ></mu-date-input>
        </mu-col>
        <mu-col span="2">
          <mu-select v-model="taskDetailList[index].taskState" label="状态" label-float full-width>
            <mu-option
              v-for="(state,index) in TASK_STATE"
              :key="state+index"
              :label="state"
              :value="index"
            ></mu-option>
          </mu-select>
        </mu-col>
        <mu-col span="2">
          <mu-text-field
            v-model="taskDetailList[index].taskRemark"
            full-width
            label-float
            label="备注"
          ></mu-text-field>
        </mu-col>
      </mu-row>
    </mu-container>
    <mu-button slot="actions" flat color="primary" @click="submit">提交</mu-button>
    <mu-button slot="actions" flat color="primary" @click="close">关闭</mu-button>
  </mu-dialog>
</template>

<script>
import { TASK_PROP_MAP, TASK_STATE, TASK_LEVEL } from "@/util/const";

export default {
  props: {
    open: {
      type: Boolean,
      required: false
    },
    users: {
      type: Array,
      required: true
    },
    parentTask: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      task: {},
      taskDetailList: [{ taskName: "", taskPlanFinishDate: new Date() }],
      TASK_LEVEL,
      TASK_STATE
    };
  },
  created() {
    this.getTaskDetail();
  },
  watch: {
    open(newValue, oldValue) {
      if (newValue) this.getTaskDetail();
    }
  },
  methods: {
    addDetail() {
      this.taskDetailList.push({});
    },
    async delDetail(taskId) {
      let { data } = await this.$http.get(`task/del?taskId=${taskId}`);
      if (data.code != -1)
        this.taskDetailList.splice(this.taskDetailList.length - 1);
    },
    close() {
      this.$emit("update:open", false);
    },
    updateOpen(open) {
      this.$emit("update:open", open);
    },
    parentTaskStateChange(value) {
      if (TASK_STATE[value] == "完成" || TASK_STATE[value] == "挂起")
        this.taskDetailList.map((t, index, arr) => {
          arr[index].taskState = value;
        });
    },
    async submit() {
      let { data } = await this.$http.post(
        `task/update`,
        Object.assign(
          {
            taskDetailList: this.taskDetailList
          },
          this.task
        )
      );
      this.$emit("update:open", false);
    },
    async getTaskDetail() {
      let { data } = await this.$http.post(`task/query`, {
        parentTask: this.parentTask
      });
      this.taskDetailList = data.data;
      let res = await this.$http.post(`task/query`, {
        taskId: this.parentTask
      });
      this.task = res.data.data[0];
    }
  }
};
</script>

<style lang="scss" scoped>
.row-badge {
  padding-top: 35px;
}
.row-inline {
  margin-top: 25px;
}
</style>