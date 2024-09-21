'use client';

import { ComponentProps, createContext, forwardRef, useContext } from 'react';
import { twMerge } from 'tailwind-merge';
import { tv, VariantProps } from 'tailwind-variants';

const input = tv({
  slots: {
    root: 'group flex w-full items-center bg-input outline-none ring-1 ring-border transition-all focus-within:ring-primary',
    control: 'w-full bg-input p-2 outline-none py-3.5 placeholder-border',
  },

  variants: {
    variant: {
      default: {
        root: 'rounded-xl',
        control: 'rounded-xl',
      },
      search: {
        root: 'rounded-full',
        control: 'rounded-full py-2.5',
      },
      filter: {
        root: 'rounded-full',
        control: 'rounded-full p-1',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const inputContext = createContext({} as VariantProps<typeof input>);

interface InputProps extends ComponentProps<'div'>, VariantProps<typeof input> {
  name?: string;
  label?: string;
  error?: string;
}

export const Input = ({ name, error, variant, className, ...props }: InputProps) => {
  const { root } = input({ variant });

  return (
    <inputContext.Provider value={{ variant }}>
      <div>
        <label htmlFor={name} className="flex flex-col space-y-1">
          <div className={root({ className })} {...props} />
        </label>
        <span className="text-destructive text-sm font-medium">{error}</span>
      </div>
    </inputContext.Provider>
  );
};

interface ControlInputProps extends ComponentProps<'input'>, VariantProps<typeof input> {}

const Control = forwardRef<HTMLInputElement, ControlInputProps>(
  ({ className, ...props }, ref) => {
    const { variant } = useContext(inputContext);
    const { control } = input({ variant });

    return <input className={control({ className })} {...props} ref={ref} />;
  },
);

interface ControlTextereaProps
  extends ComponentProps<'textarea'>,
    VariantProps<typeof input> {}

const ControlTextarea = forwardRef<HTMLTextAreaElement, ControlTextereaProps>(
  ({ className, ...props }, ref) => {
    const { variant } = useContext(inputContext);
    const { control } = input({ variant });

    return <textarea rows={4} className={control({ className })} {...props} ref={ref} />;
  },
);

interface ControlSelectProps
  extends ComponentProps<'select'>,
    VariantProps<typeof input> {}

const ControlSelect = forwardRef<HTMLSelectElement, ControlSelectProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = useContext(inputContext);
    const { control } = input({ variant });

    return (
      <select
        className={control({ className: twMerge(className, 'mr-2') })}
        {...props}
        ref={ref}
      >
        {children}
      </select>
    );
  },
);

Control.displayName = 'Control';
ControlTextarea.displayName = 'ControlTextarea';
ControlSelect.displayName = 'ControlSelect';

export { Control, ControlSelect, ControlTextarea };
