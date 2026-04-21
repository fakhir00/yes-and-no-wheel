function resolveElement(root, target) {
  if (!target) return null;
  if (target instanceof Element) return target;
  if (typeof target === 'string') {
    return (root instanceof Element ? root : document).querySelector(target);
  }
  return null;
}

export function createResultOnlyMode(options = {}) {
  const root = options.root || document;
  const resultEl = resolveElement(root, options.resultSelector);
  const layoutEl = resolveElement(root, options.layoutSelector || '.wheel-layout');
  const mainEl = resolveElement(root, options.mainSelector || '.wheel-main');
  const sectionEl = resolveElement(root, options.sectionSelector);

  if (!resultEl) {
    return {
      showResultOnly() {},
      hideResultOnly() {},
      button: null
    };
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = ['spin-again-btn', options.buttonClassName || ''].filter(Boolean).join(' ');
  button.textContent = options.spinAgainText || 'Spin Again';
  resultEl.insertAdjacentElement('afterend', button);

  function showResultOnly() {
    layoutEl?.classList.add('result-only-active');
    mainEl?.classList.add('result-only-active');
    sectionEl?.classList.add('result-only-active');
    button.classList.add('show');
  }

  function hideResultOnly() {
    layoutEl?.classList.remove('result-only-active');
    mainEl?.classList.remove('result-only-active');
    sectionEl?.classList.remove('result-only-active');
    button.classList.remove('show');
  }

  button.addEventListener('click', () => {
    hideResultOnly();
    if (typeof options.onSpinAgain === 'function') {
      options.onSpinAgain();
    }
  });

  return {
    showResultOnly,
    hideResultOnly,
    button
  };
}
