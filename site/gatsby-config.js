module.exports = {
  // NOTE: https://www.gatsbyjs.org/docs/path-prefix/
  pathPrefix: `/video-player.js`,
  siteMetadata: {
    title: 'video-player.js',
  },
  plugins: [
    'gatsby-plugin-react-next',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-sass',
    // NOTE: You can have multiple instances of this plugin
    // to read source nodes from different locations on your
    // filesystem.
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/../docs/`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-autolink-headers',
          'gatsby-remark-prismjs',
          'gatsby-remark-external-links'
        ],
      },
    },
  ],
};
