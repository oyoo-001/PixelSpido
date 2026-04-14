import { toast } from "sonner";

const friendlyMessages = {
  network: "Please check your internet connection and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
  default: "An unexpected error occurred. Please try again.",
};

export function showToast(error, fallbackMessage) {
  console.error("Error details:", error);

  const status = error?.status;
  const message = error?.error || fallbackMessage || friendlyMessages[status] || friendlyMessages.default;

  if (status === 401) {
    if (message?.toLowerCase().includes("invalid") || message?.toLowerCase().includes("incorrect")) {
      toast.error("Invalid email or password", {
        description: "Please check your credentials and try again.",
      });
    } else {
      toast.error("Session Expired", {
        description: "Please sign in again to continue.",
        action: {
          label: "Sign In",
          onClick: () => (window.location.href = "/login"),
        },
      });
    }
  } else if (status === 403) {
    toast.error("Access Denied", {
      description: message,
    });
  } else if (status === 404) {
    toast.error("Not Found", {
      description: message,
    });
  } else if (status === 429) {
    toast.error("Too Many Requests", {
      description: message,
    });
  } else if (status >= 500) {
    toast.error("Server Error", {
      description: friendlyMessages[500],
    });
  } else if (status === 0 || !status) {
    toast.error("Connection Failed", {
      description: friendlyMessages.network,
    });
  } else {
    toast.error("Something Went Wrong", {
      description: message,
    });
  }
}

export function showSuccess(message, description) {
  toast.success(message, {
    description: description,
  });
}

export function showInfo(message, description) {
  toast.info(message, {
    description: description,
  });
}

export function showWarning(message, description) {
  toast.warning(message, {
    description: description,
  });
}

export async function withToast(promise, options = {}) {
  const {
    loadingMessage = "Please wait...",
    successMessage,
    successDescription,
    errorMessage,
    onError,
  } = options;

  toast.loading(loadingMessage, { id: "app-toast" });

  try {
    const result = await promise;
    toast.success(successMessage || "Success!", {
      id: "app-toast",
      description: successDescription,
    });
    return result;
  } catch (error) {
    toast.dismiss("app-toast");
    showToast(error, errorMessage);
    if (onError) onError(error);
    throw error;
  }
}