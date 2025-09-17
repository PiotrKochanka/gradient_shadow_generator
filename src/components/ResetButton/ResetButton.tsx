import React from 'react';
import styles from './ResetButton.module.css';

const RefreshButton: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button onClick={handleRefresh} className={`${styles.refresh_button}`}>
      Odśwież
    </button>
  );
};

export default RefreshButton;