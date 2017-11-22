const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  // return graphql(``)

  return graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fileAbsolutePath
              fields {
                slug
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

      data.allMarkdownRemark.edges.forEach(({ node }) => {
        const isDocs = node.fileAbsolutePath.match(/src\/pages\/docs\//);
        const templatePath = `./src/templates/${isDocs ? 'docs-md': 'md'}.js`;

        createPage({
          path: node.fields.slug,
          component: path.resolve(templatePath),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        })
      });
    });
};
