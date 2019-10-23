<template>
  <div class="task-table">
    <mu-data-table
      :columns="columns"
      :sort.sync="sort"
      class="table"
      @sort-change="handleSortChange"
      :data="list"
    >
      <template slot-scope="{ row,$index }">
        <td class="table-row">{{$index+1}}</td>
        <td
          v-for="(label,propName) in TASK_PROP_MAP"
          :key="propName"
          class="table-row"
        >{{format(row[propName],propName)}}</td>
        <td>
          <mu-button icon color="primary" @click="edit(row.parentTask)">
            <mu-icon value="edit"></mu-icon>
          </mu-button>
          <mu-button icon color="secondary">
            <mu-icon value="delete"></mu-icon>
          </mu-button>
        </td>
      </template>
    </mu-data-table>
    <edit-task v-if="parentTask" :open.sync="open" :users="users" :parent-task="parentTask" />
  </div>
</template>
<script>
import { TASK_PROP_MAP, TASK_STATE, TASK_LEVEL } from "@/util/const";
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
        align: "center"
      };
    });
    columns.unshift({
      title: "序号",
      align: "center"
    });
    columns.push({
      title: "操作"
      // width:100
    });
    return {
      sort: {
        name: "",
        order: "asc"
      },
      columns,
      open: false,
      TASK_PROP_MAP,
      TASK_STATE,
      TASK_LEVEL,
      parentTask: ""
    };
  },
  methods: {
    handleSortChange({ name, order }) {
      this.list = this.list.sort((a, b) =>
        order === "asc" ? a[name] - b[name] : b[name] - a[name]
      );
    },
    getCostDate(task) {
      if (!task || !task.taskFinishDate || !task.taskPlanFinishDate) return 0;
      return (
        (task.taskPlanFinishDate.getTime() - task.taskFinishDate.getTime()) /
        60 /
        60 /
        24
      );
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
    edit(parentTask) {
      this.parentTask = parentTask;
      this.open = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.task-table {
  min-width: 1450px;
  margin: 0 auto;
  .table-row {
    text-align: center;
  }
  .mu-table td {
    padding: 10px;
  }
}
</style>