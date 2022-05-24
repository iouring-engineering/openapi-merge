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
    }
    output.tags = sortedTags;
    return output
}