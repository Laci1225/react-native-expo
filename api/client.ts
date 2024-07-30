import axios from "axios";

export const client = axios.create({
    baseURL: 'https://443b-81-16-207-70.ngrok-free.app/',
    headers: {
        'Content-Type': 'application/json',
    }
});