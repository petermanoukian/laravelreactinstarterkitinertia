// resources/js/lib/axios.ts
import axios from 'axios';

const instance = axios.create({
    baseURL: '/', // Same origin
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
    },
});

export default instance;
