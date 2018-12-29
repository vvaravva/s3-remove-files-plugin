# NOT READY!

# S3 Remove Files Plugin

Webpack plugin for remove files from s3.

## Install

```bash
npm install --save-dev s3-remove-files-plugin
```

## Usage

In your `webpack.config.js`

```javascript
const S3RemoveFilesPlugin = require('s3-remove-files-plugin');

module.exports = {
    // ...
    plugins: [
        new S3RemoveAssetsPlugin({
            config: {
                accessKeyId: process.env.S3_CREDENTIALS_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_CREDENTIALS_SECRET_ACCESS_KEY,
                region: process.env.S3_REGION
            },
            params: {
                Bucket: process.env.S3_BUCKET,
                Prefix: process.env.S3_BASE_PATH + 'assets'
            },
            var: 'BUILD_NUMBER', // variable name
            test: /\.(js|css|gz)/,
            count: 5 // number of builds to save
        })
    ]
};
```