import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalHeader } from '../components/primitives';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const AdminDashboard = () => {
  const { showNotification } = useAuth();
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

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    imageUrl: '',
    projectUrl: '',
    tags: '',
    featured: false,
  });

  // Get user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const tabs = [
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'messages', label: 'Messages', icon: '✉️' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const categories = [
    'Frontend',
    'Backend',
    'MERN',
    'APIs',
    'Experiments',
    'Other',
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
        setStats((prev) => ({
          ...prev,
          projects: projectsRes.data?.length || 0,
        }));
      }

      // Fetch messages
      const messagesRes = await api.get('/contact/messages');
      if (messagesRes.success) {
        setMessages(messagesRes.data || []);
        const unreadCount =
          messagesRes.data?.filter((m) => !m.read).length || 0;
        setStats((prev) => ({
          ...prev,
          messages: {
            total: messagesRes.data?.length || 0,
            unread: unreadCount,
          },
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
      showNotification('[ERROR] Failed to load dashboard data', 'error');
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
        const unreadCount =
          messages.filter((m) => m._id !== id && !m.read).length +
          (read ? 0 : 1);
        setStats((prev) => ({
          ...prev,
          messages: { ...prev.messages, unread: unreadCount },
        }));
        showNotification(
          `[SUCCESS] Message marked as ${read ? 'read' : 'unread'}`
        );
      }
    } catch (err) {
      console.error('Failed to update message:', err);
      showNotification('[ERROR] Failed to update message', 'error');
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
        showNotification('[SUCCESS] Message deleted successfully');
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
      showNotification('[ERROR] Failed to delete message', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        setStats((prev) => ({ ...prev, projects: prev.projects - 1 }));
        showNotification('[SUCCESS] Project deleted successfully');
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
      showNotification('[ERROR] Failed to delete project', 'error');
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedProject(null);
    setFormData({
      title: '',
      description: '',
      category: 'Other',
      imageUrl: '',
      projectUrl: '',
      tags: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setModalMode('edit');
    setSelectedProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      category: project.category || 'Other',
      imageUrl: project.imageUrl || '',
      projectUrl: project.projectUrl || '',
      tags: project.tags?.join(', ') || '',
      featured: project.featured || false,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();

    const projectData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      if (modalMode === 'add') {
        const res = await api.post('/projects', projectData);
        if (res.success) {
          setProjects((prev) => [res.data, ...prev]);
          setStats((prev) => ({ ...prev, projects: prev.projects + 1 }));
          showNotification('[SUCCESS] Project created successfully');
        }
      } else {
        const res = await api.put(
          `/projects/${selectedProject._id}`,
          projectData
        );
        if (res.success) {
          setProjects((prev) =>
            prev.map((p) => (p._id === selectedProject._id ? res.data : p))
          );
          showNotification('[SUCCESS] Project updated successfully');
        }
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save project:', err);
      showNotification('[ERROR] Failed to save project', 'error');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='font-mono text-brand-primary'>
          Loading admin panel...
        </div>
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
              onAdd={openAddModal}
              onEdit={openEditModal}
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
          {activeTab === 'settings' && (
            <SettingsTab key='settings' user={user} />
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <div className='mt-8 p-4 rounded border border-border-default bg-surface-base/30'>
          <p className='font-mono text-xs text-text-secondary'>
            <span className='text-brand-primary'>$</span> Admin Dashboard v2.0 |
            Contact messages now integrated with MongoDB
          </p>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmitProject}
        categories={categories}
      />
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
        {subtitle && <p className='text-sm mt-1 text-text-muted'>{subtitle}</p>}
      </div>
      <span className='text-2xl'>{icon}</span>
    </div>
  </motion.div>
);

// Projects Tab
const ProjectsTab = ({ projects, onDelete, onRefresh, onAdd, onEdit }) => (
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
        <div className='flex gap-2'>
          <button
            onClick={onAdd}
            className='px-4 py-2 rounded font-mono text-sm bg-green-500 text-text-base hover:opacity-90 transition-opacity'
          >
            [ADD PROJECT]
          </button>
          <button
            onClick={onRefresh}
            className='px-4 py-2 rounded font-mono text-sm bg-brand-primary text-text-base hover:opacity-90 transition-opacity'
          >
            [REFRESH]
          </button>
        </div>
      </div>

      <div className='space-y-4'>
        {projects.map((project) => (
          <div
            key={project._id}
            className='p-4 rounded border border-border-default bg-surface-base/50'
          >
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-1'>
                  <h3 className='font-mono text-sm text-text-primary'>
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className='px-2 py-0.5 rounded font-mono text-xs bg-brand-accent/20 text-brand-accent border border-brand-accent/30'>
                      ⭐ FEATURED
                    </span>
                  )}
                </div>
                <p className='font-mono text-xs text-text-secondary'>
                  {project.category} | {project.description?.substring(0, 60)}
                  ...
                </p>
                <div className='flex gap-1 mt-2'>
                  {project.tags?.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className='px-2 py-0.5 rounded font-mono text-xs bg-surface-elevated text-text-muted border border-border-default'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className='flex gap-2 ml-4'>
                <button
                  onClick={() => onEdit(project)}
                  className='px-3 py-1 rounded font-mono text-xs bg-brand-accent/20 text-brand-accent border border-brand-accent/30 hover:opacity-80'
                >
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
              No projects found. Click [ADD PROJECT] to create one.
            </p>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

// Project Modal Component
const ProjectModal = ({
  isOpen,
  onClose,
  mode,
  formData,
  onChange,
  onSubmit,
  categories,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className='w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-border-default bg-surface-base shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='terminal-window__header bg-surface-elevated p-4 border-b border-border-default'>
          <h3 className='font-dune text-lg text-heading'>
            {mode === 'add' ? '➕ Add New Project' : '✏️ Edit Project'}
          </h3>
        </div>

        <form onSubmit={onSubmit} className='p-6 space-y-4'>
          <div>
            <label className='block font-mono text-xs text-text-muted mb-1'>
              Title *
            </label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={onChange}
              required
              minLength={3}
              maxLength={100}
              className='w-full px-3 py-2 rounded border border-border-default bg-surface-elevated text-text-primary font-mono text-sm focus:outline-none focus:border-brand-primary'
              placeholder='Project title...'
            />
          </div>

          <div>
            <label className='block font-mono text-xs text-text-muted mb-1'>
              Description *
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={onChange}
              required
              minLength={10}
              maxLength={500}
              rows={4}
              className='w-full px-3 py-2 rounded border border-border-default bg-surface-elevated text-text-primary font-mono text-sm focus:outline-none focus:border-brand-primary resize-none'
              placeholder='Project description (min 10 chars)...'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block font-mono text-xs text-text-muted mb-1'>
                Category
              </label>
              <select
                name='category'
                value={formData.category}
                onChange={onChange}
                className='w-full px-3 py-2 rounded border border-border-default bg-surface-elevated text-text-primary font-mono text-sm focus:outline-none focus:border-brand-primary'
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block font-mono text-xs text-text-muted mb-1'>
                Tags (comma separated)
              </label>
              <input
                type='text'
                name='tags'
                value={formData.tags}
                onChange={onChange}
                className='w-full px-3 py-2 rounded border border-border-default bg-surface-elevated text-text-primary font-mono text-sm focus:outline-none focus:border-brand-primary'
                placeholder='react, node, mongodb...'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block font-mono text-xs text-text-muted mb-1'>
                Image URL
              </label>
              <input
                type='url'
                name='imageUrl'
                value={formData.imageUrl}
                onChange={onChange}
                className='w-full px-3 py-2 rounded border border-border-default bg-surface-elevated text-text-primary font-mono text-sm focus:outline-none focus:border-brand-primary'
                placeholder='https://example.com/image.jpg'
              />
            </div>

            <div>
              <label className='block font-mono text-xs text-text-muted mb-1'>
                Project URL
              </label>
              <input
                type='url'
                name='projectUrl'
                value={formData.projectUrl}
                onChange={onChange}
                className='w-full px-3 py-2 rounded border border-border-default bg-surface-elevated text-text-primary font-mono text-sm focus:outline-none focus:border-brand-primary'
                placeholder='https://github.com/...'
              />
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              name='featured'
              id='featured'
              checked={formData.featured}
              onChange={onChange}
              className='w-4 h-4 rounded border-border-default bg-surface-elevated text-brand-primary focus:ring-brand-primary'
            />
            <label
              htmlFor='featured'
              className='font-mono text-sm text-text-secondary'
            >
              Featured project (shown first)
            </label>
          </div>

          <div className='flex gap-3 pt-4 border-t border-border-default'>
            <button
              type='submit'
              className='flex-1 px-4 py-2 rounded font-mono text-sm bg-brand-primary text-text-base hover:opacity-90 transition-opacity'
            >
              {mode === 'add' ? '[CREATE PROJECT]' : '[SAVE CHANGES]'}
            </button>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded font-mono text-sm bg-surface-elevated text-text-secondary border border-border-default hover:bg-surface-base transition-colors'
            >
              [CANCEL]
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

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
