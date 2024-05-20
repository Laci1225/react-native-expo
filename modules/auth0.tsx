import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({ domain: 'dev-wnuf5ensk4dnqucn.eu.auth0.com',
    clientId: 'bnQybh7tRDrccZRxrnqe8Xz1TeahJYKo' });

export const CONNECTION = 'Username-Password-Authentication';
export const AUDIENCE = 'https://dev-wnuf5ensk4dnqucn.eu.auth0.com/api/v2/';

export default auth0;
