import useLocals from '@/hooks/useLocals';
import styles from './index.less';

function RuleTitle() {
  const { localText } = useLocals();
  return (
    <div className={styles.title}>{localText['events.activities.rule']}</div>
  );
}

export default RuleTitle;
