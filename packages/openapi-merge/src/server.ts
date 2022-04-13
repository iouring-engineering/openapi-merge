import { MergeInput } from './data';
import { Swagger } from 'atlassian-openapi';
import { getFirstMatching } from '.';


export function mergeServers(inputs: MergeInput): Swagger.Server[] | undefined {
    return getFirstMatching(inputs, input => input.oas.servers)
}