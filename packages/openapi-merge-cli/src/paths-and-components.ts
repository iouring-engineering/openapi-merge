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
