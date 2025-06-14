import { NavLink, Outlet, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { routes } from "@/config/routes";

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
  }, [location.pathname]);

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
        <aside className="hidden lg:flex w-80 glass border-r border-white/20 flex-col z-40 shadow-glass">
          {/* Desktop Header */}
          <div className="flex-shrink-0 h-16 bg-gradient-primary shadow-lg border-b border-white/20">
            <div className="flex items-center justify-between h-full px-6">
              <h1 className="text-white text-xl font-bold float-animation">ChatFlow</h1>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                  <ApperIcon name="Search" size={18} />
                </button>
                <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                  <ApperIcon name="MoreVertical" size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
{/* Desktop Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {visibleRoutes.map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={20} />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

{/* Mobile Navigation Drawer */}
        <aside
          className={`lg:hidden fixed left-0 top-16 bottom-0 w-80 glass border-r border-white/20 z-50 transform transition-all duration-500 ease-out shadow-glass ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
<nav className="h-full overflow-y-auto p-4">
            <div className="space-y-2">
              {visibleRoutes.map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={20} />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-background">
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