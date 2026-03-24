'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
    text: string;
    className?: string;
    variant?: 'fadeIn' | 'slideUp' | 'slideDown' | 'typewriter';
    delay?: number;
    duration?: number;
}

export default function AnimatedText({
    text,
    className,
    variant = 'fadeIn',
    delay = 0,
    duration = 0.5,
}: AnimatedTextProps) {
    const variants = {
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
        },
        slideUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
        },
        slideDown: {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
        },
        typewriter: {
            initial: { width: 0 },
            animate: { width: 'auto' },
        },
    };

    if (variant === 'typewriter') {
        return (
            <div className="overflow-hidden">
                <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 'auto' }}
                    transition={{ duration, delay, ease: 'easeInOut' }}
                    className={cn('inline-block whitespace-nowrap overflow-hidden', className)}
                    style={{ borderRight: '2px solid currentColor' }}
                >
                    {text}
                </motion.span>
            </div>
        );
    }

    return (
        <motion.span
            initial={variants[variant].initial}
            animate={variants[variant].animate}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={cn('inline-block', className)}
        >
            {text.split(' ').map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.3,
                        delay: delay + (index * 0.1),
                        ease: 'easeOut'
                    }}
                    className="inline-block mr-2"
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    );
}