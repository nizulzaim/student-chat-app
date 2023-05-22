export const paginatedResultCreator = <T>({
  count,
  items,
  limit,
  page,
}: {
  count: number;
  items: T[];
  limit: number;
  page: number;
}) => {
  return {
    items,
    count,
    page,
    hasNextPage: count / limit > page,
    hasPreviousPage: page > 1,
  };
};
