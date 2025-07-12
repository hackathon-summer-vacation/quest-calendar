import { backend } from './config';

const config = {
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID || '',
      userPoolClientId: process.env.EXPO_PUBLIC_USER_POOL_CLIENT_ID || '',
      region: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
    },
  },
};

export default config;
