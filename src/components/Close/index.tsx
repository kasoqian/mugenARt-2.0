import styles from './index.less';

type CloseButtonType = {
  position?: {
    x?: number;
    y?: number;
  };
};

const defaultPosition = {
  x: -10,
  y: 42,
};

function CloseButton({ position }: CloseButtonType) {
  const translateStyle = () => {
    let x = defaultPosition.x;
    let y = defaultPosition.y;

    if (!!position) {
      x = position.x ? -position.x + x : x;
      y = position.y ? position.y + y : y;
    }

    return {
      transform: `translateX(${x}Px) translateY(${y}Px)`,
    };
  };

  return (
    <div className={styles.close} style={translateStyle()}>
      <div className={styles.close_icon}></div>
    </div>
  );
}

export default CloseButton;
