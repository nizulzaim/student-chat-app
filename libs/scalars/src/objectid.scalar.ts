import { CustomScalar, ID, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { ObjectId } from 'mongodb';

@Scalar('ID', () => ID)
export class ObjectIdScalar implements CustomScalar<string, ObjectId> {
  description = 'Mongo Object Id Scalar';

  parseValue(value: string) {
    if (value === '') return null;
    return new ObjectId(value); // value from the client
  }

  serialize(value: ObjectId) {
    return value.toString(); // value sent to the client
  }

  parseLiteral(ast: ValueNode) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value);
    }
    return null;
  }
}
