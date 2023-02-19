import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef, Dispatch, FC, SetStateAction } from 'react';
import { BsArrowsAngleContract, BsArrowsAngleExpand } from 'react-icons/bs';
import { twMerge } from '@/common/util/tw-merge.util';
import { getLearningLevelBgColor, LearningLevel } from '@/module/skill/model/learning-level.model';

export type LearningLevelListProps = Omit<ComponentPropsWithoutRef<typeof motion.div>, 'children'> & {
  expantionController: {
    isExpanded: boolean;
    setIsExpanded: Dispatch<SetStateAction<boolean>>;
  };
};

export const LearningLevelList: FC<LearningLevelListProps> = ({ expantionController, className, ...props }) => (
  <motion.div
    layout
    className={twMerge(
      'flex w-min gap-5 rounded-2xl border-2 border-accent-300 bg-accent-100 p-3 drop-shadow-lg',
      expantionController.isExpanded ? 'items-start md:items-center' : 'items-center',
      className,
    )}
    {...props}
  >
    <motion.ul layout className={twMerge('flex flex-col gap-3 md:flex-row md:gap-6', !expantionController.isExpanded && 'flex-row')}>
      {Object.entries(LearningLevel).map(([, learningLevel]) => (
        <motion.li layout key={learningLevel} className="flex items-center gap-3">
          <motion.div layout aria-hidden className="h-6 w-6 rounded-full" style={{ ...getLearningLevelBgColor(learningLevel) }} />
          {expantionController.isExpanded && (
            <motion.span layout className="font-semibold">
              {learningLevel.charAt(0).toUpperCase() + learningLevel.slice(1).toLowerCase()}
            </motion.span>
          )}
        </motion.li>
      ))}
    </motion.ul>
    <motion.figure
      layout
      onClick={() => expantionController.setIsExpanded(!expantionController.isExpanded)}
      className="rounded-full p-2 transition-colors hover:bg-accent-200/80"
    >
      {expantionController.isExpanded ? (
        <BsArrowsAngleContract size={18} className="fill-gray-600" />
      ) : (
        <BsArrowsAngleExpand size={18} className="fill-gray-600" />
      )}
    </motion.figure>
  </motion.div>
);
