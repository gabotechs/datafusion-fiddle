/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        const rewrites = {
            afterFiles: [
                // apply any of your existing rewrites here
            ],
            fallback: []
        }

        // dev only, this allows for local api calls to be proxied to
        // api routes that use rust runtime
        if (process.env.NODE_ENV === 'development') {
            rewrites.fallback.push({
                source: '/api/:path*',
                destination: 'http://0.0.0.0:3001/api/:path*'
            })
        }

        return rewrites
    },
    // https://github.com/orgs/vercel/discussions/103#discussioncomment-6356642
    experimental: {
        outputFileTracingExcludes: {
            '*': [
                'node_modules/@swc/core-linux-x64-gnu',
                'node_modules/@swc/core-linux-x64-musl',
                'node_modules/@esbuild/linux-x64',
            ],
        },
    },
};

export default nextConfig;
