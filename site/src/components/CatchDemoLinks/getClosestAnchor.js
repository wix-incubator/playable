function getClosestAnchor(node, boundariesNode) {
  while (
    node.parentNode &&
    (!boundariesNode || boundariesNode.contains(node))
  ) {
    if (node.nodeName === 'A') {
      return node;
    }

    node = node.parentNode;
  }
}

export default getClosestAnchor;
