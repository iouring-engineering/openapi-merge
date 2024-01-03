import { Swagger } from "atlassian-openapi";

function getTagData(tags: Swagger.Tag[], tagName: string): Swagger.Tag | undefined {
    let tag: Swagger.Tag | undefined;
    tags.forEach((value) => {
        if (value.name === tagName) {
            tag = value;
        }
    });
    return tag;
}

function addMissedOutTags(tags: Swagger.Tag[], sortedTags: Swagger.Tag[]): Swagger.Tag[] {
    const finaltags: Swagger.Tag[] = [];
    tags.forEach((item) => {
        if (!getTagData(sortedTags, item.name)) {
            finaltags.push(item);
        }
    });
    return finaltags;
}

export function sortTags(output: Swagger.SwaggerV3, tags: string[]): Swagger.SwaggerV3 {
    let sortedTags: Swagger.Tag[] = [];
    if (output.tags) {
        tags.forEach((item) => {
            const tagsData = getTagData(output.tags ? output.tags : [], item);
            if (tagsData) {
                sortedTags.push(tagsData)
            }
        });
        sortedTags = sortedTags.concat(addMissedOutTags(output.tags, sortedTags))
        output.tags = sortedTags;
    }
    return output
}

function getPathData(paths: Swagger.Paths, pathString: string): Swagger.PathItem {
    return paths[pathString];
}

function addMissedOutPaths(paths: Swagger.Paths, sortedPaths: Swagger.Paths): Swagger.PathItem {
    const finalPaths: Swagger.Paths = {};
    for (const pathName in paths) {
        if (!sortedPaths[pathName]) {
            finalPaths[pathName] = paths[pathName];
        }
    }
    return finalPaths;
}


export function sortPaths(output: Swagger.SwaggerV3, paths: string[]): Swagger.SwaggerV3 {
    const sortedPaths: Swagger.Paths = {};
    if (output.paths && output.tags) {
        paths.forEach((item) => {
            sortedPaths[item] = getPathData(output.paths, item);
        });
        const missedPaths = addMissedOutPaths(output.paths, sortedPaths);
        for (const pt in missedPaths) {
            sortedPaths[pt] = output.paths[pt];
        }
        output.paths = sortedPaths;
    }
    return output;
}

export function addCommonHeader(output: Swagger.SwaggerV3, headers: Swagger.Parameter[]): Swagger.SwaggerV3 {
    const pathsWithHeaders: Swagger.Paths = {};
    if (output.paths) {
        for (const pt in output.paths) {
            pathsWithHeaders[pt] = getPathData(output.paths, pt);
            if (pathsWithHeaders[pt] && pathsWithHeaders[pt].parameters) {
                pathsWithHeaders[pt].parameters?.concat(headers);
            } else if (pathsWithHeaders[pt]) {
                pathsWithHeaders[pt].parameters = headers;
            }
        }
        output.paths = pathsWithHeaders;
    }
    return output;
}

function getAllRefs(obj: Record<string, any>): string[] {
    const refs = [];
    for (const key in obj) {
        if (typeof obj[key] === "object") {
            const res: Array<string> = getAllRefs(obj[key]);
            for (const itrKey in res) {
                refs.push(res[itrKey]);
            }
        }
        if (key === "$ref") {
            refs.push(obj[key])
        }
    }
    return refs;
}

const compKeys = [
    "schemas", "responses", "parameters", "examples", "requestBodies", "headers", "links", "callbacks"
]

function getFilteredRefs(refs: string[], componentKey: string): string[] {
    return refs.filter((value) => {
        return value.includes(`#/components/${componentKey}/`)
    })
}

function deleteKey(output: Swagger.SwaggerV3, section: string, model: string): void {
    if (section === "schemas") {
        output.components?.schemas && delete output.components?.schemas[model]
    } else if (section === "responses") {
        output.components?.responses && delete output.components?.responses[model]
    } else if (section === "parameters") {
        output.components?.parameters && delete output.components?.parameters[model]
    } else if (section === "examples") {
        output.components?.examples && delete output.components?.examples[model]
    } else if (section === "requestBodies") {
        output.components?.requestBodies && delete output.components?.requestBodies[model]
    } else if (section === "headers") {
        output.components?.headers && delete output.components?.headers[model]
    } else if (section === "links") {
        output.components?.links && delete output.components?.links[model]
    } else if (section === "callbacks") {
        output.components?.callbacks && delete output.components?.callbacks[model]
    }
}

type CompKey = keyof Swagger.Components;
export function removeUnusedSchemas(output: Swagger.SwaggerV3): Swagger.SwaggerV3 {
    // eslint-disable-next-line no-constant-condition
    const refs = getAllRefs(output);
    for (const section in output.components) {
        if (compKeys.includes(section)) {
            const key = section as CompKey
            const keysInSection = Object.keys(output.components[key] as object)
            const filtered = getFilteredRefs(refs, key)
            for (const model of keysInSection) {
                if (!filtered.includes(`#/components/${key}/${model}`)) {
                    deleteKey(output, section, model)
                }
            }
        }
    }
    return output;
}