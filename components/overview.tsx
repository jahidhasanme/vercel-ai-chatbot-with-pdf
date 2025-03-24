import { motion } from 'framer-motion';
import Image from 'next/image';

import { MessageIcon, VercelIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <Image src={'/images/icon.png'} height={38} width={38} alt='PDF logo...' priority />
          <span>+</span>
          <MessageIcon size={32} />
        </p>
        <p>
          Please provide me with a large-sized PDF file that I can easily handle😊
        </p>
      </div>
    </motion.div>
  );
};
