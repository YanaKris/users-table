import { COLUMNS, alignStyle } from '../../constants/columns';
import { formatValue } from '../../utils/formatters';

export function TableRow({ user }) {
  return (
    <tr>
      {COLUMNS.map((col) => (
        <td key={col.key} style={alignStyle(col.align)}>
          {formatValue(col.getValue(user))}
        </td>
      ))}
    </tr>
  );
}
