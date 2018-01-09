import htmlToElement from '../htmlToElement';

const TOOLTIP_INNER_HOOK = 'tooltipInner';

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
      <div class="${
        styles.tooltipInner
      }" data-hook="${TOOLTIP_INNER_HOOK}">${title}</div>
    </div>
  `;
}

function createTooltipNode(props: ITooltipTemplateProps): HTMLElement {
  return htmlToElement(createTooltipTemplate(props));
}

export { ITooltipStyles, TOOLTIP_INNER_HOOK };

export default createTooltipNode;
