import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-sm w-full bg-white rounded-3xl p-6 shadow-2xl border border-pink-200 text-center animate-in zoom-in-95 duration-200 relative"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-pink-50 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3 border border-rose-200 shadow-sm">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-1.5 font-gowun">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs sm:text-sm transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition shadow-md ${
              isDestructive
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:bg-rose-600 shadow-rose-200'
                : 'bg-gradient-to-r from-pink-400 to-rose-400 hover:bg-pink-500 shadow-pink-200'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
