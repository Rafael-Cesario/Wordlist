"use client";

export interface INotification {
  type: "error" | "success";
  message: string;
  open: boolean;
}

interface NotifcationProps {
  props: {
    notification: INotification;
    setNotification: (state: INotification) => void;
  };
}

export const Notification = ({ props: { notification, setNotification } }: NotifcationProps) => {
  const borders = {
    error: "border-red",
    success: "border-moss",
  };

  if (!notification.open) return;

  return (
    <div className="flex justify-center">
      <div
        data-type={notification.type}
        className={`absolute top-10 w-100 self-center bg-faded px-4 py-2 border-l-20 flex justify-between items-center rounded-sm ${borders[notification.type]}`}
      >
        <p data-testid="notification-text">{notification.message}</p>

        <button
          className="px-2 py-2 text-2xl text-neutral-500"
          onClick={() => setNotification({ ...notification, open: false })}
        >
          x
        </button>
      </div>
    </div>
  );
};
