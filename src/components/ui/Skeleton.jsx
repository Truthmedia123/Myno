import { cn } from '@/lib/utils';

export function Skeleton({ className, variant = 'rect' }) {
    return (
        <div className={cn(
            "animate-pulse bg-muted/40",
            variant === 'rect' && "rounded-lg",
            variant === 'circle' && "rounded-full",
            variant === 'text' && "rounded h-4",
            className
        )} />
    );
}

export function MessageSkeleton() {
    return (
        <div className="flex gap-3 p-4">
            <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
            <div className="flex-1 space-y-3">
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2" />
                <Skeleton variant="text" className="w-2/3" />
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
            <Skeleton variant="text" className="w-1/3 h-5" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-2/3" />
        </div>
    );
}