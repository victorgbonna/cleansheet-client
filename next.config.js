// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)', 
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors http://localhost:3000', 
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
