import { motion } from 'framer-motion';
import TerminalHeader from './primitives/TerminalHeader';
import { useAsyncOperation } from '../hooks';
import { FADE_UP, FADE_IN, TRANSITION_NORMAL } from '../utils/motionPresets';
import { api } from '../services';

const fetchBlogPosts = () => api.blog.getPosts('tvatdci', 5);

const BlogCard = ({ post, index }) => {
  return (
    <motion.a
      href={post.url}
      target='_blank'
      rel='noopener noreferrer'
      className='terminal-window bg-card-bg block transition-all duration-300 hover:scale-[1.02] group'
      variants={FADE_UP}
      initial='hidden'
      whileInView='visible'
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
            loading='lazy'
          />
        </div>
      )}

      {/* Content */}
      <div className='p-4'>
        {/* Title */}
        <h3 className='font-mono font-bold text-lg mb-2 line-clamp-2 text-heading'>
          {post.title}
        </h3>

        {/* Description */}
        <p className='text-sm mb-3 line-clamp-2 text-text-secondary'>
          {post.description}
        </p>

        {/* Meta info */}
        <div className='flex items-center justify-between text-xs font-mono'>
          <span className='text-text-secondary'>
            {post.readable_publish_date}
          </span>
          <span className='text-lagoon'>
            {post.reading_time_minutes} min read
          </span>
        </div>

        {/* Tags */}
        <div className='mt-3 flex flex-wrap gap-1'>
          {post.tag_list.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className='px-2 py-0.5 rounded text-xs font-mono bg-neutral-100 text-text-primary'
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
  const { loading, error, data } = useAsyncOperation(fetchBlogPosts, []);
  const posts = data || [];

  if (loading) {
    return (
      <section className='py-24 px-4 md:px-8'>
        <div className='max-w-5xl mx-auto'>
          <motion.div
            className='text-center'
            variants={FADE_IN}
            initial='hidden'
            animate='visible'
          >
            <div className='flex justify-center gap-2 mb-4'>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className='w-3 h-3 rounded-full bg-lagoon'
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className='font-mono text-sm text-text-secondary'>
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
          <p className='font-mono text-sm text-coral'>
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
          <TerminalHeader
            filename='dev.to_blog.sh'
            className='mb-6'
            labelClassName='text-sm'
          />

          <h2 className='text-3xl md:text-4xl font-bold font-mono mb-4 text-heading'>
            <span className='text-neutral-500 mr-2'>$</span>./fetch_blog_posts
          </h2>

          <p className='font-mono text-sm max-w-2xl text-text-secondary'>
            <span className='text-ok-400'>➜</span> Thoughts, tutorials, and
            insights from my development journey.
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
          variants={FADE_IN}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          transition={{ ...TRANSITION_NORMAL, delay: 0.3 }}
        >
          <a
            href='https://dev.to/tvatdci'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 font-mono text-sm transition-colors duration-300 hover:underline text-lagoon'
          >
            View all posts on dev.to →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
