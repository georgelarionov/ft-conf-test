
module.exports = {
    reactStrictMode: true,
    
    // Настройка изображений
    images: {
        domains: ['appserver.faithtribe.io', 'configurator.site'],
        formats: ['image/avif', 'image/webp'],
    },
    
    // Сжатие
    compress: true,
    
    // Оптимизация production сборки
    productionBrowserSourceMaps: false,
    
    async rewrites() {
        const isProduction = process.env.NODE_ENV === 'production';
        const isProxy = process.env.NEXT_PUBLIC_IS_PROXY === 'true';
        
        // Включаем прокси если IS_PROXY=true или мы не в production
        if (!isProduction || isProxy) {
            return [
                {
                    destination: 'https://appserver.faithtribe.io/:path*',
                    source: '/api/:path*', // Proxy to Backend
                },
            ];
        }

        return [];
    },
    
    // Заголовки для безопасности и производительности
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    }
                ]
            }
        ];
    },
    
    webpack(config, { isServer }) {
        // SVG поддержка
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });
        
        // Оптимизация для 3D моделей
        config.module.rules.push({
            test: /\.(gltf|glb)$/,
            type: 'asset/resource',
        });

        return config;
    },
    
    env: {
        DEBUG_SHOPIFY_ID: process.env.DEBUG_SHOPIFY_ID,
        DEBUG_DESIGNER_ID: process.env.DEBUG_DESIGNER_ID,
        IS_PROXY: process.env.IS_PROXY,
    }
};
