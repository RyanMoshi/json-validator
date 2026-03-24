'use strict';

function coerce(value, targetType) {
  if (value === null || value === undefined) return value;
  switch (targetType) {
    case 'number': {
      const n = Number(value);
      return isNaN(n) ? value : n;
    }
    case 'boolean':
      if (value === 'true' || value === '1' || value === true) return true;
      if (value === 'false' || value === '0' || value === false) return false;
      return value;
    case 'string':
      return String(value);
    case 'array':
      if (typeof value === 'string') {
        try { const p = JSON.parse(value); return Array.isArray(p) ? p : value; } catch (_) {}
      }
      return value;
    default:
      return value;
  }
}

function coerceObject(obj, schema) {
  if (!schema || !schema.properties) return obj;
  const out = Object.assign({}, obj);
  Object.keys(schema.properties).forEach((k) => {
    if (out[k] !== undefined && schema.properties[k].type) {
      out[k] = coerce(out[k], schema.properties[k].type);
    }
  });
  return out;
}

module.exports = { coerce, coerceObject };
