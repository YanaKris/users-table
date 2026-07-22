import { COLUMNS, alignStyle } from '../../constants/columns';
import { formatValue } from '../../utils/formatters';

export function TableRow({ user, onRowClick = () => {} }) {
  const handleClick = () => {
    if (window.getSelection()?.toString()) return;
    onRowClick(user);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRowClick(user);
    }
  };

  return (
    <tr
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ cursor: 'pointer' }}
    >
      {COLUMNS.map((col) => (
        <td key={col.key} style={alignStyle(col.align)}>
          {formatValue(col.getValue(user))}
        </td>
      ))}
    </tr>
  );
}
