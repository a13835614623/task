<template>
  <div class="task-table">
    <mu-data-table
      :columns="columns"
      :sort.sync="sort"
      class="table"
      @sort-change="handleSortChange"
      :data="list"
      @row-click="rowClick"
    >
      <template slot-scope="{ row,$index }">
        <td class="table-row">{{start+$index+1}}</td>
        <td
          v-for="(label,propName) in TASK_PROP_MAP"
          :key="propName"
          class="table-row"
        >{{format(row[propName],propName)}}</td>
        <td>
          <mu-button icon color="primary" @click="edit(row)">
            <mu-icon value="edit"></mu-icon>
          </mu-button>
          <mu-button icon color="secondary" @click="del(row)">
            <mu-icon value="delete"></mu-icon>
          </mu-button>
        </td>
      </template>
    </mu-data-table>
    <!-- 编辑任务对话框 -->
    <edit-task
      v-if="editTask.taskId"
      @flush="$emit('flush',null)"
      :open.sync="editOpen"
      :users="users"
      :task-id="editTask.taskId"
    />
  </div>
</template>
<script>
import {
  TASK_PROP_MAP,
  TASK_STATE,
  TASK_LEVEL,
  TASK_DETAIL_PROP_MAP
} from "@/util/const";
import editTask from "./edit-task";
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    start: {
      type: Number,
      required: true
    }
  },
  components: {
    editTask
  },
  data() {
    let columns = Object.keys(TASK_PROP_MAP).map(v => {
      return {
        title: TASK_PROP_MAP[v],
        name: v,
        align: "center",
        sortable: true
      };
    });
    columns.unshift({
      title: "序号",
      align: "center"
    });
    columns.push({
      title: "操作"
    });
    return {
      sort: {
        name: "",
        order: "asc"
      },
      columns,
      editOpen: false,
      TASK_PROP_MAP,
      TASK_STATE,
      TASK_LEVEL,
      TASK_DETAIL_PROP_MAP,
      editTask: {},
      taskDetailList: []
    };
  },
  methods: {
    handleSortChange({ name, order }) {
      this.list = this.list.sort((a, b) => {
        if (typeof a[name] == "string")
          return order === "asc"
            ? a[name].localeCompare(b[name])
            : b[name].localeCompare(a[name]);
        else return order === "asc" ? a[name] - b[name] : b[name] - a[name];
      });
    },
    format(v, propName) {
      if (propName == "taskFinishDate" || propName == "taskPlanFinishDate") {
        return v ? this.dateFormat(new Date(v)) : "";
      } else if (propName == "taskState") {
        return TASK_STATE[v];
      } else if (propName == "taskLevel") {
        return TASK_LEVEL[v];
      }
      return v;
    },
    edit(task) {
      this.editTask = task;
      this.editOpen = true;
    },
    del(task) {
      this.$confirm("确定要删除此任务吗？", "提示", {
        type: "warning"
      }).then(async ({ result }) => {
        if (result) {
          let { data } = await this.$http.get(`task/del?taskId=${task.taskId}`);
          if (data.code == 0) {
            this.$toast.success("删除成功");
            this.$emit("flush", null);
          }
        }
      });
    },
    async getTaskDetail() {
      let { data } = await this.$http.post(`task/query`);
      this.taskDetailList.push(...data.data);
    },
    rowClick(index, row, event) {
      this.editTask = row;
      this.editOpen = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.task-table {
  padding: 0;
}
</style>