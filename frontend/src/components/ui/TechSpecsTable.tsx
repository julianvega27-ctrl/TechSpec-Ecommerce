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
    <div className="w-full border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] overflow-hidden">
      <table className="w-full text-left border-collapse">
        <tbody>
          {specs.map((spec, index) => (
            <tr 
              key={index} 
              className={`border-b border-[var(--color-outline-subtle)] last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-[var(--color-surface-container)]'}`}
            >
              <td className="py-3 px-4 label-caps text-[var(--color-obsidian-light)] w-1/3">
                {spec.label}
              </td>
              <td className="py-3 px-4 mono-data text-[var(--color-obsidian)] w-2/3">
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
