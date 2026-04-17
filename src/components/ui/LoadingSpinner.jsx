import { cn } from '@/lib/utils';

export default function LoadingSpinner({ size = 'md', className }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-[3px]',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4',
    };

    return (
        <div className={cn("flex items-center justify-center", className)}>
            <div className={cn(
                "rounded-full border-muted/30 border-t-primary animate-spin",
                sizeClasses[size]
            )} />
        </div>
    );
}