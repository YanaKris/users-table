import { COLUMNS } from '../../constants/columns';
import { formatValue } from '../../utils/formatters';

export function TableRow({ user }) {
  return (
    <tr>
      {COLUMNS.map((col) => (
        <td key={col.key}>{formatValue(col.getValue(user))}</td>
      ))}
    </tr>
  );
}
