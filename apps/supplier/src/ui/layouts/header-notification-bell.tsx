import { Bell } from 'lucide-react';

// TODO(orval): replace with real unread-notification count once a notifications API exists
const UNREAD_NOTIFICATION_MOCK_COUNT = 3;

/** Persistent notification bell shown on the left of the account menu on every page. */
export function HeaderNotificationBell() {
  return (
    <button
      type="button"
      className="tap-effect relative flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full bg-[#6161611A]"
      aria-label="Notifications"
    >
      <Bell className="h-[38px] w-[38px] text-white" />
      {UNREAD_NOTIFICATION_MOCK_COUNT > 0 && (
        <span className="absolute right-3 top-3 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#FAFAFA] text-[14px] font-semibold leading-none text-[#121212]">
          {UNREAD_NOTIFICATION_MOCK_COUNT}
        </span>
      )}
    </button>
  );
}
