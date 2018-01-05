// temp solution before migrating to templates
export function nodeFromString(html: string): Element {
  const node = document.createElement('tmp')
  node.innerHTML = html
  return node.firstElementChild
}

export function enterFullScreen(svgStyle: string): Element {
  return nodeFromString(`
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
      <path class=${svgStyle} d="M2 10H0v4h4v-2H2v-2zM0 1v3h2V2h2V0H0v1zm14-1h-4v2h2v2h2V0zm-2 12h-2v2h4v-4h-2v2z"/>
    </svg>
  `)
}

export function exitFullScreen(svgStyle: string): Element {
  return nodeFromString(`
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
      <path class=${svgStyle} d="M4 21h2v-6H0v2h4v4zM6 0H4v4H0v2h6V0zm9 6h6V4h-4V0h-2v6zm2 11h4v-2h-6v6h2v-4z"/>
    </svg>
  `)
}

