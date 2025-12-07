import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics Textbook',
  tagline: 'A comprehensive guide to Physical AI and Humanoid Robotics for industry engineers',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // MUST MATCH YOUR GH-PAGES URL
  url: 'https://muhammadtalha678.github.io',

  // MUST MATCH YOUR REPO NAME EXACTLY
  baseUrl: '/',

  organizationName: 'Muhammadtalha678',
  projectName: 'Physical-AI-Humanoid-Robotics',
  deploymentBranch: 'gh-pages',
  trailingSlash: true,

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {type: ['rss', 'atom'], xslt: true},
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Textbook',
        },
        {to: '/search', label: 'Search', position: 'left'},
      ],
    },
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'physical-ai-humanoid-robotics',
      contextualSearch: true,
      externalUrlRegex: 'external\\.com|domain\\.com',
      replaceSearchResultPathname: {
        from: '/docs/',
        to: '/',
      },
      searchParameters: {},
      searchPagePath: 'search',
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Textbook',
          items: [{label: 'Introduction', to: '/docs/intro'}],
        },
        {
          title: 'Resources',
          items: [
            {label: 'ROS 2 Documentation', href: 'https://docs.ros.org/en/humble/'},
            {label: 'NVIDIA Isaac Sim', href: 'https://docs.omniverse.nvidia.com/isaacsim/latest/what_is_isaac_sim.html'},
            {label: 'Gazebo Simulator', href: 'https://gazebosim.org/'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub', href: 'https://github.com/Muhammadtalha678/Physical-AI-Humanoid-Robotics'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Textbook. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
