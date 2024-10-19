import { Icon } from "@tabler/icons-vue";

export default interface ISidebarMenu {
  name: string;
  icon: Icon;
  route: string;
  isActive?: boolean;
  isDisabled?: boolean;
}
