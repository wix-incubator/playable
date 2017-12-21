import Slugger from 'github-slugger';

const slugger = new Slugger();

function createLinksTree(headings) {
  return headings.reduce(
    (acc, heading) => {
      const link = {
        ...heading,
        to: `#${slugger.slug(heading.value)}`,
        children: [],
      };

      if (link.depth === 1) {
        acc.last = link;
        acc.tree.push(link);
      } else {
        acc.last.children.push(link);
      }

      return acc;
    },
    { tree: [], last: null }
  ).tree;
}

export default createLinksTree;
