import { NavLink, Outlet, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { routes } from "@/config/routes";

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  const visibleRoutes = Object.values(routes).filter(route => !route.hidden);
  const currentRoute = Object.values(routes).find(route => {
    if (route.path.includes(':')) {
      const pathPattern = route.path.replace(':chatId', '[^/]+');
      const regex = new RegExp(`^${pathPattern}$`);
      return regex.test(location.pathname);
    }
    return location.pathname === route.path;
  });

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
  }, [location.pathname]);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMoreMenuOpen && !event.target.closest('.more-menu-container')) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMoreMenuOpen]);

  const isOnChatView = location.pathname.startsWith('/chat/');

  return (
<div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      {/* Mobile Header */}
      <header className="lg:hidden flex-shrink-0 h-16 bg-gradient-primary shadow-lg border-b border-white/20 z-40">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-3">
            {isOnChatView && (
              <button
                onClick={() => window.history.back()}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={20} />
              </button>
            )}
            <h1 className="text-white text-lg font-semibold">
              {currentRoute?.label || 'ChatFlow'}
            </h1>
          </div>
          
          {!isOnChatView && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
<div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 glass border-r border-white/20 flex-col z-40 shadow-glass">
          {/* Desktop Header */}
          <div className="flex-shrink-0 h-16 bg-gradient-primary shadow-lg border-b border-white/20">
            <div className="flex items-center justify-between h-full px-6">
              <h1 className="text-white text-xl font-bold float-animation">ChatFlow</h1>
<div className="flex items-center space-x-2">
                <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                  <ApperIcon name="Search" size={18} />
                </button>
                <div className="relative more-menu-container">
                  <button 
                    onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ApperIcon name="MoreVertical" size={18} />
                  </button>
                  
                  {/* More Menu Dropdown */}
                  {isMoreMenuOpen && (
                    <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          // Handle settings action
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                      >
                        <ApperIcon name="Settings" size={16} />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          // Handle help action
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                      >
                        <ApperIcon name="HelpCircle" size={16} />
                        <span>Help & Support</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          // Handle about action
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                      >
                        <ApperIcon name="Info" size={16} />
                        <span>About</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
{/* Desktop Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {visibleRoutes.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm font-medium'
                        : 'text-gray-800 hover:bg-white/10 hover:text-gray-900'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
</aside>
        <aside
          className={`lg:hidden fixed left-0 top-16 bottom-0 w-64 glass border-r border-white/20 z-50 transform transition-all duration-500 ease-out shadow-glass ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="h-full overflow-y-auto p-4">
            <div className="space-y-2">
              {visibleRoutes.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm font-medium'
                        : 'text-gray-800 hover:bg-white/10 hover:text-gray-900'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
</div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-background relative max-w-4xl mx-auto">
          <Outlet />
        </main>
      </div>
{/* Mobile Bottom Navigation - Only show when not in chat view */}
      {!isOnChatView && (
        <nav className="lg:hidden flex-shrink-0 glass border-t border-white/20 z-40 shadow-soft">
          <div className="flex">
            {visibleRoutes.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={20} />
                <span className="text-xs font-medium mt-1">{route.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;