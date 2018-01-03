import htmlToElement from '../htmlToElement';
import * as styles from './tooltip.scss';

function createTooltipTemplate(title: string): string {
  return `
    <div class="${styles.tooltip}" role="tooltip">
      <div class="${styles['tooltip-inner']}">${title}</div>
    </div>
  `;
}

function createTooltipNode(title: string): HTMLElement {
  return htmlToElement(createTooltipTemplate(title));
}

export default createTooltipNode;
