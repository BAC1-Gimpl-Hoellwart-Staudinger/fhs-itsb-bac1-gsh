import axios from 'axios';

// https://www.youtube.com/watch?v=lyNetvEfvT0

function sendApiRequest(url, options = {}) {
    const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });

    return api(url, options)
        .then((response) => response.data)
        .catch((error) => Promise.reject(error?.response?.data?.message || error?.message));
}

function getDataset(startDate, endDate, numberOfEmployees) {
    return sendApiRequest('/generate', {
        method: 'GET',
        data: {
            startDate,
            endDate,
            numberOfEmployees,
        },
    });
}

export { getDataset };
