import { toast } from 'react-toastify';

export const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showSuccess = (message) => {
  toast.success(message, {
    ...toastConfig,
    className: 'bg-green-50 text-green-900',
    progressClassName: 'bg-green-500',
  });
};

export const showError = (message) => {
  toast.error(message, {
    ...toastConfig,
    className: 'bg-red-50 text-red-900',
    progressClassName: 'bg-red-500',
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    ...toastConfig,
    className: 'bg-blue-50 text-blue-900',
    progressClassName: 'bg-blue-500',
  });
};

export const showWarning = (message) => {
  toast.warning(message, {
    ...toastConfig,
    className: 'bg-yellow-50 text-yellow-900',
    progressClassName: 'bg-yellow-500',
  });
};

// Custom toast for token rewards
export const showTokenReward = (amount, message) => {
  toast.success(
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
        <span className="text-xl">🪙</span>
      </div>
      <div>
        <div className="font-bold text-gray-900">+{amount} Tokens!</div>
        <div className="text-sm text-gray-600">{message}</div>
      </div>
    </div>,
    {
      ...toastConfig,
      autoClose: 4000,
      className: 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200',
    }
  );
};

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  tokenReward: showTokenReward,
};
