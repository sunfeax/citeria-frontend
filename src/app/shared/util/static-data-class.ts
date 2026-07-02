import IconsClass from './icons-class';

export default class StaticDataClass {
  static sidebarData = [
    { label: 'Home', icon: IconsClass.home, disabled: false },
    { label: 'My bookings', icon: IconsClass.calendarDays, disabled: false },
    { label: 'Favorite specialists', icon: IconsClass.heart, disabled: false },
    { label: 'Payments', icon: IconsClass.wallet, disabled: false },
    { label: 'Settings', icon: IconsClass.settings, disabled: false },
    { label: 'Help', icon: IconsClass.help, disabled: false },
  ];
}
