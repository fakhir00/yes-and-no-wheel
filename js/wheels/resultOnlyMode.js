export function setupWheelResultOnlyMode({
  layoutEl,
  mainEl,
  resultEl,
  onSpinAgain,
  buttonLabel = 'Spin Again'
}) {
  if (!mainEl || !resultEl) {
    return {
      showResultOnly() {},
      reset() {}
    };
  }

  const spinAgainBtn = document.createElement('button');
  spinAgainBtn.type = 'button';
  spinAgainBtn.className = 'spin-again-btn';
  spinAgainBtn.textContent = buttonLabel;
  spinAgainBtn.hidden = true;
  resultEl.insertAdjacentElement('afterend', spinAgainBtn);

  function showResultOnly() {
    mainEl.classList.add('result-only-active');
    if (layoutEl) layoutEl.classList.add('result-only-active');
    spinAgainBtn.hidden = false;
  }

  function reset() {
    mainEl.classList.remove('result-only-active');
    if (layoutEl) layoutEl.classList.remove('result-only-active');
    spinAgainBtn.hidden = true;
  }

  spinAgainBtn.addEventListener('click', () => {
    reset();
    if (typeof onSpinAgain === 'function') {
      onSpinAgain();
    }
  });

  return {
    showResultOnly,
    reset
  };
}
