import {
  CalendarDaysIcon,
  CircleQuestionMarkIcon,
  HeartIcon,
  HouseIcon,
  LogOutIcon,
  SettingsIcon,
  WalletIcon,
} from 'lucide-angular';

export default class IconsClass {
  static get home() {
    return HouseIcon;
  }

  static get calendarDays() {
    return CalendarDaysIcon;
  }

  static get heart() {
    return HeartIcon;
  }

  static get wallet() {
    return WalletIcon;
  }

  static get settings() {
    return SettingsIcon;
  }

  static get help() {
    return CircleQuestionMarkIcon;
  }

  static get logOut() {
    return LogOutIcon;
  }
}
