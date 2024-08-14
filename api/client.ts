import axios from "axios";

export const client = axios.create({
    baseURL: 'https://50df-195-20-152-114.ngrok-free.app',
    headers: {
        'Content-Type': 'application/json',
    }
});