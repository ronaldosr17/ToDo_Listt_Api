export const validateSchema = (schema, source = 'body') => (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
        const details = result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        return res.status(400).json({ errors: details });
    }

    if (source === 'query') {
        req.validatedQuery = result.data;
    } else {
        req[source] = result.data;
    }
    next();
};