// assets
import { IconDashboard, IconNote } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconNote };


const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'cvList',
      title: 'CV List',
      type: 'item',
      url: '/cv-list',
      icon: icons.IconNote,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
