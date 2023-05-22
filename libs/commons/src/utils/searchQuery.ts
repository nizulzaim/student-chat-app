import { MasterEntity } from '@libs/databases/master.entity';
import { PaginationArgs } from '../types/paginated-input';

export const searchQuery = <T extends MasterEntity, P extends PaginationArgs>(
  input: Omit<P, 'page' | 'limit'>,
  fields: (keyof T)[],
) => {
  const { search, ...data } = input;

  const querySearch = fields.map((e) => ({
    [e]: { $regex: search ?? '', $options: 'i' },
  }));

  return {
    ...data,
    $and: [{ $or: querySearch }],
  };
};
