import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import * as RadixToast from '@radix-ui/react-toast';

type ToastKind = 'success' | 'error' | 'info';

type ToastMsg = {
  id: number;
  kind: ToastKind;
  title: string;
  body?: string;
};

type Ctx = {
  showToast: (t: Omit<ToastMsg, 'id'>) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast(): Ctx {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const showToast = useCallback((t: Omit<ToastMsg, 'id'>) => {
    setToasts((prev) => [...prev, { ...t, id: Date.now() + Math.random() }]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastCtx.Provider value={value}>
      <RadixToast.Provider swipeDirection="down" duration={3500}>
        {children}
        {toasts.map((t) => (
          <RadixToast.Root
            key={t.id}
            className="
              data-[state=open]:animate-pop-in
              grid grid-cols-[auto_1fr] items-start gap-3
              rounded-2xl border border-ink/5 bg-ink text-white shadow-card p-4
            "
            onOpenChange={(open) => {
              if (!open) setToasts((prev) => prev.filter((p) => p.id !== t.id));
            }}
          >
            <span
              className={[
                'mt-0.5 h-6 w-6 shrink-0 rounded-full',
                t.kind === 'success' && 'bg-success',
                t.kind === 'error' && 'bg-danger',
                t.kind === 'info' && 'bg-brand-400',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-hidden
            />
            <div>
              <RadixToast.Title className="text-sm font-semibold">{t.title}</RadixToast.Title>
              {t.body ? (
                <RadixToast.Description className="mt-1 text-sm text-white/80">
                  {t.body}
                </RadixToast.Description>
              ) : null}
            </div>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport
          className="
            fixed bottom-0 left-1/2 z-50 flex w-[min(420px,calc(100vw-24px))]
            -translate-x-1/2 flex-col gap-2 p-3 safe-bottom outline-none
          "
        />
      </RadixToast.Provider>
    </ToastCtx.Provider>
  );
}
