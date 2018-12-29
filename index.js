const AWS = require('aws-sdk');

class S3RemoveFilesPlugin {
    constructor(options) {
        AWS.config.update(options.config);
        this.name = 'S3RemoveFilesPlugin';
        this.options = options;
        this.s3 = new AWS.S3();
        this.params = {
            Bucket: this.options.params.Bucket,
            Delete: { Objects: [] }
        };
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tapPromise(this.name, this.handle.bind(this));
    }

    handle(compilation) {
        return this.removeData(compilation);
    }

    async removeData(compilation) {
        this.data = await this.getData();
        if (!this.data.Contents.length) return;


        this.prepareData(compilation);

        await this.s3.deleteObjects(this.params).promise();
        if (this.data.IsTruncated) await this.removeData();
    }

    getData() {
        return this.s3.listObjectsV2(this.options.params).promise();
    }

    prepareData(compilation) {
        this.data.Contents.forEach(({ Key }) => {
            if (this.reg(compilation).test(Key)) return;
            this.params.Delete.Objects.push({ Key });
        });
    }

    reg(compilation) {
        let str = '';

        for (let i = 0; i < this.options.count + 1; i++) {
            str += compilation[this.options.var] - i + '|';
        }

        return new RegExp(`\\.(${str})\\.`);
    }
}

module.exports = S3RemoveFilesPlugin;