'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FloatingNavbarProps {
    children: React.ReactNode;
    className?: string;
}

export default function FloatingNavbar({ children, className }: FloatingNavbarProps) {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [atTop, setAtTop] = useState(true);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }

        setAtTop(latest < 50);
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: '-100%' },
            }}
            animate={hidden ? 'hidden' : 'visible'}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                atTop
                    ? 'bg-transparent'
                    : 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20',
                className
            )}
        >
            {children}
        </motion.nav>
    );
}