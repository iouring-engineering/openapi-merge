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

function removeRefPath(refPath: string): string {
    return refPath.replace("#/components/schemas/", "");
}

function isSchemaUsed(refs: string[], schemaName: string): boolean {
    return refs.includes(schemaName);
}

function removeDuplicates(refs: string[]): string[] {
    return [...new Set(refs)];
}

export function removeUnusedSchemas(output: Swagger.SwaggerV3): Swagger.SwaggerV3 {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        let refs = getAllRefs(output);
        for (const ind in refs) {
            refs[ind] = removeRefPath(refs[ind]);
        }
        refs = removeDuplicates(refs);

        const schemas = output.components && output.components.schemas ? output.components.schemas : {};
        if (refs.length === Object.keys(schemas).length) {
            break;
        }
        for (const schemaName in output.components?.schemas) {
            if (!isSchemaUsed(refs, schemaName)) {
                delete output.components?.schemas[schemaName];
            }
        }
    }
    return output;
}