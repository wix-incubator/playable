import Slugger from 'github-slugger';

function createLinksTree(headings) {
  const slugger = new Slugger();

  return headings.reduce((tree, heading) => {
    const link = {
      ...heading,
      to: `#${slugger.slug(heading.value)}`,
      children: [],
    };

    if (link.depth === 1) {
      tree.push(link);
    } else {
      tree[tree.length - 1].children.push(link);
    }

    return tree;
  }, []);
}

export default createLinksTree;
