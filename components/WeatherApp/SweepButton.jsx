import styles from './sweepbutton.module.scss';

export const SweepButton = ({ Content, Function }) => {
  return (
    <div class={styles.sweepbutton_container}>
      <button
        onClick={() => {
          Function();
        }}
        class={styles.sweepbutton}
      >
        {Content}
      </button>
    </div>
  );
};
