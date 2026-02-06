import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  onConfirm,
  onCancel,
  isLoading = false
}: ConfirmDialogProps) {
  const typeConfig = {
    danger: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      button: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      button: 'bg-amber-600 hover:bg-amber-700'
    },
    info: {
      icon: Info,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      button: 'bg-green-600 hover:bg-green-700'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header with icon */}
              <div className={`${config.bg} p-6 flex items-center gap-4 border-b border-slate-200`}>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${config.bg}`}>
                  <Icon className={`${config.color}`} size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
              </div>

              {/* Actions */}
              <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-200">
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2 ${config.button} text-white font-medium rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  {isLoading && <div className="animate-spin">⚙️</div>}
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
