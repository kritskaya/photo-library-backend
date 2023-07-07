import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsIntOrNull', async: true })
class IsIntOrNullConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return Number.isInteger(value) || null;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must be a number or null`;
  }
}

export function IsIntOrNull(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIntOrNullConstraint,
    });
  };
}
