# @iouring-engineering/openapi-merge-cli

This tool is based on the [![npm](https://img.shields.io/npm/v/@iouring-engineering/openapi-merge?label=@iouring-engineering/openapi-merge&logo=npm)](https://www.npmjs.com/package/@iouring-engineering/openapi-merge) library. Please read
that README for more details on how the merging algorithm works.

This library is intended to be used for merging multiple OpenAPI 3.0 files together. The most common reason that developers want to do this is because
they have multiple services that they wish to expose underneath a single API Gateway. Therefore, even though this merging logic is sufficiently generic to be
used for most use cases, some of the feature decisions are tailored for that specific use case.

## Getting started

In order to use this merging cli tool you need to have one or more OpenAPI 3.0 files that you wish to merge. Then you need to create a configuration file,
called `openapi-merge.json` by default, in your current directory. It should look something like this:

``` json
{
  "inputs": [
    {
      "inputFile": "./gateway.swagger.json"
    },
    {
      "inputFile": "./jira.swagger.json",
      "pathModification": {
        "stripStart": "/rest",
        "prepend": "/jira"
      },
       "operationSelection": {
          "includeTags": [
            "Login"
          ],
          "includePaths": [
            {
              "path": "/account/login/*",
              "method": "post"
            }
          ],
          "excludePaths": [
            {
              "path": "/account/login/*",
              "method": "get"
            }
          ]
      },
      "description": {
        "append": true,
        "title": {
          "value": "Jira",
          "headingLevel" : 2
        }
      }
    },
    {
      "inputFile": "./confluence.swagger.yaml",
      "dispute": {
        "prefix": "Confluence"
      },
      "pathModification": {
        "prepend": "/confluence"
      },
      "operationSelection": {
        "excludeTags": ["excluded"]
      }
    }
  ],
  "output": "./output.swagger.json",
  "servers": [
        {
            "url": "https://{environment}.nxtbolt.in",
            "description": "Hosted environment",
            "variables": {
                "environment": {
                    "default": "dev-api",
                    "enum": [
                        "dev-api"
                    ],
                    "description": "dev environment"
                }
            }
        }
  ],
  "title": "example tile",
  "description": "Config example description for open-merge-cli"
}
```

In this configuration you specify your inputs and your output file. For each input you have the following parameters:

* `inputFile` or `inputURL`: the relative path (or URL), from the `openapi-merge.json`, to the OpenAPI schema file for that input (in JSON or Yaml format).
* `dispute`: if two inputs both define a component with the same name then, in order to prevent incorrect overlaps, we will attempt to use the dispute prefix or suffix to come up with a unique name for that component. Please [read the documentation for more details on the format](https://github.com/iouring-engineering/openapi-merge/wiki/configuration-definitions-dispute).
* `pathModification.stripStart`: When copying over the `paths` from your OpenAPI specification for this input, it will strip this string from the start of the path if it is found.
* `pathModification.prepend`: When copying over the `paths` from your OpenAPI specification for this input, it will prepend this string to the start of the path if it is found. `prepend` will always run after `stripStart` so that it is deterministic.
* `operationSelection.includeTags`: Only operations that are tagged with the tags configured here will be extracted from the OpenAPI file and merged with the others. This instruction will not remove other tags from the top level tags definition for this input.
* `operationSelection.excludeTags`: Only operations that are NOT tagged with the tags configured here will be extracted from the OpenAPI file and merged with the others. Also, these tags will also be removed from the top level `tags` element for this file before being merged. If a single REST API operation has an `includeTags` reference and an `excludeTags` reference then the exclusion rule will take precidence.
* `operationSelection.includePaths`: Operations which are tagged in `includeTags` and `excludeTags` also wants to include only specific paths from included tags.

``` json
{
"includePaths": [
      {
        "path": "/account/portfolio/*",
        "method": "get"
      }
],
}
 - path : exact or pattern match can be provided as input here, if path is a pattern match use `*` at the end as above.
 - method: there might be a case that same path for multiple http methods, so additionally http method of path which we want to include should be given as input.
```

* `operationSelection.excludePaths`: Operations which are tagged in `includeTags` and `excludeTags` again wants to exclude few paths from those tags, this rule will do that.

``` json
{
  "excludePaths": [
        {
          "path": "/account/portfolio/*",
          "method": "get"
        }
  ],
}
 - path : Exact or pattern match can be provided as input here, if path is a pattern match use `*` at the end as above.
 - method: As in excludePaths we may have multiple same path for multiple http methods, as per OpeanApi all the http methods can be input here.
 Ex : Possible values are anyone from `'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace'`

```

* `description.append`: All of the inputs with `append: true` will have their `info.description`s merged together, in order, and placed in the output OpenAPI file in the `info.description` section.
* `description.title.value`: An optional string that lets you specify a custom section title for this input's description when it is merged together in the output OpenAPI file's `info.description` section
* `description.title.headingLevel`: The integer heading level for the title, `1` to `6`. The default is `1`.
* `servers`: Additional config for servers if we have more micro services and if we have separate server config, here exact server configs should be followed as per the OpenApi specification.
* `title`: Title to show on the Info section of specification, if we want to show some different title when we have more micro services.
* `description`: Title to show on the Info section of specification, if we want to show some different title when we have more micro services.

result.yaml

``` yaml
info:
  title: title test
  description: description test from config

```

And then, once you have your Inputs in place and your configuration file you merely run the following in the directory that has your configuration file:

``` bash
npx @iouring-engineering/openapi-merge-cli
```

For more fine grained details on what `Configuration` options are available to you. [Please read the docs](https://github.com/iouring-engineering/openapi-merge/wiki/README).

If you wish, you may write your configuration file in YAML format and then run:

``` shell
npx @iouring-engineering/openapi-merge-cli --config path/to/openapi-merge.yaml
```

And the merge should be run and complete! Congratulations and enjoy!

If you experience any issues then please [raise them in the bug tracker][1].

 [1]: https://github.com/iouring-engineering/openapi-merge/issues/new
