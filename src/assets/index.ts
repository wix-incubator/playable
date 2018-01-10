// temp solution before migrating to templates
export function nodeFromString(html: string): Element {
  const node = document.createElement('tmp');
  node.innerHTML = html;
  return node.firstElementChild;
}

export function enterFullScreen(svgFill: string): Element {
  return nodeFromString(`
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
      <path class="${svgFill}" fill-rule="evenodd" d="M2 10H0v4h4v-2H2v-2zM0 1v3h2V2h2V0H0v1zm14-1h-4v2h2v2h2V0zm-2 12h-2v2h4v-4h-2v2z"/>
    </svg>
  `);
}

export function exitFullScreen(svgFill: string): Element {
  return nodeFromString(`
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
      <path class="${svgFill}" fill-rule="evenodd" d="M4 21h2v-6H0v2h4v4zM6 0H4v4H0v2h6V0zm9 6h6V4h-4V0h-2v6zm2 11h4v-2h-6v6h2v-4z"/>
    </svg>
  `);
}

export function overlayPlay({ svgFill, svgStroke }): Element {
  return nodeFromString(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
        <g fill="none" fill-rule="evenodd">
            <circle cx="18" cy="18" r="17" class="${svgStroke}" stroke-width="2"/>
            <path class="${svgFill}" d="M23.935 17.708l-10.313 6.033V11.676z"/>
        </g>
    </svg>
  `);
}

export function pause(svgStyle: string): Element {
  return nodeFromString(`
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14">
        <path class="${svgStyle}" d="M7 0h3v14H7V0zM0 0h3v14H0V0z"/>
    </svg>
  `);
}

export function play(svgStyle: string): Element {
  return nodeFromString(`
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14">
        <path class="${svgStyle}" d="M.079 0L0 14l10.5-7.181z"/>
    </svg>
  `);
}

export function viewOnSite(svgStyle: string): Element {
  return nodeFromString(`
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
        <path class="${svgStyle}" d="M2 12h10v-2h2v4H0V0h4v2H2v10zm10-8.515L7.414 8.071 6 6.657 10.657 2H9.004V0H14v5.005h-2v-1.52z"/>
    </svg>
  `);
}

export function volume0({ svgFill }): Element {
  return nodeFromString(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" viewBox="0 0 17 14">
      <g class="${svgFill}">
        <path d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/>
        <path fill-rule="nonzero" d="M13 6.257l-2.05-2.05-.743.743L12.257 7l-2.05 2.05.743.743L13 7.743l2.05 2.05.743-.743L13.743 7l2.05-2.05-.743-.743L13 6.257z"/>
      </g>
    </svg>
  `);
}

export function volume50({ svgFill, svgStroke }): Element {
  return nodeFromString(`
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14">
      <g fill="none" fill-rule="evenodd">
        <path class="${svgFill}" d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/>
        <path class="${svgStroke}" d="M9.853 10.837a5.45 5.45 0 0 0 0-7.707"/>
      </g>
    </svg>
  `);
}

export function volume100({ svgFill, svgStroke }): Element {
  return nodeFromString(`
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14">
      <g fill="none" fill-rule="evenodd">
        <path class="${svgFill}" d="M0 3.919h2.993v5.97H0V3.92zm2.995-.015L7 .924v12L2.995 9.882v-5.98z"/>
        <path class="${svgStroke}" d="M12.793 13.716a9.607 9.607 0 0 0 0-13.586M9.853 10.837a5.45 5.45 0 0 0 0-7.707"/>
      </g>
    </svg>
  `);
}
