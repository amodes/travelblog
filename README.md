# Unlimited Hills Travel blog

A Travel Blog for [unlimitedhills.com](https://unlimitedhills.com).
The content is managed by the Headless CMS from [Contentful](https://www.contentful.com/)
It got created with Next.js & Contentful, pre-designed with optimized & adjustable pages, components, and data management. For styling I used Tailwind CSS.
The blog is hosted by Vercel. Both Contentful and Vercel offer free plans, so if you accept a `.vercel.app` domain, you can have a completely free blog.

Shoutout to Contentful and its [Starter Templates](https://www.contentful.com/starter-templates/), which offered a template for this project and helped a lot guiding me through the usage of a headless CMS and taking SEO seriously.

![The blog of unlimitedhills.com](blog-unlimited-hills.png 'The blog of unlimitedhills.com')


$~$

## Features

- SEO ready. The Starter Template had many content-models already predefined, so even for a beginner in SEO it was actually quite easy to get a 100 Google Lighthouse score by just filling out the pre-defined SEO fields on the CMS side and being careful about optimized image size.
![unlimitedhills.com lighthouse score](lighthouse-score.png 'unlimitedhills.com lighthouse score')
- Composable content through powerful & flexible content modeling.
- Localization ready.
- Incremental Static Regeneration with Next.js.
- Generation of GraphQL typed code (schema, and types), in sync with the content types through graphql-codegen.
- Enhanced Developer Experience with TypeScript.

$~$

## Begin your journey with Contentful and the Blog Starter Template

Follow this [guide](https://github.com/contentful/template-blog-webapp-nextjs/blob/main/docs/tutorials/contentful-and-the-starter-template.md/?utm_source=github.com-guide&utm_medium=referral&utm_campaign=template-blog-webapp-nextjs) to understand the relationship between
Contentful and the Starter Template source code through guided steps:

- Entry editing, and updates preview in the Starter Template application (online/locally)
- Content type editing in the Contentful web app, as well as in the Starter Template's code

$~$
## Getting started

To get started, read the following guidelines.

- [Environment variables](./README.md#environment-variables)
- [Dependencies](./README.md#dependencies)
- [Development](./README.md#development)
- [Contentful API & GraphQL](./README.md#contentful-api--graphql)

$~$

### Environment variables

In order to authenticate the requests to the Contentful APIs, the following values are necessary:

- Your space ID: [https://www.contentful.com/help/find-space-id/](https://www.contentful.com/help/find-space-id/)
- Contentful Delivery API token: [https://www.contentful.com/developers/docs/references/content-delivery-api/](https://www.contentful.com/developers/docs/references/content-delivery-api/)
- Contentful Preview API token: [https://www.contentful.com/developers/docs/references/content-preview-api/](https://www.contentful.com/developers/docs/references/content-preview-api/)

Rename the `.env.example` file to `.env` and add the necessary values.

$~$

### Dependencies

To install the necessary dependencies, run:

```bash
yarn
```

### Run the Starter Template in development mode

```bash
yarn dev
```

The Starter Template should be up and running on `http://localhost:3000`.

All necessary dependencies are installed under `node_modules` and any necessary tools can be accessed via npm scripts.

$~$

## Development

### Node

It is recommended to use the Node version listed in the `.nvmrc` file, we recommend using [nvm](https://github.com/nvm-sh/nvm) to easily switch between Node versions.

$~$


### Contentful API & GraphQL

This project makes use of Contentful's [GraphQL API](https://www.contentful.com/developers/docs/references/graphql/).

API calls made to the Contentful GraphQL endpoint are made through `graphql-request`.

The types are generated from the `.graphql` files located in the `/lib/graphql/` directory:

1. `lib/graphql/[fileName].graphql` is detected by the [codegen](./README.md#graphql--code-generation)
2. `lib/__generated/sdk.ts` is generated
3. Within the generated file, their types and a new `getSdk` function are generated
4. The `getSdk` function can now be imported and used within the `getStaticProps` in the pages files

$~$

### GraphQL & code generation

We use `graphql-codegen` to generate a type-safe API client, utilizing [GraphQLClient](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-graphql-request) as the "client".

---

#### Commands

In order to (re-)generate the GraphQL schema, types and sdk, please use either of the following commands:

- `yarn graphql-codegen:generate` generates a schema, types and code to fetch data from the Contentful APIs
- `yarn graphql-codegen:watch` similar to the `generate` command, but it runs as a watch task which will rerun the steps when changes are made in the `.graphql` files

The first steps of the codegen generate files that contain the GraphQL schema and matching TypeScript types. All these files are located in the `src/lib/graphql` folder.
They're generated to the `src/lib/__generated` folder and ought to be committed once altered/added to the repository.

The TS types for these files are generated in the same location, in a `__generated` folder and like the other files ought to be committed.

---

### Adjustments in code

1. Set a unique value for `process.env.CONTENTFUL_PREVIEW_SECRET` in your environment variables. This value should be kept secret and only known to the API route and the CMS.
2. Configure the entry preview URLs in Contentful to match the draft API route's URL structure. This can be done in the Contentful web interface under "Settings" for each content type. For more information see: https://www.contentful.com/help/setup-content-preview/#preview-content-in-your-online-environment
3. The draft mode API route is already written in the app and can be found in `pages/api/draft.page.tsx`. This route checks for a valid secret and slug before redirecting to the corresponding page\*.
4. To disable draft mode, navigate to the `/api/disable-draft` route. This route already exists in the app and can be found in `pages/api/disable-draft.page.tsx`.

_\*The `slug` field is optional; When not passed we redirect the page to the root of the domain._

### Adjustments in Contentful

1. Next, you will need to configure your Contentful space to use the correct preview URLs. To do this, go to the "Settings" section of your space, and click on the "Content Preview" tab. From here, you can configure the preview URLs for each of your content models.
2. Edit all content models that need a preview url. We usually expect that to only be the models prefixed with `📄 page -`.
3. Add a new URL with the following format: `https://<your-site>/api/draft?secret=<token>&slug={entry.fields.slug}`. Make sure to replace `<your-site>` with the URL of your Next.js site, and `<token>` with the value of `process.env.CONTENTFUL_PREVIEW_SECRET`. Optionally, a `locale` parameter can be passed.
4. Now, when you view an unpublished entry in Contentful, you should see a "Preview" button that will take you to the preview URL for that entry. Clicking this button should show you a preview of the entry on your Next.js site, using the draft API route that we set up earlier.


## Design System
This app uses Contentful's Forma 36 Design System. If you see color codes like this `text-gray800`
and wonder where those are defined, you can find them in the [Forma 36 docs](https://f36.contentful.com/tokens/color-system)

