import { Sort } from 'mongodb';

export const transformSort = (sort?: any): Sort => {
  const newSort: Sort = {};

  if (!sort) return newSort;

  for (const key of Object.keys(sort)) {
    if ((key.match(/_/g) || []).length > 1) {
      newSort[key.replace(/_/g, '.').replace('.link', '_link')] = sort[key];
    }
  }

  return newSort;
};
