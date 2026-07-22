import { Modal } from '../ui/Modal';
import styles from './UserModal.module.css';

export function UserModal({ user, onClose }) {
  if (!user) return null;

  const fullName = [user.lastName, user.firstName, user.maidenName].filter(Boolean).join(' ');
  const { address } = user;
  const addressText = address
    ? [address.country, address.city, address.state, address.address].filter(Boolean).join(', ')
    : '—';

  return (
    <Modal onClose={onClose}>
      <div className={styles.header}>
        <img className={styles.avatar} src={user.image} alt={fullName} />
        <h2 className={styles.name}>{fullName}</h2>
      </div>
      <dl className={styles.details}>
        <div className={styles.row}><dt>Возраст</dt><dd>{user.age}</dd></div>
        <div className={styles.row}><dt>Адрес</dt><dd>{addressText}</dd></div>
        <div className={styles.row}><dt>Рост</dt><dd>{user.height} см</dd></div>
        <div className={styles.row}><dt>Вес</dt><dd>{user.weight} кг</dd></div>
        <div className={styles.row}><dt>Телефон</dt><dd>{user.phone}</dd></div>
        <div className={styles.row}><dt>Email</dt><dd>{user.email}</dd></div>
      </dl>
    </Modal>
  );
}
