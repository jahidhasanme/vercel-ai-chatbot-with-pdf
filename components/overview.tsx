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
          <Image src={'/images/icon.png'} height={38} width={38} alt='App logo...' priority />
          <span>+</span>
          <MessageIcon size={32} />
        </p>
        <p>
          Welcome to our Ghibli Studio, chatbot! Here, you can explore the enchanting world of animation through natural conversations. Upload your PDF documents and let our AI guide you through insights and discoveries, bringing together the magic of storytelling and intelligent analysis.
        </p>
      </div>
    </motion.div>
  );
};
