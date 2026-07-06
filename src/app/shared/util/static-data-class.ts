import IconsClass from './icons-class';

export default class StaticDataClass {
  static sidebarData = [
    { label: 'Home', icon: IconsClass.home, disabled: false },
    { label: 'Find specialists', icon: IconsClass.search, disabled: false },
    { label: 'My bookings', icon: IconsClass.calendarDays, disabled: false },
    { label: 'Messages', icon: IconsClass.messages, disabled: false },
    { label: 'Profile', icon: IconsClass.user, disabled: false },
    { label: 'Help', icon: IconsClass.help, disabled: false },
  ];
}
