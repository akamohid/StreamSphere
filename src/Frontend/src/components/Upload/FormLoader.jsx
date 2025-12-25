import { motion } from "framer-motion";

export default function FormLoader() {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center">
      <motion.div
        className="bg-white/90 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-12 bg-gradient-to-b from-blue-400 to-purple-500 rounded-md"
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 0.1,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <p className="text-lg font-semibold text-blue-700 animate-pulse">
          Uploading your creation...
        </p>
      </motion.div>
    </div>
  );
}
