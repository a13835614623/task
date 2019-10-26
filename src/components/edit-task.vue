<template>
  <mu-dialog v-if="task" title="编辑任务" :open="open" @update:open="updateOpen" scrollable>
    <mu-container>
      <!-- 任务信息 -->
      <mu-row gutter>
        <mu-col span="3">
          <mu-text-field v-model="task.taskName" label-float label="任务名称"></mu-text-field>
        </mu-col>
        <mu-col span="3">
          <mu-date-input
            v-model="task.taskPlanFinishDate"
            label="计划完成时间"
            label-float
            full-width
            no-display
          ></mu-date-input>
        </mu-col>
        <mu-col span="3">
          <mu-date-input
            v-model="task.taskFinishDate"
            label="实际完成时间"
            label-float
            full-width
            no-display
          ></mu-date-input>
        </mu-col>
        <mu-col span="3">
          <mu-text-field type="number" v-model="task.taskCostTime" label="实际消耗时间(天)" label-float></mu-text-field>
        </mu-col>
      </mu-row>
      <mu-row gutter>
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
        <mu-col span="4">
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
      <!-- 任务明细操作 -->
      <mu-row>
        <mu-col span="10">
          <mu-sub-header style="padding-left:0px;">任务明细</mu-sub-header>
        </mu-col>
        <mu-col span="2" style="text-align:right;">
          <mu-button
            color="primary"
            :disabled="!task.taskDetailList[task.taskDetailList.length-1].taskName"
            icon
            @click="addDetail"
          >
            <mu-icon value="add"></mu-icon>
          </mu-button>
          <mu-button
            color="secondary"
            :disabled="task.taskDetailList.length<=1"
            icon
            @click="delDetail"
          >
            <mu-icon value="remove"></mu-icon>
          </mu-button>
        </mu-col>
      </mu-row>
      <!-- 任务明细列表 -->
      <mu-row gutter v-for="(item,index) in task.taskDetailList" :key="index">
        <mu-col span="1">
          <mu-badge :content="task.taskDetailList[index].taskOrder+''" color="primary" class="row-badge"></mu-badge>
        </mu-col>
        <mu-col span="3">
          <mu-text-field
            v-model="task.taskDetailList[index].taskName"
            full-width
            label-float
            label="任务明细"
          ></mu-text-field>
        </mu-col>
        <mu-col span="2">
          <mu-date-input
            v-model="task.taskDetailList[index].taskPlanFinishDate"
            label="计划完成时间"
            label-float
            full-width
            no-display
          ></mu-date-input>
        </mu-col>
        <mu-col span="2">
          <mu-date-input
            v-model="task.taskDetailList[index].taskFinishDate"
            label="实际完成时间"
            label-float
            full-width
            no-display
          ></mu-date-input>
        </mu-col>
        <mu-col span="2">
          <mu-select
            v-model="task.taskDetailList[index].taskState"
            label="状态"
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
        <mu-col span="2">
          <mu-text-field
            v-model="task.taskDetailList[index].taskRemark"
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
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      TASK_LEVEL,
      TASK_STATE,
      task: null
    };
  },
  async created() {
    await this.reload();
  },
  watch: {
    open(newValue, oldValue) {
      newValue && this.reload();
    }
  },
  methods: {
    async reload() {
      let { data } = await this.$http.post(`task/query`, {
        task:{taskId: this.taskId}
      });
      this.task = data.data[0];
    },
    addDetail() {
      this.task.taskDetailList.push({
        taskName: "",
        taskState: 0,
        taskRemark: "",
        taskOrder:this.task.taskDetailList.length+1
      });
    },
    async delDetail() {
      let last = this.task.taskDetailList.last();
      if (last && last.taskId) {
        const loading = this.$loading();
        try {
          let { data } = await this.$http.get(`task/del?taskId=${last.taskId}`);
          data.code == 0 && this.task.taskDetailList.pop();
          return;
        } finally {
          loading&&loading.close();
        }
      } else {
        this.task.taskDetailList.pop();
      }
    },
    close() {
      this.$emit("update:open", false);
    },
    updateOpen(open) {
      this.$emit("update:open", open);
    },
    parentTaskStateChange(value) {
      if (TASK_STATE[value] == "完成")
        this.task.taskDetailList.map((t, index, arr) => {
          arr[index].taskState = value;
        });
    },
    validator() {
      if (this.task.taskName == "") {
        this.$toast.error("任务名称不能为空!");
        return false;
      }
      if (this.task.taskCostTime&&parseInt(this.task.taskCostTime) < 0) {
        this.$toast.error("任务消耗时间不能为负!");
        return false;
      }
      if (this.task.taskDetailList.last().taskName == "") {
        this.$toast.error("任务明细不能为空!");
        return false;
      }
      return true;
    },
    async submit() {
      if (!this.validator()) return;
      const loading = this.$loading();
      try {
        let { data } = await this.$http.post(`task/update`, this.task);
        if (data.code == 0) {
          this.$emit("update:open", false);
          this.$emit("flush", null);
          this.$toast.success("更新成功");
        }
      } finally {
        loading.close();
      }
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