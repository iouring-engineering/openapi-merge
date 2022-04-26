## The @iouring-engineering/openapi-merge repository

Welcome to the openapi-merge repository. This library is intended to be used for merging multiple OpenAPI 3.0 files together. The most common reason that developers want to do this is because they have multiple services that they wish to expose underneath a single API Gateway. Therefore, even though this merging logic is sufficiently generic to be used for most use cases, some of the feature decisions are tailored for that specific use case.

This is an extension of npm library [openapi-merge](https://www.npmjs.com/package/openapi-merge), we forked existing library code from [Github](https://github.com/robertmassaioli/openapi-merge) to add some additional features according to our micro services architecture.

Requirements we had:

- Exclude or Include Api in specific tag based on path(with pattern) and HTTP method
    * Reason : We have two different micro services, admin and customer module which has same tag called Login and it has API's as below, here Login tag is common for both micro services, but only login API is common which we want to include in merge file and ignore account/get-customer from admin module.
        * Admin Login:
            1. account/login
            2. account/get-customer

        * Customer Login:
            1. account/get-details
            2. account/get-bills

- Server config
    * Reason : If we have multiple specifications, earlier implementation takes only first specification server config as final merged config, but consider we have different gateway for merged specification, we may need different server config to include in merged document.

- Info title and description
    * Reason : As we have multiple specifications, we cannot add first specification's title and description into merged specification, so we had included those configs to meet out requirements.

Have brief understanding from below docs :

* [@iouring-engineering/openapi-merge](https://github.com/iouring-engineering/openapi-merge/blob/main/packages/openapi-merge/README.md)

* [@iouring-engineering/openapi-merge-cli](https://github.com/iouring-engineering/openapi-merge/blob/main/packages/openapi-merge-cli/README.md)

### Screenshots

![Imgur](https://i.imgur.com/GjnSXCS.png)
(An example of creating an openapi-merge.json configuration file for the CLI tool)

### About this repository

This is a multi-package repository that contains:

* The @iouring-engineering/openapi-merge library: [![npm](https://img.shields.io/npm/v/@iouring-engineering/openapi-merge?label=@iouring-engineering/openapi-merge&logo=npm)](https://www.npmjs.com/package/@iouring-engineering/openapi-merge)
* The @iouring-engineering/openapi-merge CLI tool: [![npm](https://img.shields.io/npm/v/@iouring-engineering/openapi-merge-cli?label=@iouring-engineering/openapi-merge-cli&logo=npm)](https://www.npmjs.com/package/@iouring-engineering/openapi-merge-cli)

Depending on your use-case, you may wish to use the CLI tool or the library in your project. Please see the readme file of the specific package for more details.

### Developing on openapi-merge

This project is a multi-package repository and uses the [bolt][1] tool to manage these packages in one development experience.

After checking out this repository, you can run the following command to install the required dependencies:

``` shell
bolt install
```

You can then test running the CLI tool by running:

``` shell
yarn cli
```

If you wish to ensure that you can develop on the `@iouring-engineering/openapi-merge` library in parallel to the `@iouring-engineering/openapi-merge-cli` tool
then you must run the Typescript build for `@iouring-engineering/openapi-merge` in watch mode. You can do this by:

``` shell
bolt w openapi-merge build -w
```

This will ensure that the Typescript is compiled into JavaScript so that it can be used by the `@iouring-engineering/openapi-merge-cli` tool.

For the other operations that you wish to perform, please see the package.json of the other packages in this repository.

 [1]: https://github.com/boltpkg/bolt