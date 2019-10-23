<template>
  <mu-dialog title="添加任务" :open="open" @update:open="updateOpen" scrollable>
    <mu-container>
      <mu-row gutter>
        <mu-col span="4">
          <mu-text-field v-model="task.taskName" label-float label="任务名称"></mu-text-field>
        </mu-col>
        <mu-col span="4">
          <mu-select v-model="task.taskOwner" label-float label="负责人">
            <mu-option
              v-for="(user,index) in users"
              :key="user.userId+index"
              :label="user.userName"
              :value="user.userId"
            ></mu-option>
          </mu-select>
        </mu-col>
        <mu-col span="4">
          <mu-select v-model="task.taskLevel" label-float label="优先级">
            <mu-option
              v-for="(level,index) in TASK_LEVEL"
              :key="level+index"
              :label="level"
              :value="index"
            ></mu-option>
          </mu-select>
        </mu-col>
      </mu-row>
      <mu-sub-header style="padding-left:0px;">任务明细</mu-sub-header>
      <mu-row gutter v-for="(item,index) in taskDetailList" :key="index">
        <mu-col span="1">
          <mu-badge :content="index+1+''" color="primary" class="row-badge"></mu-badge>
        </mu-col>
        <mu-col span="5">
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
          <mu-text-field
            v-model="taskDetailList[index].taskRemark"
            full-width
            label-float
            label="备注"
          ></mu-text-field>
        </mu-col>
        <mu-col span="2" style="text-align:right;" v-if="index==0">
          <mu-button color="primary" icon class="row-inline" @click="addDetail">
            <mu-icon value="add"></mu-icon>
          </mu-button>
          <mu-button
            color="secondary"
            v-if="taskDetailList.length>1"
            icon
            class="row-inline"
            @click="delDetail"
          >
            <mu-icon value="remove"></mu-icon>
          </mu-button>
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
    }
  },
  data() {
    return {
      task: {},
      taskDetailList: [{ taskName: "", taskPlanFinishDate: new Date() }],
      TASK_LEVEL
    };
  },
  methods: {
    addDetail() {
      this.taskDetailList.push({});
    },
    delDetail() {
      this.taskDetailList.splice(this.taskDetailList.length - 1);
    },
    close() {
      this.$emit("update:open", false);
    },
    updateOpen(open) {
      this.$emit("update:open", open);
    },
    async submit() {
      await this.$http.post(
        `task/add`,
        Object.assign(
          {
            taskDetailList: this.taskDetailList
          },
          this.task
        )
      );
      this.$emit('update:open',false);
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