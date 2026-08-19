"use client";

type AdminAssetActionButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  targetAssetId: string;
  returnTo: string;
  label: string;
  confirmMessage: string;
  className: string;
};

export function AdminAssetActionButton({
  action,
  targetAssetId,
  returnTo,
  label,
  confirmMessage,
  className,
}: AdminAssetActionButtonProps) {
  return (
    <form action={action}>
      <input type="hidden" name="targetAssetId" value={targetAssetId} />
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
