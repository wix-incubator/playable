import htmlToElement from '../htmlToElement';

type ITooltipStyles = {
  tooltip: string;
  tooltipHidden: string;
  tooltipInner: string;
};

type ITooltipTemplateProps = {
  title: string;
  styles: ITooltipStyles;
};

// TODO: replace template with `dotjs` template
function createTooltipTemplate({
  title,
  styles,
}: ITooltipTemplateProps): string {
  return `
    <div class="${styles.tooltip}" role="tooltip">
      <div class="${styles.tooltipInner}">${title}</div>
    </div>
  `;
}

function createTooltipNode(props: ITooltipTemplateProps): HTMLElement {
  return htmlToElement(createTooltipTemplate(props));
}

export { ITooltipStyles };

export default createTooltipNode;
