import { Swagger } from "atlassian-openapi";


export function serverConfiguration(output: Swagger.SwaggerV3, servers: Swagger.Server[]): Swagger.SwaggerV3 {
    if (servers.length > 0) {
        output.servers = servers;
    }
    return output;
}