import axios from 'axios';

// https://www.youtube.com/watch?v=lyNetvEfvT0

function sendApiRequest(url, options = {}) {
    const api = axios.create({
        // eslint-disable-next-line no-undef
        baseURL: (process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_URL : process.env.REACT_APP_API_URL_DEV),
        //crossDomain: true,
        //withCredentials: true,
    });

    return api(url, options)
        .then((response) => response.data)
        .catch((error) => Promise.reject('Error: ' + error?.response?.data?.error || error?.message));
}

function getDataset(startDate, endDate, numberOfEmployees) {
    return sendApiRequest('/generate', {
        method: 'GET',
        params: {
            startDate,
            endDate,
            numEmployees: numberOfEmployees,
        },
    });
}

function getSchedule(dataset) {
    return sendApiRequest('/generate/', {
        method: 'POST',
        data: {
            ...dataset,
        },
    });
}

function getStats(dataset) {
    return sendApiRequest('/stats/', {
        method: 'POST',
        data: {
            ...dataset,
        },
    });
}

export { getDataset, getSchedule, getStats };
