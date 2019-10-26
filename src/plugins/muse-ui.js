import Vue from "vue";
import "muse-ui/lib/styles/base.less";
import Helpers from "muse-ui/lib/Helpers";
import "muse-ui-loading/dist/muse-ui-loading.css"; // load css
import "muse-ui-message/dist/muse-ui-message.css";
import Loading from "muse-ui-loading";
import Toast from "muse-ui-toast";
import Message from "muse-ui-message";
import {
  AppBar,
  Badge,
  Avatar,
  Button,
  theme,
  Form,
  Switch,
  Select,
  Progress,
  Tabs,
  List,
  Drawer,
  TextField,
  Chip,
  Divider,
  DataTable,
  Dialog,
  Paper,
  Snackbar,
  Pagination,
  Grid,
  Icon,
  Stepper,
  SubHeader,
  DateInput,
  LoadMore,
  Menu,
  BottomNav,
  Picker
} from "muse-ui";
import "muse-ui/lib/styles/theme.less";
import * as colors from "muse-ui/lib/theme/colors";
Vue.use(Badge);
Vue.use(LoadMore);
Vue.use(DateInput);
Vue.use(Switch);
Vue.use(Drawer);
Vue.use(Form);
Vue.use(BottomNav);
Vue.use(Select);
Vue.use(Tabs);
Vue.use(Picker);
Vue.use(Menu);
Vue.use(Progress);
Vue.use(Dialog);
Vue.use(List);
Vue.use(Snackbar);
Vue.use(AppBar);
Vue.use(Pagination);
Vue.use(Chip);
Vue.use(Button);
Vue.use(TextField);
Vue.use(Paper);
Vue.use(Divider);
Vue.use(Avatar);
Vue.use(DataTable);
Vue.use(Grid);
Vue.use(Icon);
Vue.use(Stepper);
Vue.use(SubHeader);
Vue.use(Helpers);
Vue.use(Loading);
Vue.use(Toast);
Vue.use(Message);
theme.add("custom-theme", {
  primary: colors.indigo,
  secondary: colors.brown100
});
