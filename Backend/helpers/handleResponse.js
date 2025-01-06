const { errorException } = require('./errorException.js')

const handleResponse = (res, data) => {
    try {
        if (data instanceof Promise) {
            return data
                .then(results => res.json(results))
                .catch(error => errorException(error, res));
        }
        return res.json(data);
    } catch (error) {
        return errorException(error, res);
    }
};

module.exports = { handleResponse }