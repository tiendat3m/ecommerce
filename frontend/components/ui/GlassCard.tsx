'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    onClick?: () => void;
}

export default function GlassCard({
    children,
    className,
    hover = false,
    glow = false,
    onClick,
}: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={hover ? { scale: 1.02, y: -5 } : {}}
            onClick={onClick}
            className={cn(
                'relative overflow-hidden rounded-2xl',
                'bg-white/10 backdrop-blur-xl',
                'border border-white/20',
                'shadow-lg shadow-black/5',
                glow && 'animate-glow',
                hover && 'cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/20',
                className
            )}
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}