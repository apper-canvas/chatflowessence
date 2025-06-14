import ChatsPage from '@/components/pages/ChatsPage';
import ContactsPage from '@/components/pages/ContactsPage';
import SettingsPage from '@/components/pages/SettingsPage';
import ChatViewPage from '@/components/pages/ChatViewPage';

export const routes = {
  chats: {
    id: 'chats',
    label: 'Chats',
    path: '/chats',
    icon: 'MessageCircle',
    component: ChatsPage
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: ContactsPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: SettingsPage
  },
  chatView: {
    id: 'chatView',
    label: 'Chat',
    path: '/chat/:chatId',
    icon: 'MessageSquare',
    component: ChatViewPage,
    hidden: true
  }
};

export const routeArray = Object.values(routes);
export default routes;