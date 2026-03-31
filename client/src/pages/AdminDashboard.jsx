import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalHeader } from '../components/primitives';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    projects: 0,
    users: 0,
    messages: { total: 0, unread: 0 },
  });

  // Get user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const tabs = [
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'messages', label: 'Messages', icon: '✉️' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch projects
      const projectsRes = await api.get('/projects');
      if (projectsRes.success) {
        setProjects(projectsRes.data || []);
        setStats((prev) => ({ ...prev, projects: projectsRes.data?.length || 0 }));
      }

      // Fetch messages
      const messagesRes = await api.get('/contact/messages');
      if (messagesRes.success) {
        setMessages(messagesRes.data || []);
        const unreadCount = messagesRes.data?.filter((m) => !m.read).length || 0;
        setStats((prev) => ({
          ...prev,
          messages: { total: messagesRes.data?.length || 0, unread: unreadCount },
        }));
      }

      // Fetch users
      const usersRes = await api.get('/users');
      if (usersRes.success) {
        setUsers(usersRes.data || []);
        setStats((prev) => ({ ...prev, users: usersRes.data?.length || 0 }));
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, read) => {
    try {
      const res = await api.patch(`/contact/${id}/read`, { read });
      if (res.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, read } : msg))
        );
        // Update stats
        const unreadCount = messages.filter((m) => m._id !== id && !m.read).length + (read ? 0 : 1);
        setStats((prev) => ({
          ...prev,
          messages: { ...prev.messages, unread: unreadCount },
        }));
      }
    } catch (err) {
      console.error('Failed to update message:', err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await api.delete(`/contact/${id}`);
      if (res.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        setStats((prev) => ({
          ...prev,
          messages: { ...prev.messages, total: prev.messages.total - 1 },
        }));
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        setStats((prev) => ({ ...prev, projects: prev.projects - 1 }));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='font-mono text-brand-primary'>Loading admin panel...</div>
      </div>
    );
  }

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
                  <h1 className='font-dune text-2xl text-heading'>
                    Admin Dashboard
                  </h1>
                  <p className='font-mono text-sm text-text-secondary'>
                    Welcome back, {user.email} | Role:{' '}
                    {user.role?.toUpperCase()}
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

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
        >
          <StatCard
            title='Projects'
            value={stats.projects}
            icon='📁'
            color='bg-brand-primary'
          />
          <StatCard
            title='Users'
            value={stats.users}
            icon='👥'
            color='bg-dusk'
          />
          <StatCard
            title='Messages'
            value={stats.messages.total}
            subtitle={`${stats.messages.unread} unread`}
            icon='✉️'
            color='bg-coral'
          />
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
              {tab.id === 'messages' && stats.messages.unread > 0 && (
                <span className='ml-2 px-2 py-0.5 rounded bg-coral text-text-base text-xs'>
                  {stats.messages.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode='wait'>
          {activeTab === 'projects' && (
            <ProjectsTab
              key='projects'
              projects={projects}
              onDelete={handleDeleteProject}
              onRefresh={fetchAllData}
            />
          )}
          {activeTab === 'messages' && (
            <MessagesTab
              key='messages'
              messages={messages}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteMessage}
            />
          )}
          {activeTab === 'users' && <UsersTab key='users' users={users} />}
          {activeTab === 'settings' && <SettingsTab key='settings' user={user} />}
        </AnimatePresence>

        {/* Footer Info */}
        <div className='mt-8 p-4 rounded border border-border-default bg-surface-base/30'>
          <p className='font-mono text-xs text-text-secondary'>
            <span className='text-brand-primary'>$</span> Admin Dashboard v2.0 |
            Contact messages now integrated with MongoDB
          </p>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className='p-6 rounded border bg-surface-elevated border-border-default'
    whileHover={{ y: -2 }}
  >
    <div className='flex items-start justify-between'>
      <div>
        <p className='font-mono text-xs uppercase tracking-wider mb-1 text-text-muted'>
          {title}
        </p>
        <p className={`text-3xl font-bold ${color.replace('bg-', 'text-')}`}>
          {value}
        </p>
        {subtitle && (
          <p className='text-sm mt-1 text-text-muted'>{subtitle}</p>
        )}
      </div>
      <span className='text-2xl'>{icon}</span>
    </div>
  </motion.div>
);

// Projects Tab
const ProjectsTab = ({ projects, onDelete, onRefresh }) => (
  <motion.div
    key='projects'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className='terminal-window'
  >
    <div className='terminal-window__header bg-surface-base'>
      <TerminalHeader filename='projects_manager.exe — ready' />
    </div>
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='font-dune text-xl text-heading'>Manage Projects</h2>
        <button
          onClick={onRefresh}
          className='px-4 py-2 rounded font-mono text-sm bg-brand-primary text-text-base hover:opacity-90 transition-opacity'
        >
          [REFRESH]
        </button>
      </div>

      <div className='space-y-4'>
        {projects.map((project) => (
          <div
            key={project._id}
            className='p-4 rounded border border-border-default bg-surface-base/50'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-mono text-sm text-text-primary'>
                  {project.title}
                </h3>
                <p className='font-mono text-xs text-text-secondary mt-1'>
                  {project.category} | {project.description?.substring(0, 60)}...
                </p>
              </div>
              <div className='flex gap-2'>
                <button className='px-3 py-1 rounded font-mono text-xs bg-brand-accent/20 text-brand-accent border border-brand-accent/30 hover:opacity-80'>
                  [EDIT]
                </button>
                <button
                  onClick={() => onDelete(project._id)}
                  className='px-3 py-1 rounded font-mono text-xs bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30 hover:opacity-80'
                >
                  [DELETE]
                </button>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className='p-4 rounded border border-dashed border-border-default'>
            <p className='font-mono text-xs text-text-muted text-center'>
              No projects found. Use `npm run seed:projects` in server directory
              to seed sample projects.
            </p>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

// Messages Tab
const MessagesTab = ({ messages, onMarkAsRead, onDelete }) => (
  <motion.div
    key='messages'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className='terminal-window'
  >
    <div className='terminal-window__header bg-surface-base'>
      <TerminalHeader filename='messages_manager.exe — ready' />
    </div>
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='font-dune text-xl text-heading'>
          Contact Messages ({messages.length})
        </h2>
      </div>

      <div className='space-y-4'>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-4 rounded border transition-all ${
              msg.read
                ? 'border-border-default bg-surface-base/30 opacity-70'
                : 'border-brand-primary bg-surface-base'
            }`}
          >
            <div className='flex items-start justify-between mb-3'>
              <div>
                <h3 className='font-mono text-sm text-text-primary'>
                  {msg.name}
                </h3>
                <p className='font-mono text-xs text-brand-primary mt-1'>
                  {msg.email}
                </p>
              </div>
              <div className='text-right'>
                <p className='font-mono text-xs text-text-muted'>
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
                {msg.read && (
                  <p className='font-mono text-xs text-green-500'>✓ Read</p>
                )}
              </div>
            </div>
            <p className='font-mono text-sm text-text-secondary mb-4'>
              {msg.message}
            </p>
            <div className='flex gap-2'>
              <button
                onClick={() => onMarkAsRead(msg._id, !msg.read)}
                className={`px-3 py-1 rounded font-mono text-xs border transition-colors ${
                  msg.read
                    ? 'bg-surface-base text-text-muted border-border-default'
                    : 'bg-brand-primary text-text-base border-brand-primary'
                }`}
              >
                {msg.read ? 'Mark Unread' : 'Mark Read'}
              </button>
              <button
                onClick={() => onDelete(msg._id)}
                className='px-3 py-1 rounded font-mono text-xs border border-brand-secondary text-brand-secondary hover:opacity-80'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className='p-8 rounded border border-dashed border-border-default text-center'>
            <p className='font-mono text-sm text-text-muted'>No messages yet</p>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

// Users Tab
const UsersTab = ({ users }) => (
  <motion.div
    key='users'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className='terminal-window'
  >
    <div className='terminal-window__header bg-surface-base'>
      <TerminalHeader filename='users_manager.exe — ready' />
    </div>
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='font-dune text-xl text-heading'>
          Registered Users ({users.length})
        </h2>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-border-default'>
              <th className='px-4 py-3 text-left font-mono text-xs text-text-muted uppercase'>
                Email
              </th>
              <th className='px-4 py-3 text-left font-mono text-xs text-text-muted uppercase'>
                Role
              </th>
              <th className='px-4 py-3 text-left font-mono text-xs text-text-muted uppercase'>
                Registered
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border-default'>
            {users.map((user) => (
              <tr key={user._id}>
                <td className='px-4 py-3 font-mono text-sm text-text-primary'>
                  {user.email}
                </td>
                <td className='px-4 py-3'>
                  <span
                    className={`px-2 py-1 rounded font-mono text-xs ${
                      user.role === 'admin'
                        ? 'bg-brand-primary text-text-base'
                        : 'bg-surface-base text-text-muted border border-border-default'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className='px-4 py-3 font-mono text-sm text-text-muted'>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan='3'
                  className='px-4 py-8 text-center font-mono text-sm text-text-muted'
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

// Settings Tab
const SettingsTab = ({ user }) => (
  <motion.div
    key='settings'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className='terminal-window'
  >
    <div className='terminal-window__header bg-surface-base'>
      <TerminalHeader filename='system_settings.exe — ready' />
    </div>
    <div className='p-6'>
      <h2 className='font-dune text-xl text-heading mb-6'>System Settings</h2>

      <div className='space-y-4 font-mono text-sm'>
        <div className='flex items-center justify-between p-4 rounded border border-border-default bg-surface-base/50'>
          <div>
            <p className='text-text-primary'>Database Connection</p>
            <p className='text-xs text-text-secondary mt-1'>
              MongoDB Atlas (framer-port cluster)
            </p>
          </div>
          <div className='px-3 py-1 rounded font-mono text-xs bg-green-500/20 text-green-500 border border-green-500/30'>
            [CONNECTED]
          </div>
        </div>

        <div className='flex items-center justify-between p-4 rounded border border-border-default bg-surface-base/50'>
          <div>
            <p className='text-text-primary'>Contact Messages</p>
            <p className='text-xs text-text-secondary mt-1'>
              MongoDB persistence with read/unread status
            </p>
          </div>
          <div className='px-3 py-1 rounded font-mono text-xs bg-green-500/20 text-green-500 border border-green-500/30'>
            [ACTIVE]
          </div>
        </div>

        <div className='flex items-center justify-between p-4 rounded border border-border-default bg-surface-base/50'>
          <div>
            <p className='text-text-primary'>Admin Account</p>
            <p className='text-xs text-text-secondary mt-1'>{user.email}</p>
          </div>
          <div className='px-3 py-1 rounded font-mono text-xs bg-brand-primary/20 text-brand-primary border border-brand-primary/30'>
            [ACTIVE]
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default AdminDashboard;
