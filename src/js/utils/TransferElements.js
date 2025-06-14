class TransferElements {
  constructor(...configs) {
    this.configs = configs.map((config) => ({
      ...config,
      originalParent: config.sourceElement.parentNode,
      originalNextSibling: config.sourceElement.nextElementSibling,
    }));
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);
    // Initial call to set state
    this.handleResize();
  }

  handleResize() {
    const currentWidth = window.innerWidth;

    this.configs.forEach((config) => {
      const {
        sourceElement,
        breakpoints,
        originalParent,
        originalNextSibling,
      } = config;

      // Find the breakpoint that matches the current width
      const activeBreakpoint = Object.keys(breakpoints)
        .sort((a, b) => parseInt(b) - parseInt(a)) // Sort in descending order
        .find((bp) => currentWidth <= parseInt(bp));

      if (activeBreakpoint) {
        const { targetElement, targetPosition } = breakpoints[activeBreakpoint];
        // Move element to target if it's not already there
        if (sourceElement.parentNode !== targetElement) {
          if (targetElement.children[targetPosition]) {
            targetElement.insertBefore(
              sourceElement,
              targetElement.children[targetPosition]
            );
          } else {
            targetElement.appendChild(sourceElement);
          }
        }
      } else {
        // If no breakpoint is active, move element back to its original position
        if (sourceElement.parentNode !== originalParent) {
          if (
            originalNextSibling &&
            originalNextSibling.parentNode === originalParent
          ) {
            originalParent.insertBefore(sourceElement, originalNextSibling);
          } else {
            originalParent.appendChild(sourceElement);
          }
        }
      }
    });
  }

  destroy() {
    window.removeEventListener("resize", this.handleResize);
  }
}

export default TransferElements;
