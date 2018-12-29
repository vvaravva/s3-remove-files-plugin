const AWS = require('aws-sdk');

class S3RemoveFilesPlugin {
    constructor(options) {
        this.name = 'S3RemoveFilesPlugin';
        this.options = options;
        this.params = {
            Bucket: this.options.params.Bucket,
            Delete: { Objects: [] }
        };
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tapPromise(this.name, this.handle.bind(this));
    }

    handle() {
        this.config();
        this.connect();

        return this.removeFiles();
    }

    config() {
        AWS.config.update(this.options.config);
    }

    connect() {
        this.s3 = new AWS.S3();
    }

    async removeFiles() {
        let listedObjects = await this.s3.listObjectsV2(this.options.params).promise();

        if (!listedObjects.Contents.length) return;

        listedObjects.Contents.forEach(({ Key }) => {
            if (this.reg.test(Key)) return;
            this.params.Delete.Objects.push({ Key });
        });

        await this.s3.deleteObjects(params).promise();

        if (listedObjects.IsTruncated) await this.removeFiles();
    }

    get reg() {
        let str = '';

        for (let i = 0; i < this.options.count; i++) {
            str += process.env[this.options.var] - i + '|';
        }

        return new RegExp(`\\.(${str})\\.`);
    }
}

module.exports = S3RemoveFilesPlugin;