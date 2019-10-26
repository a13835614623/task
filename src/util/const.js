const TASK_PROP_MAP = {
  taskName: "任务名称",
  taskOwnerName: "负责人",
  taskState: "状态",
  taskPlanFinishDate: "计划完成时间",
  taskCostTime: "实际消耗时间(天)",
  taskFinishDate: "实际完成时间",
  taskLevel: "优先级",
  taskRemark: "备注"
};
const TASK_DETAIL_PROP_MAP = {
  taskName: "子任务名称",
  taskState: "状态",
  taskPlanFinishDate: "计划完成时间",
  taskCostTime: "实际消耗时间(天)",
  taskFinishDate: "实际完成时间",
  taskLevel: "优先级",
  taskRemark: "备注"
};
const TASK_STATE = ["未完成", "完成", "挂起"];
const TASK_LEVEL = ["低", "中", "高"];
const USER_PROP_MAP = {
  userName: "用户名称",
  userTaskCount: "任务总数",
  unFinishedTaskCount: "未完成任务数",
  finishedTaskCount: "已完成任务数",
  hangTaskCount: "挂起任务数"
};
export {
  TASK_PROP_MAP,
  TASK_STATE,
  TASK_LEVEL,
  TASK_DETAIL_PROP_MAP,
  USER_PROP_MAP
};
