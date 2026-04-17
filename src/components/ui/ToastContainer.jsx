import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

const toastConfig = {
    success: { icon: CheckCircleIcon, bg: 'bg-green-500', text: 'text-white' },
    error: { icon: ExclamationCircleIcon, bg: 'bg-red-500', text: 'text-white' },
    warning: { icon: ExclamationCircleIcon, bg: 'bg-orange-500', text: 'text-white' },
    info: { icon: InformationCircleIcon, bg: 'bg-blue-500', text: 'text-white' },
};

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-20 left-0 right-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
            <AnimatePresence>
                {toasts.map(toast => {
                    const config = toastConfig[toast.type] || toastConfig.info;
                    const Icon = config.icon;
                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            className={cn(
                                "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-full shadow-lg max-w-[90vw]",
                                config.bg, config.text
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{toast.message}</span>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-2 p-1 rounded-full hover:bg-white/20 transition"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}