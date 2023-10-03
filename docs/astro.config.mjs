import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import { generateAPI } from 'starlight-openapi'
// import overrideIntegration from './src/overrideIntegration.mjs'
import react from '@astrojs/react'

// Generate the documentation and get the associated sidebar groups.
const { openAPISidebarGroups, starlightOpenAPI } = await generateAPI([
  {
    base: 'apis/resource-server',
    label: 'Open Payments',
    schema: '../openapi/resource-server.yaml'
  },
  {
    base: 'apis/auth-server',
    label: 'Open Payments Authorization Server',
    schema: '../openapi/auth-server.yaml'
  }
])

// https://astro.build/config
export default defineConfig({
  site: 'https://openpayments.guide',
  integrations: [
    // overrideIntegration(),
    react(),
    starlight({
      title: 'Open Payments',
      customCss: [
        './node_modules/@interledger/docs-design-system/src/styles/green-theme.css',
        './node_modules/@interledger/docs-design-system/src/styles/ilf-docs.css',
        './src/styles/openpayments.css'
      ],
      logo: {
        src: './public/favicon.svg'
      },
      sidebar: [
        {
          label: 'Intro to Open Payments',
          items: [
            { label: 'Overview', link: '/introduction/overview/' },
            {
              label: 'Wallet addresses',
              link: '/introduction/wallet-addresses/'
            },
            { label: 'Authorization', link: '/introduction/authorization/' },
            {
              label: 'Grant negotiation and authorization',
              link: '/introduction/grants/'
            },
            { label: 'Open Payments flow', link: '/introduction/op-flow/' },
            { label: 'Glossary', link: '/introduction/glossary/' }
          ]
        },
        {
          label: 'Guides',
          autogenerate: {
            directory: 'guides'
          }
        },
        // Add the generated sidebar groups to the sidebar.
        {
          label: 'API references',
          items: openAPISidebarGroups
        }
      ]
    }),
    starlightOpenAPI()
  ],
  server: {
    port: 1104
  }
})
