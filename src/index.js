'use strict';
// Validate JSON values against simple type schemas

function validate(value, schema, path) {
  path = path || 'root';
  const errors = [];

  if (schema.type) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== schema.type && !(schema.nullable && value === null)) {
      errors.push({ path, message: 'Expected ' + schema.type + ', got ' + actualType });
      return errors;
    }
  }

  if (schema.required && (value === undefined || value === null)) {
    errors.push({ path, message: 'Required field is missing' });
    return errors;
  }

  if (schema.type === 'string') {
    if (schema.minLength && value.length < schema.minLength)
      errors.push({ path, message: 'String too short (min ' + schema.minLength + ')' });
    if (schema.maxLength && value.length > schema.maxLength)
      errors.push({ path, message: 'String too long (max ' + schema.maxLength + ')' });
    if (schema.pattern && !new RegExp(schema.pattern).test(value))
      errors.push({ path, message: 'Does not match pattern ' + schema.pattern });
  }

  if (schema.type === 'number') {
    if (schema.min !== undefined && value < schema.min)
      errors.push({ path, message: 'Value below minimum ' + schema.min });
    if (schema.max !== undefined && value > schema.max)
      errors.push({ path, message: 'Value above maximum ' + schema.max });
  }

  if (schema.type === 'object' && schema.properties) {
    Object.keys(schema.properties).forEach((key) => {
      errors.push(...validate(value[key], schema.properties[key], path + '.' + key));
    });
  }

  if (schema.type === 'array' && schema.items) {
    value.forEach((item, i) => {
      errors.push(...validate(item, schema.items, path + '[' + i + ']'));
    });
  }

  return errors;
}

function isValid(value, schema) {
  return validate(value, schema).length === 0;
}

module.exports = { validate, isValid };
