"use client";

type AdminUserActionButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  targetUserId: string;
  returnTo: string;
  label: string;
  confirmMessage: string;
  className: string;
};

export function AdminUserActionButton({
  action,
  targetUserId,
  returnTo,
  label,
  confirmMessage,
  className,
}: AdminUserActionButtonProps) {
  return (
    <form action={action}>
      <input type="hidden" name="targetUserId" value={targetUserId} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <button
        type="submit"
        onClick={(event) => {
          if (!window.confirm(confirmMessage)) {
            event.preventDefault();
          }
        }}
        className={className}
      >
        {label}
      </button>
    </form>
  );
}
