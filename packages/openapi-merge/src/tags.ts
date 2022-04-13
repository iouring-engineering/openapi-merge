import { MergeInput } from './data';
import { Swagger } from 'atlassian-openapi';

function filterTags(originalTags: Swagger.Tag[], excludedTagNames: string[], includedTagNames: string[]): Swagger.Tag[] {
  if (excludedTagNames.length === 0 && includedTagNames.length === 0) {
    return originalTags;
  }

  if (excludedTagNames.length > 0) {
    originalTags = originalTags.filter(tag => !excludedTagNames.includes(tag.name))
  }

  if(includedTagNames.length > 0){
    originalTags = originalTags.filter(tag => includedTagNames.includes(tag.name))
  }

  return originalTags;
}

export function mergeTags(inputs: MergeInput): Swagger.Tag[] | undefined {
  const result = new Array<Swagger.Tag>();

  const seenTags = new Set<string>();
  inputs.forEach(input => {
    const { operationSelection } = input;
    const { tags } = input.oas;
    if (tags !== undefined) {
      const excludeTags = operationSelection !== undefined && operationSelection.excludeTags !== undefined ? operationSelection.excludeTags : [];
      const includeTags = operationSelection !== undefined && operationSelection.includeTags !== undefined ? operationSelection.includeTags : [];
      const filteredTags = filterTags(tags, excludeTags, includeTags);

      filteredTags.forEach(tag => {
        if (!seenTags.has(tag.name)) {
          seenTags.add(tag.name);
          result.push(tag);
        }
      });
    }
  });

  if (result.length === 0) {
    return undefined;
  }

  return result;
}