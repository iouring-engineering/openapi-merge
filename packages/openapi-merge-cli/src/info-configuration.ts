import { Swagger } from "atlassian-openapi";

export function additionalInfo(output: Swagger.SwaggerV3, info: Swagger.Info): Swagger.SwaggerV3 {
    if(info){
        output.info = info;
    }
    
    return output;
}