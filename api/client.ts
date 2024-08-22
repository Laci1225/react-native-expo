import axios from "axios";

export const client = axios.create({
    baseURL: 'https://d5fe-81-16-206-70.ngrok-free.app',
    headers: {
        'Content-Type': 'application/json',
    }
});