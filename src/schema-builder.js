function createSchemaFor(value, options) {
    switch (typeof value) {
        case 'number':
            if (Number.isInteger(value)) {
                return { type: 'integer' };
            }
            return { type: 'number' };
        case 'boolean':
            return { type: 'boolean' };
        case 'string':
            return { type: 'string' };
        case 'object':
            if (value === null) {
                return { type: 'null' };
            }
            if (Array.isArray(value)) {
                return createSchemaForArray(value, options);
            }
            return createSchemaForObject(value, options);
    }
}

function createSchemaForArray(arr, options) {
    if (arr.length === 0) {
        return { type: 'array' };
    }
    const elementSchemas = arr.map((value) => createSchemaFor(value, options));
    const items = combineSchemas(elementSchemas);
    return { type: 'array', minItems: 1, items: items };
}

function createSchemaForObject(obj, options) {
    const keys = Object.keys(obj);
    if (keys.length === 0) {
        return {
            type: 'object',
        };
    }
    const properties = Object.entries(obj).reduce((props, [key, val]) => {
        props[key] = createSchemaFor(val, options);
        return props;
    }, {});

    const schema = { type: 'object', properties };
    if (!options?.noRequired) {
        schema.required = keys;
    }
    return schema;
}

function combineSchemas(schemas, options) {
    const schemasByType = {
        null: [],
        boolean: [],
        integer: [],
        number: [],
        string: [],
        array: [],
        object: [],
    };

    const unwrappedSchemas = unwrapSchemas(schemas);
    for (const unwrappedSchema of unwrappedSchemas) {
        const type = unwrappedSchema.type;
        if (schemasByType[type].length === 0 || isContainerSchema(unwrappedSchema)) {
            schemasByType[type].push(unwrappedSchema);
        } else {
            continue;
        }
    }

    const resultSchemasByType = {
        null: schemasByType.null[0],
        boolean: schemasByType.boolean[0],
        number: schemasByType.number[0],
        integer: schemasByType.integer[0],
        string: schemasByType.string[0],
        array: combineArraySchemas(schemasByType.array),
        object: combineObjectSchemas(schemasByType.object, options),
    };

    if (resultSchemasByType.number) {
        // if at least one value is float, others can be floats too
        delete resultSchemasByType.integer;
    }

    const schemasFound = Object.values(resultSchemasByType).filter(Boolean);
    const multiType = schemasFound.length > 1;
    if (multiType) {
        const wrapped = wrapAnyOfSchema({ anyOf: schemasFound });
        return wrapped;
    }
    return schemasFound[0];
}

function combineArraySchemas(schemas) {
    if (!schemas || schemas.length === 0) {
        return undefined;
    }
    const itemSchemas = [];
    for (const schema of schemas) {
        if (!schema.items) continue;
        const unwrappedSchemas = unwrapSchema(schema.items);
        itemSchemas.push(...unwrappedSchemas);
    }

    if (itemSchemas.length === 0) {
        return {
            type: 'array',
        };
    }
    const items = combineSchemas(itemSchemas);
    return {
        type: 'array',
        items: items,
    };
}

function combineObjectSchemas(schemas, options) {
    if (!schemas || schemas.length === 0) {
        return undefined;
    }
    const allPropSchemas = schemas.map((s) => s.properties).filter(Boolean);
    const schemasByProp = Object.create(null);
    for (const propSchemas of allPropSchemas) {
        for (const [prop, schema] of Object.entries(propSchemas)) {
            if (!schemasByProp[prop]) {
                schemasByProp[prop] = [];
            }
            const unwrappedSchemas = unwrapSchema(schema);
            schemasByProp[prop].push(...unwrappedSchemas);
        }
    }

    const properties = Object.entries(schemasByProp).reduce((props, [prop, schemas]) => {
        if (schemas.length === 1) {
            props[prop] = schemas[0];
        } else {
            props[prop] = combineSchemas(schemas);
        }
        return props;
    }, {});

    const combinedSchema = { type: 'object' };

    if (Object.keys(properties).length > 0) {
        combinedSchema.properties = properties;
    }
    if (!options?.noRequired) {
        const required = intersection(schemas.map((s) => s.required || []));
        if (required.length > 0) {
            combinedSchema.required = required;
        }
    }

    return combinedSchema;
}

function unwrapSchema(schema) {
    if (!schema) return [];
    if (schema.anyOf) {
        return unwrapSchemas(schema.anyOf);
    }
    if (Array.isArray(schema.type)) {
        return schema.type.map((x) => ({ type: x }));
    }
    return [schema];
}

function unwrapSchemas(schemas) {
    if (!schemas || schemas.length === 0) return [];
    const unwrappedSchemas = schemas.flatMap((schema) => unwrapSchema(schema));
    return unwrappedSchemas;
}

function wrapAnyOfSchema(schema) {
    const simpleSchemas = [];
    const complexSchemas = [];
    for (const subSchema of schema.anyOf) {
        if (Array.isArray(subSchema.type)) {
            simpleSchemas.push(...subSchema.type);
        } else if (isSimpleSchema(subSchema)) {
            simpleSchemas.push(subSchema.type);
        } else {
            complexSchemas.push(subSchema);
        }
    }
    if (complexSchemas.length === 0) {
        return { type: simpleSchemas };
    }
    const anyOf = [];
    if (simpleSchemas.length > 0) {
        anyOf.push({ type: simpleSchemas.length > 1 ? simpleSchemas : simpleSchemas[0] });
    }
    anyOf.push(...complexSchemas);
    return { anyOf };
}

function intersection(valuesArr) {
    if (valuesArr.length === 0) return [];
    const arrays = valuesArr.filter(Array.isArray);
    const counter = {};
    for (const arr of arrays) {
        for (const val of arr) {
            if (!counter[val]) {
                counter[val] = 1;
            } else {
                counter[val]++;
            }
        }
    }
    const result = Object.entries(counter)
        .filter(([_, value]) => value === arrays.length)
        .map(([key]) => key);
    return result;
}

function isSimpleSchema(schema) {
    const keys = Object.keys(schema);
    return keys.length === 1 && keys[0] === 'type';
}

function isContainerSchema(schema) {
    const type = schema.type;
    return type === 'array' || type === 'object';
}

// FACADE

export function createSchema(value, options) {
    if (typeof value === 'undefined') value = null;
    const clone = JSON.parse(JSON.stringify(value));
    return createSchemaFor(clone, options);
}

export function mergeSchemas(schemas, options) {
    const mergedSchema = combineSchemas(schemas, options);
    return mergedSchema;
}

export function extendSchema(schema, value, options) {
    const valueSchema = createSchema(value, options);
    const mergedSchema = combineSchemas([schema, valueSchema], options);
    return mergedSchema;
}

export function createCompoundSchema(values, options) {
    const schemas = values.map((value) => createSchema(value, options));
    return mergeSchemas(schemas, options);
}