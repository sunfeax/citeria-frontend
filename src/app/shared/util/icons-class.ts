import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleAlertIcon,
  CircleQuestionMarkIcon,
  EyeIcon,
  EyeOffIcon,
  HeartIcon,
  HouseIcon,
  InfoIcon,
  LoaderCircleIcon,
  LogOutIcon,
  MessagesSquareIcon,
  SettingsIcon,
  TriangleAlertIcon,
  WalletIcon,
  XIcon,
  ZapIcon,
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

  static get messages() {
    return MessagesSquareIcon;
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

  static get zap() {
    return ZapIcon;
  }

  static get eye() {
    return EyeIcon;
  }

  static get eyeOff() {
    return EyeOffIcon;
  }

  static get info() {
    return InfoIcon;
  }

  static get checkCircle() {
    return CheckCircle2Icon;
  }

  static get circleAlert() {
    return CircleAlertIcon;
  }

  static get triangleAlert() {
    return TriangleAlertIcon;
  }

  static get close() {
    return XIcon;
  }

  static get loaderCircle() {
    return LoaderCircleIcon;
  }
}
