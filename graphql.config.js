require("@next/env").loadEnvConfig(".");

const config = {
	dedupeOperationSuffix: true,
	dedupeFragments: true,
	pureMagicComment: false,
	exportFragmentSpreadSubTypes: true,
	namingConvention: "keep",
	skipDocumentsValidation: false,
};

console.log(`Loading graphql.config.js with env: ${process.env.DATOCMS_ENVIRONMENT}`);

module.exports = {
	schema: {
		"https://graphql.datocms.com": {
			headers: {
				Authorization: process.env.GRAPHQL_API_TOKEN,
				"X-Environment": process.env.DATOCMS_ENVIRONMENT || "main",
				"X-Exclude-Invalid": true,
			},
		},
	},
	documents: "graphql/**/*.gql",
	extensions: {
		codegen: {
			overwrite: true,
			generates: {
				"@types/datocms.d.ts": {
					plugins: ["typescript", "typescript-operations"],
					config: { ...config, noExport: true },
				},
				"graphql/index.ts": {
					plugins: ["typed-document-node"],
					config,
				},
				"@types/document-modules.d.ts": {
					plugins: ["typescript-graphql-files-modules"],
					config,
				},
			},
		},
	},
};
