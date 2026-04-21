import { type ReactNode } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  body?: ReactNode;
  children?: ReactNode;
};

export function Dialog({ open, onOpenChange, title, body, children }: Props) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <RadixDialog.Content
          className="
            fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2
            rounded-3xl bg-canvas p-6 shadow-card outline-none
          "
        >
          <RadixDialog.Title className="text-lg font-semibold">{title}</RadixDialog.Title>
          {body ? (
            <RadixDialog.Description className="mt-2 text-sm text-ink-muted">
              {body}
            </RadixDialog.Description>
          ) : null}
          <div className="mt-6 flex flex-col gap-2">{children}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
