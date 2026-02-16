import { motion } from 'framer-motion'
import conlogo from '../assets/conlogo-256.png'

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white">
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ initial: { opacity: 1 }, animate: { opacity: 1 } }}
        className="relative flex items-center justify-center"
      >
        {/* Split logo animation */}
        <motion.img
          src={conlogo}
          alt="Connect"
          className="h-12 w-auto absolute"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [0, 1, 1], scale: [0.9, 1, 1], rotate: [0, 0, 0] }}
          transition={{ duration: 0.3 }}
        />
        <motion.img
          src={conlogo}
          alt="Connect"
          className="h-12 w-auto"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: [ -40, -10, 0 ], opacity: [0, 1, 1] }}
          transition={{ duration: 0.8, times: [0, 0.6, 1], ease: 'easeOut' }}
        />
        <motion.img
          src={conlogo}
          alt="Connect"
          className="h-12 w-auto"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: [ 40, 10, 0 ], opacity: [0, 1, 1] }}
          transition={{ duration: 0.8, times: [0, 0.6, 1], ease: 'easeOut' }}
        />
      </motion.div>
    </div>
  )
}


