import axios from "axios";

export const client = axios.create({
    baseURL: 'https://37d6-81-16-204-128.ngrok-free.app/',
    headers: {
        'Content-Type': 'application/json',
    }
});