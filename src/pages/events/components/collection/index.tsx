import ModelContent from './components/reward';
import RuleContent from './components/rule';

import styles from './index.less';

export default function () {
  const Model = () => (
    <div className={styles.container_display}>
      <ModelContent></ModelContent>
    </div>
  );

  const Rule = () => (
    <div className={styles.container_rule}>
      <RuleContent></RuleContent>
    </div>
  );

  return (
    <div className={styles.container_first}>
      <Model></Model>
      <Rule></Rule>
    </div>
  );
}
