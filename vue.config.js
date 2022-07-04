const { defineConfig } = require("@vue/cli-service");

module.exports = { 
    devServer: {        
        host: '0.0.0.0',
        port: 8080,        
        allowedHosts: "all",
        historyApiFallback: true,
        proxy: {
            '/api/*': { 
            target: 'http://127.0.0.1:5000',
            changeOrigin: true,
            }, 
        },
    },
};