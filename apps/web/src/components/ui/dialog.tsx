import * as DialogPrimitive from '@radix-ui/react-dialog';

import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface DialogProps extends ComponentProps<typeof DialogPrimitive.Root> {}

export const Dialog = (props: DialogProps) => {
  return <DialogPrimitive.Root {...props} />;
};

interface DialogOverlayProps extends ComponentProps<typeof DialogPrimitive.Overlay> {}

export const DialogOverlay = ({ className, ...props }: DialogOverlayProps) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={twMerge(
          'bg-transluced fixed inset-0 z-10 flex items-center justify-center',
          className,
        )}
        {...props}
      />
    </DialogPrimitive.Portal>
  );
};

interface DialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {}

export const DialogContent = ({ className, ...props }: DialogContentProps) => {
  return (
    <DialogPrimitive.Content
      className={twMerge(
        'bg-background mx-auto flex w-full max-w-lg flex-col gap-5 rounded-xl border p-5 shadow-xl',
        className,
      )}
      {...props}
    />
  );
};

interface DialogTitleProps extends ComponentProps<typeof DialogPrimitive.Title> {}

export const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
  return <DialogPrimitive.Title className={twMerge('text-lg', className)} {...props} />;
};
