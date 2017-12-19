const hasRequiredProperties = (required, data) => {
    const keys = Object.keys(data);
    const errors = [];
    for (value of required) {
        if (!keys.includes(value)) {
            errors.push({
                [value]: 'can\'t be blank'
            });
        }
    }
    return errors;
}

module.exports = {
    hasRequiredProperties
}
