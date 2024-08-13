import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface DropdownMenuProps extends ComponentProps<typeof DropdownMenuPrimitive.Root> {}

export const DropdownMenu = (props: DropdownMenuProps) => {
  return <DropdownMenuPrimitive.Root {...props} />;
};

interface DropdownMenuSubProps extends ComponentProps<typeof DropdownMenuPrimitive.Sub> {}

export const DropdownMenuSub = (props: DropdownMenuSubProps) => {
  return <DropdownMenuPrimitive.Sub {...props} />;
};

interface DropdownMenuTriggerProps
  extends ComponentProps<typeof DropdownMenuPrimitive.Trigger> {}

export const DropdownMenuTrigger = ({
  className,
  ...props
}: DropdownMenuTriggerProps) => {
  return (
    <DropdownMenuPrimitive.Trigger
      className={twMerge(
        'focus-visible:ring-primary size-10 rounded-full outline-none transition-all focus-visible:ring-1',
        className,
      )}
      {...props}
    />
  );
};

interface DropdownMenuSubTriggerProps
  extends ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> {}

export const DropdownMenuSubTrigger = ({
  className,
  ...props
}: DropdownMenuSubTriggerProps) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={twMerge(
        'flex items-center justify-between rounded px-1.5 py-0.5 font-medium outline-none hover:cursor-pointer hover:bg-slate-700/20',
        className,
      )}
      {...props}
    />
  );
};

interface DropdownMenuContentProps
  extends ComponentProps<typeof DropdownMenuPrimitive.Content> {}

export const DropdownMenuContent = ({
  className,
  ...props
}: DropdownMenuContentProps) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={twMerge('bg-input rounded-md border p-0.5 shadow', className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
};

interface DropdownMenuSubContentProps
  extends ComponentProps<typeof DropdownMenuPrimitive.SubContent> {}

export const DropdownMenuSubContent = ({
  className,
  ...props
}: DropdownMenuSubContentProps) => {
  return (
    <DropdownMenuPrimitive.SubContent
      className={twMerge('bg-input rounded-md border p-0.5 shadow', className)}
      {...props}
    />
  );
};

interface DropdownMenuItemProps
  extends ComponentProps<typeof DropdownMenuPrimitive.Item> {}

export const DropdownMenuItem = ({ className, ...props }: DropdownMenuItemProps) => {
  return (
    <DropdownMenuPrimitive.Item
      className={twMerge(
        'flex items-center gap-2 rounded px-1.5 py-0.5 font-medium outline-none hover:cursor-pointer hover:bg-slate-700/20',
        className,
      )}
      {...props}
    />
  );
};

interface DropdownMenuSeparatorProps
  extends ComponentProps<typeof DropdownMenuPrimitive.Separator> {}

export const DropdownMenuSeparator = ({
  className,
  ...props
}: DropdownMenuSeparatorProps) => {
  return (
    <DropdownMenuPrimitive.Separator
      className={twMerge('bg-border mx-auto my-0.5 h-px', className)}
      {...props}
    />
  );
};

interface DropdownMenuRadioGroup
  extends ComponentProps<typeof DropdownMenuPrimitive.RadioGroup> {}

export const DropdownMenuRadioGroup = (props: DropdownMenuRadioGroup) => {
  return <DropdownMenuPrimitive.RadioGroup {...props} />;
};

interface DropdownMenuRadioItem
  extends ComponentProps<typeof DropdownMenuPrimitive.RadioItem> {}

export const DropdownMenuRadioItem = ({ className, ...props }: DropdownMenuRadioItem) => {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={twMerge(
        'relative flex items-center rounded px-1.5 py-0.5 pl-8 font-medium outline-none hover:cursor-pointer hover:bg-slate-700/20',
        className,
      )}
      {...props}
    />
  );
};

interface DropdownMenuItemIndicatorProps
  extends ComponentProps<typeof DropdownMenuPrimitive.ItemIndicator> {}

export const DropdownMenuItemIndicator = ({
  className,
  ...props
}: DropdownMenuItemIndicatorProps) => {
  return (
    <DropdownMenuPrimitive.ItemIndicator
      className={twMerge(
        'text-primary absolute left-0 inline-flex size-7 items-center justify-center',
        className,
      )}
      {...props}
    />
  );
};
