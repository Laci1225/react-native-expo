import axios from "axios";

export const client = axios.create({
    baseURL: 'https://9287-81-16-205-250.ngrok-free.app',
    headers: {
        'Content-Type': 'application/json',
    }
});