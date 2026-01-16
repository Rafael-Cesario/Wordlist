"use client";

import { INotification } from "@/app/page";

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
    <div className={`absolute top-10 w-100 self-center bg-faded px-8 py-4 border-l-2 ${borders[notification.type]}`}>
      <p>{notification.message}</p>
      <button
        className="absolute top-0 right-0 px-4 py-1"
        onClick={() => setNotification({ ...notification, open: false })}
      >
        x
      </button>
    </div>
  );
};
