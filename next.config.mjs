import routes from "./lib/i18n/routes.js";

export const locales = ["sv", "en"];
export const defaultLocale = "sv";

const sassOptions = {
	includePaths: ["./components", "./pages"],
	prependData: `
    @use "sass:math";
    @import "./lib/styles/mediaqueries"; 
    @import "./lib/styles/fonts";
  `,
};

const i18Rewrites = async () => {
	const rewrites = [];

	Object.keys(routes).forEach((k) =>
		rewrites.push({
			destination: `/en/${routes[k].sv}/:path*`,
			source: `/en/${routes[k].en}/:path*`,
			locale: false,
		})
	);
	return rewrites;
};

export default async (phase, { defaultConfig }) => {
	/**
	 * @type {import('next').NextConfig}
	 */
	const nextConfig = {
		i18n: {
			locales,
			defaultLocale,
			localeDetection: false,
		},
		async rewrites() {
			return await i18Rewrites();
		},
		sassOptions,
		typescript: {
			ignoreBuildErrors: true,
		},
		eslint: {
			ignoreDuringBuilds: true,
		},
		devIndicators: {
			buildActivity: false,
		},
		experimental: {
			scrollRestoration: true,
		},
		webpack: (config, ctx) => {
			config.module.rules.push({
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: "graphql-tag/loader",
			});
			config.module.rules.push({
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				exclude: /node_modules/,
				use: ["@svgr/webpack"],
			});
			return config;
		},
	};
	return nextConfig;
};
