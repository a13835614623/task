<template>
  <div class="user-list">
    <mu-sub-header>用户查询</mu-sub-header>
    <div>
      <mu-flex justify-content="center" align-items="center">
        <mu-flex align-items="center">
          <mu-text-field v-model="query.taskName" label="用户名" label-float></mu-text-field>
          <mu-button color="primary" @click="getUserList">
            查询用户
            <mu-icon value="search" />
          </mu-button>
        </mu-flex>
        <mu-flex>
          <mu-button color="green" @click="addUser">
            添加用户
            <mu-icon value="add" />
          </mu-button>
        </mu-flex>
      </mu-flex>
    </div>
    <mu-sub-header>用户列表</mu-sub-header>
    <mu-data-table :columns="columns" :data="userList" class="user-table">
      <template slot-scope="{$index,row}">
        <td class="table-row">{{$index+1}}</td>
        <td
          class="table-row"
          v-for="(v,propName) in USER_PROP_MAP"
          :key="v+propName"
        >{{row[propName]}}</td>
        <td class="table-row">
          <mu-button icon color="secondary" @click="del(row)">
            <mu-icon value="delete"></mu-icon>
          </mu-button>
        </td>
      </template>
    </mu-data-table>
  </div>
</template>

<script>
import { USER_PROP_MAP } from "@/util/const";
export default {
  name: "user",
  created() {
    this.getUserList();
  },
  data() {
    let columns = Object.keys(USER_PROP_MAP).map(v => {
      return {
        title: USER_PROP_MAP[v],
        name: v,
        align: "center"
      };
    });
    columns.unshift({
      title: "序号",
      align: "center"
    });
    columns.push({
      title: "操作",
      align: "center"
    });
    return {
      columns,
      USER_PROP_MAP,
      userList: [],
      query: {}
    };
  },
  methods: {
    async getUserList() {
      let { data } = await this.$http.get(`/user/query/detail`, this.query);
      let countArr = [
        "unFinishedTaskCount",
        "finishedTaskCount",
        "hangTaskCount"
      ];
      this.userList = data.data.map((user, i, arr) => {
        user.finishedTaskCount = 0;
        user.unFinishedTaskCount = 0;
        user.hangTaskCount = 0;
        user.userTaskList.map(task => {
          user[countArr[task.taskState]]++;
        });
        user.userTaskCount =
          user.finishedTaskCount +
          user.unFinishedTaskCount +
          user.hangTaskCount;
        return user;
      });
    },
    del(row) {
      this.$confirm("确定要删除此用户及其所有任务吗？", "提示", {
        type: "warning"
      }).then(async ({ result }) => {
        if (result) {
          let {data} = await this.$http.get(`user/del?userId=${row.userId}`);
          if(data.code==0)
          this.$toast.success(data.msg);
        }
      });
    },
    addUser() {
      this.$prompt("请输入用户名", "提示", {
        validator(value) {
          return {
            valid: value && value != "",
            message: "用户名不能为空!"
          };
        }
      }).then(async ({ result, value }) => {
        if (result) {
          try {
            await this.$http.get(`user/add?userName=${value}`);
            this.$toast.success('添加成功');
          } catch (error) {
            console.log(error)
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  .user-table {
    width: 100%;
  }
  .mu-button{
    margin-left: 20px;
  }
}
</style>