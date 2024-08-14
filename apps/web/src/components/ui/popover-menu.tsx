import * as PopoverMenuPrimitive from '@radix-ui/react-popover';
import { Attributes, cloneElement, ComponentProps, isValidElement } from 'react';
import { twMerge } from 'tailwind-merge';

interface PopoverMenuProps extends ComponentProps<typeof PopoverMenuPrimitive.Root> {}

export const PopoverMenu = (props: PopoverMenuProps) => {
  return <PopoverMenuPrimitive.Root {...props} />;
};

interface PopoverMenuTriggerProps
  extends ComponentProps<typeof PopoverMenuPrimitive.Trigger> {}

export const PopoverMenuTrigger = ({ className, ...props }: PopoverMenuTriggerProps) => {
  return (
    <PopoverMenuPrimitive.Trigger
      className={twMerge(
        'focus-visible:ring-foreground hover:ring-primary bg-border/60 hover:bg-border active:bg-border/80 group flex items-center justify-center rounded-lg p-2 outline-none transition-all focus-visible:ring-1 active:transition-none',
        className,
      )}
      {...props}
    />
  );
};

interface PopoverMenuContentProps
  extends ComponentProps<typeof PopoverMenuPrimitive.Content> {}

export const PopoverMenuContent = ({ className, ...props }: PopoverMenuContentProps) => {
  return (
    <PopoverMenuPrimitive.Portal>
      <PopoverMenuPrimitive.Content
        className={twMerge(
          'bg-input min-w-28 rounded-md border p-0.5 shadow data-[state=closed]:animate-[content-hide_200ms] data-[state=open]:animate-[content-show_200ms]',
          className,
        )}
        {...props}
      />
    </PopoverMenuPrimitive.Portal>
  );
};

interface PopoverMenuItemProps extends ComponentProps<'fieldset'> {
  asChild?: boolean;
}

const twClass =
  'flex items-center gap-2 rounded px-1.5 py-0.5 font-medium outline-none hover:cursor-pointer hover:bg-slate-700/20';

export const PopoverMenuItem = ({
  asChild,
  className,
  children,
  ...props
}: PopoverMenuItemProps) => {
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: twMerge(twClass, className),
      ...props,
    } as Attributes);
  }

  return (
    <fieldset className={twMerge(twClass, className)} {...props}>
      {children}
    </fieldset>
  );
};
