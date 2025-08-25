'use client';

import clsx from 'clsx';

type VideoLoaderProps = {
  open: boolean;
  src: string;              // exemplo: "/loader-amigo.mp4"
  label?: string;
  size?: number;
  fullscreen?: boolean;
  className?: string;
  disableBlur?: boolean;
  visuallyHiddenLabel?: boolean;
};

export function VideoLoader({
  open,
  src,
  label = 'Carregando…',
  size = 120,
  fullscreen = false,
  className,
  disableBlur,
  visuallyHiddenLabel = false,
}: VideoLoaderProps) {
  if (!open) return null;

  const Container = ({ children }: { children: React.ReactNode }) =>
    fullscreen ? (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={clsx(
          'fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6',
          !disableBlur && 'backdrop-blur-sm',
          'bg-black/50',
          className
        )}
      >
        {children}
      </div>
    ) : (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={clsx('inline-flex flex-col items-center gap-3', className)}
      >
        {children}
      </div>
    );

  return (
    <Container>
      <video
        src={src}
        width={size}
        height={size}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="rounded-full select-none pointer-events-none shadow-lg"
      />
      <span className={clsx(visuallyHiddenLabel && 'sr-only', 'text-sm')}>
        {label}
      </span>
    </Container>
  );
}