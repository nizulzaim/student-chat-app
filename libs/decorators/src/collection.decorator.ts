export function Collection(tableName: string) {
  return function (target: any) {
    target._tableName = tableName;
  };
}
