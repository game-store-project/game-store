import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface TableProps extends ComponentProps<'table'> {}

export function Table(props: TableProps) {
  return (
    <table
      {...props}
      className={twMerge('w-full border-b-2 border-t-2 text-sm', props.className)}
    />
  );
}

interface TableHeaderProps extends ComponentProps<'thead'> {}

export function TableHeader(props: TableHeaderProps) {
  return <thead {...props} />;
}

interface TableHeadProps extends ComponentProps<'th'> {}

export function TableHead(props: TableHeadProps) {
  return (
    <th
      {...props}
      className={twMerge('px-4 py-3 text-left font-bold', props.className)}
    />
  );
}

interface TableBodyProps extends ComponentProps<'tbody'> {}

export function TableBody(props: TableBodyProps) {
  return (
    <tbody
      {...props}
      className={twMerge(
        '[&_tr:hover]:bg-border/30 [&_tr:last-child]:border-0',
        props.className,
      )}
    />
  );
}

interface TableRowProps extends ComponentProps<'tr'> {}

export function TableRow(props: TableRowProps) {
  return <tr {...props} className={twMerge('bg-input/20 border-b', props.className)} />;
}

interface TableCellProps extends ComponentProps<'td'> {}

export function TableCell(props: TableCellProps) {
  return <td {...props} className={twMerge('px-4 py-3', props.className)} />;
}
