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
      description:
        'An API for open access to financial accounts to send and receive payments.',
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
            { label: 'Open Payments flow', link: '/introduction/op-flow/' },
            {
              label: 'Wallet addresses',
              link: '/introduction/wallet-addresses/'
            },
            {
              label: 'Grant negotiation and authorization',
              link: '/introduction/grants/'
            },
            {
              label: 'HTTP message signatures',
              link: '/introduction/http-signatures/'
            },
            {
              label: 'Authentication',
              link: '/introduction/authentication/'
            },
            { label: 'Glossary', link: '/introduction/glossary/' }
          ]
        },
        {
          label: 'Code snippets',
          collapsed: true,
          items: [
            {
              label: 'Getting started',
              link: '/snippets/overview/'
            },
            {
              label: 'Grants',
              collapsed: true,
              items: [
                {
                  label: 'Request a grant for an incoming payment',
                  link: '/snippets/grant-incoming'
                }
              ]
            },
            {
              label: 'Incoming payments',
              collapsed: true,
              items: [
                {
                  label: 'Create an incoming payment',
                  link: '/introduction/authentication/'
                }
              ]
            },
            {
              label: 'Quotes',
              collapsed: true,
              items: [
                {
                  label: 'Create a quote',
                  link: '/introduction/authentication/'
                }
              ]
            },
            {
              label: 'Outgoing payments',
              collapsed: true,
              items: [
                {
                  label: 'Create an outgoing payment',
                  link: '/introduction/authentication/'
                }
              ]
            },
            {
              label: 'Payment pointers',
              collapsed: true,
              items: [
                {
                  label: 'Get a payment pointer info',
                  link: ''
                }
              ]
            },
            {
              label: 'Tokens',
              collapsed: true,
              items: [
                {
                  label: 'Rotate a token',
                  link: '/introduction/authentication/'
                }
              ]
            }
          ]
        },
        {
          label: 'Guides',
          collapsed: true,
          items: [
            {
              label: 'Create a grant request',
              link: '/guides/create-grant-request/'
            },
            {
              label: 'Continue an interaction',
              link: '/guides/continue-interaction/'
            },
            {
              label: 'Make a payment',
              link: '/guides/make-payment/'
            },
            {
              label: 'Use cases',
              collapsed: true,
              items: [
                {
                  label: 'Send a tip',
                  link: '/introduction/authentication/'
                }
              ]
            }
          ]
        },
        // Add the generated sidebar groups to the sidebar.
        {
          label: 'API specification',
          collapsed: true,
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
