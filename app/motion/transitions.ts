import { easeInOut } from 'motion-v';

export const fadeSlideY = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.15, ease: easeInOut },
};
