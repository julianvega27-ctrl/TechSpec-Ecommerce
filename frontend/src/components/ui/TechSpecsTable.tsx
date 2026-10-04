import React from 'react';

export interface TechSpec {
  label: string;
  value: string;
}

interface TechSpecsTableProps {
  specs: TechSpec[];
}

const TechSpecsTable: React.FC<TechSpecsTableProps> = ({ specs }) => {
  if (!specs || specs.length === 0) return null;

  return (
    <div className="ds-card w-full overflow-x-auto">
      <table aria-label="Especificaciones técnicas" className="w-full text-left border-collapse">
        <tbody>
          {specs.map((spec, index) => (
            <tr 
              key={index} 
              className={`border-b border-[var(--color-outline-subtle)] last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-[var(--color-surface-container)]'}`}
            >
              <th scope="row" className="py-3 px-4 text-sm font-medium text-text-secondary w-1/3 break-words">
                {spec.label}
              </th>
              <td className="py-3 px-4 text-sm tabular-nums text-primary w-2/3 break-words">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TechSpecsTable;
