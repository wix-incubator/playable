// TODO: replace template with `dotjs` template
function createTooltipTemplate({ styles }): string {
  return `
    <div class="${styles.tooltip} ${styles.tooltipHidden}" role="tooltip">
      <div class="${styles.tooltipInner}" data-hook="tooltipInner"></div>
    </div>
  `;
}

export default createTooltipTemplate;
