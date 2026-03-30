import { useState } from 'react';
import { motion } from 'framer-motion';
import { TerminalHeader } from '../components/primitives';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  
  // Get user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const tabs = [
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'blog', label: 'Blog Posts', icon: '📝' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className='min-h-screen px-4 py-20 md:px-8 lg:px-12'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='terminal-window bg-outer-glow'>
            <div className='terminal-window__header bg-surface-base'>
              <TerminalHeader filename='admin_dashboard.exe — system_ready' />
            </div>
            <div className='p-6'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='w-12 h-12 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center'>
                  <span className='text-2xl'>👨‍💻</span>
                </div>
                <div>
                  <h1 className='font-dune text-2xl text-heading'>Admin Dashboard</h1>
                  <p className='font-mono text-sm text-text-secondary'>
                    Welcome back, {user.email} | Role: {user.role?.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className='flex gap-2 mt-4'>
                <div className='px-3 py-1 rounded font-mono text-xs bg-green-500/20 text-green-500 border border-green-500/30'>
                  [ONLINE]
                </div>
                <div className='px-3 py-1 rounded font-mono text-xs bg-brand-primary/20 text-brand-primary border border-brand-primary/30'>
                  [ADMIN ACCESS]
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className='flex gap-2 mb-6'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded font-mono text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-primary text-text-base'
                  : 'bg-surface-base text-text-secondary hover:text-text-primary border border-border-default'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='terminal-window'
        >
          <div className='terminal-window__header bg-surface-base'>
            <TerminalHeader filename={`${activeTab}_manager.exe — ready`} />
          </div>
          <div className='p-6'>
            {activeTab === 'projects' && (
              <div>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='font-dune text-xl text-heading'>Manage Projects</h2>
                  <button className='px-4 py-2 rounded font-mono text-sm bg-brand-primary text-text-base hover:opacity-90 transition-opacity'>
                    [+ ADD PROJECT]
                  </button>
                </div>
                
                <div className='space-y-4'>
                  <div className='p-4 rounded border border-border-default bg-surface-base/50'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-mono text-sm text-text-primary'>fourflavoursexpress</h3>
                        <p className='font-mono text-xs text-text-secondary mt-1'>
                          Food delivery application with React and Node.js
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <button className='px-3 py-1 rounded font-mono text-xs bg-brand-accent/20 text-brand-accent border border-brand-accent/30 hover:opacity-80'>
                          [EDIT]
                        </button>
                        <button className='px-3 py-1 rounded font-mono text-xs bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30 hover:opacity-80'>
                          [DELETE]
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className='p-4 rounded border border-border-default bg-surface-base/50'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-mono text-sm text-text-primary'>natours-2025 SSR</h3>
                        <p className='font-mono text-xs text-text-secondary mt-1'>
                          Node.js backend application with Express and MongoDB
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <button className='px-3 py-1 rounded font-mono text-xs bg-brand-accent/20 text-brand-accent border border-brand-accent/30 hover:opacity-80'>
                          [EDIT]
                        </button>
                        <button className='px-3 py-1 rounded font-mono text-xs bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30 hover:opacity-80'>
                          [DELETE]
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className='p-4 rounded border border-dashed border-border-default'>
                    <p className='font-mono text-xs text-text-muted text-center'>
                      Future: Projects will be stored in MongoDB with Cloudinary image uploads
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'blog' && (
              <div>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='font-dune text-xl text-heading'>Manage Blog Posts</h2>
                  <button className='px-4 py-2 rounded font-mono text-sm bg-brand-primary text-text-base hover:opacity-90 transition-opacity'>
                    [+ NEW POST]
                  </button>
                </div>
                
                <div className='space-y-4'>
                  <div className='p-4 rounded border border-dashed border-border-default'>
                    <p className='font-mono text-xs text-text-muted text-center'>
                      Blog posts will be loaded from dev.to API or stored in MongoDB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className='font-dune text-xl text-heading mb-6'>System Settings</h2>
                
                <div className='space-y-4 font-mono text-sm'>
                  <div className='flex items-center justify-between p-4 rounded border border-border-default bg-surface-base/50'>
                    <div>
                      <p className='text-text-primary'>Database Connection</p>
                      <p className='text-xs text-text-secondary mt-1'>
                        MongoDB Atlas (newport cluster)
                      </p>
                    </div>
                    <div className='px-3 py-1 rounded font-mono text-xs bg-green-500/20 text-green-500 border border-green-500/30'>
                      [CONNECTED]
                    </div>
                  </div>
                  
                  <div className='flex items-center justify-between p-4 rounded border border-border-default bg-surface-base/50'>
                    <div>
                      <p className='text-text-primary'>Cloudinary Integration</p>
                      <p className='text-xs text-text-secondary mt-1'>
                        Image upload service
                      </p>
                    </div>
                    <div className='px-3 py-1 rounded font-mono text-xs bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'>
                      [PENDING]
                    </div>
                  </div>
                  
                  <div className='flex items-center justify-between p-4 rounded border border-border-default bg-surface-base/50'>
                    <div>
                      <p className='text-text-primary'>Admin Account</p>
                      <p className='text-xs text-text-secondary mt-1'>
                        {user.email}
                      </p>
                    </div>
                    <div className='px-3 py-1 rounded font-mono text-xs bg-brand-primary/20 text-brand-primary border border-brand-primary/30'>
                      [ACTIVE]
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer Info */}
        <div className='mt-8 p-4 rounded border border-border-default bg-surface-base/30'>
          <p className='font-mono text-xs text-text-secondary'>
            <span className='text-brand-primary'>$</span> Admin Dashboard v1.0 | Future enhancements: Cloudinary image uploads, full CRUD operations for projects and blog posts
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
