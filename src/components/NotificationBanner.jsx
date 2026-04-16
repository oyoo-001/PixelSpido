import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { X, Bell, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationBanner() {
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.request("/notifications");
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await api.request(`/notifications/${id}/read`, { method: "PATCH" });
      setDismissed((prev) => new Set([...prev, id]));
    } catch (error) {
      console.error("Failed to dismiss notification:", error);
    }
  };

  const activeNotifications = notifications.filter(
    (n) => !n.is_read && !dismissed.has(n.id)
  );

  if (activeNotifications.length === 0) return null;

  return (
    <div className="space-y-2">
      {activeNotifications.slice(0, 3).map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
            notification.type === "subscription"
              ? "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800"
              : "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
          }`}
        >
          {notification.type === "subscription" ? (
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          ) : (
            <Bell className="h-5 w-5 text-blue-600 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground">{notification.title}</p>
            <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
            onClick={() => handleDismiss(notification.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}