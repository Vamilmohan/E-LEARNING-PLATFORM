import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

let toastIdCounter = 0;

const ICONS = {
  success: "bi-check-circle-fill",
  error: "bi-x-circle-fill",
  warning: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill",
};
const TOAST_STYLES = {
  success: {
    background: "linear-gradient(135deg, #198754, #20c997)",
    color: "#fff",
  },
  error: {
    background: "linear-gradient(135deg, #dc3545, #d63384)",
    color: "#fff",
  },
  warning: {
    background: "linear-gradient(135deg, #ffc107, #fd7e14)",
    color: "#212529",
  },
  info: {
    background: "linear-gradient(135deg, #0dcaf0, #0d6efd)",
    color: "#fff",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast],
  );

  const toast = useMemo(
    () => ({
      success: (msg, duration) => addToast(msg, "success", duration),
      error: (msg, duration) => addToast(msg, "error", duration),
      warning: (msg, duration) => addToast(msg, "warning", duration),
      info: (msg, duration) => addToast(msg, "info", duration),
      show: addToast,
      dismiss: removeToast,
    }),
    [addToast, removeToast],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1080 }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast show align-items-center border-0 shadow"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
              ...(TOAST_STYLES[t.type] || TOAST_STYLES.info),
              minWidth: "320px",
              marginBottom: "0.9rem",
              borderRadius: "1rem",
              boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
            }}
          >
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center">
                <i className={`bi ${ICONS[t.type] || ICONS.info} me-2 fs-5`}></i>
                <span>{t.message}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() => removeToast(t.id)}
              ></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
};
