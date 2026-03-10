import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BlogCard = ({ post, index }) => {
  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className='block rounded-lg overflow-hidden border transition-all duration-300 hover:scale-[1.02] group'
      style={{
        backgroundColor: 'var(--color-card-bg)',
        borderColor: 'var(--color-border-color)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Cover Image */}
      {post.cover_image && (
        <div className='h-40 overflow-hidden'>
          <img
            src={post.cover_image}
            alt={post.title}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className='p-4'>
        {/* Title */}
        <h3
          className='font-mono font-bold text-lg mb-2 line-clamp-2'
          style={{ color: 'var(--color-heading)' }}
        >
          {post.title}
        </h3>

        {/* Description */}
        <p
          className='text-sm mb-3 line-clamp-2'
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {post.description}
        </p>

        {/* Meta info */}
        <div className='flex items-center justify-between text-xs font-mono'>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            {post.readable_publish_date}
          </span>
          <span style={{ color: 'var(--color-lagoon)' }}>
            {post.reading_time_minutes} min read
          </span>
        </div>

        {/* Tags */}
        <div className='mt-3 flex flex-wrap gap-1'>
          {post.tag_list.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className='px-2 py-0.5 rounded text-xs font-mono'
              style={{
                backgroundColor: 'var(--color-neutral-100)',
                color: 'var(--color-text-primary)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
};

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          'https://dev.to/api/articles?username=tvatdci&per_page=5'
        );
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className='py-24 px-4 md:px-8'>
        <div className='max-w-5xl mx-auto'>
          <motion.div
            className='text-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className='flex justify-center gap-2 mb-4'>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className='w-3 h-3 rounded-full'
                  style={{ backgroundColor: 'var(--color-lagoon)' }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span
              className='font-mono text-sm'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Loading blog posts...
            </span>
          </motion.div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='py-24 px-4 md:px-8'>
        <div className='max-w-5xl mx-auto text-center'>
          <p
            className='font-mono text-sm'
            style={{ color: 'var(--color-coral)' }}
          >
            [ERROR] Failed to load blog posts
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className='py-24 px-4 md:px-8'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <motion.div
          className='mb-12'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Terminal controls */}
          <div className='flex items-center gap-2 mb-6'>
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: 'var(--color-coral)' }}
            />
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: 'var(--color-dusk)' }}
            />
            <div
              className='w-3 h-3 rounded-full'
              style={{ backgroundColor: 'var(--color-lagoon)' }}
            />
            <span
              className='ml-4 text-sm font-mono'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              dev.to_blog.sh
            </span>
          </div>

          <h2
            className='text-3xl md:text-4xl font-bold font-mono mb-4'
            style={{ color: 'var(--color-heading)' }}
          >
            <span className='text-neutral-500 mr-2'>$</span>./fetch_blog_posts
          </h2>

          <p
            className='font-mono text-sm max-w-2xl'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span style={{ color: 'var(--color-ok-400)' }}>➜</span> Thoughts,
            tutorials, and insights from my development journey.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className='grid md:grid-cols-2 gap-6'>
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* View all link */}
        <motion.div
          className='mt-12 text-center'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href='https://dev.to/tvatdci'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 font-mono text-sm transition-colors duration-300 hover:underline'
            style={{ color: 'var(--color-lagoon)' }}
          >
            View all posts on dev.to →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
