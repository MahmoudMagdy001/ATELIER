import React from 'react'

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

export const Table: React.FC<TableProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#C4A070]/20 bg-[#181514] shadow-xl">
      <table className={`w-full text-start text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  )
}

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <thead className={`bg-[#1C1816]/80 border-b border-[#C4A070]/15 text-xs font-serif uppercase tracking-wider text-[#C4A070] ${className}`} {...props}>
    {children}
  </thead>
)

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <tbody className={`divide-y divide-white/5 ${className}`} {...props}>
    {children}
  </tbody>
)

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <tr className={`hover:bg-white/[0.02] transition-colors ${className}`} {...props}>
    {children}
  </tr>
)

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <th className={`px-6 py-4 text-start font-bold ${className}`} {...props}>
    {children}
  </th>
)

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <td className={`px-6 py-4 text-[#DEDAD6] ${className}`} {...props}>
    {children}
  </td>
)

export default Table
