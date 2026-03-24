'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface GradientButtonProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit';
}

export default function GradientButton({
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
}: GradientButtonProps) {
    const variants = {
        primary: 'bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800',
        secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-700 hover:from-secondary-600 hover:to-secondary-800',
        accent: 'bg-gradient-to-r from-accent-500 to-accent-700 hover:from-accent-600 hover:to-accent-800',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
                'relative inline-flex items-center justify-center font-semibold text-white rounded-xl',
                'transition-all duration-300 overflow-hidden',
                'shadow-lg hover:shadow-xl',
                variants[variant],
                sizes[size],
                (disabled || loading) && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/10 to-transparent" />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {children}
            </span>
        </motion.button>
    );
}