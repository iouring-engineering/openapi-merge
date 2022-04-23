import { Swagger } from "atlassian-openapi";

export function additionalInfoTitle(output: Swagger.SwaggerV3, title: string): Swagger.SwaggerV3 {
    if(title && title !== ""){
        output.info.title = title;
    }
    
    return output;
}

export function additionalInfoDescription(output: Swagger.SwaggerV3, description: string): Swagger.SwaggerV3 {
    if(description && description !== ""){
        output.info.description = description;
    }
    return output;
}