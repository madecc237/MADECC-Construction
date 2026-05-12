import { motion } from "motion/react";
import { useContent } from "../context/ContentContext";

export default function BlogSection() {
  const { content } = useContent();
  const POSTS = content.filter(item => item.type === 'insight' && item.status === 'Published');

  return (
    <section id="blog" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-20">
          <div>
            <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-4 block">Knowledge Base</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.8]">Insights <br /> & News</h2>
          </div>
          <a href="/blog" className="text-xs font-black uppercase tracking-widest border-b-2 border-black hover:border-orange-600 pb-1 transition-all">View All</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {POSTS.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="aspect-[16/10] overflow-hidden mb-8 relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                  {post.category}
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{post.date}</p>
              <h3 className="text-2xl font-bold tracking-tight group-hover:text-orange-600 transition-colors uppercase leading-tight">
                <a href={`/blog/${index}`}>{post.title}</a>
              </h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
