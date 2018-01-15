// TODO: replace template with `dotjs` template
function createTooltipContainerTemplate({ styles }): string {
  return `
    <div class="${styles.tooltipContainer}"></div>
  `;
}

export default createTooltipContainerTemplate;
