const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;
  const parentNode = getNode(node.parent);

  if (node.internal.type === `MarkdownRemark` && parentNode.internal.type === `File`) {
    let slug = createFilePath({ node: parentNode, getNode, basePath: `pages` });

    if (parentNode.sourceInstanceName === 'docs') {
      slug = `docs${slug}`;
    }

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;


  return graphql(`
      {
        allFile {
          edges {
            node {
              sourceInstanceName
              childMarkdownRemark {
                fields {
                  slug
                }
              }
            }
          }
        }
      }
    `
    ).then(({ errors, data }) => {
      if (errors) {
        return Promise.reject(errors);
      }

      data.allFile.edges.forEach(({ node }) => {
        if (node.childMarkdownRemark) {
          const markdown = node.childMarkdownRemark;
          const isDocs = node.sourceInstanceName === 'docs';
          const templatePath = `./src/templates/${isDocs ? 'docs-md' : 'md'}.js`;

          createPage({
            path: markdown.fields.slug,
            component: path.resolve(templatePath),
            context: {
              // Data passed to context is available in page queries as GraphQL variables.
              slug: markdown.fields.slug,
            },
          })
        }
      });
    });
};
