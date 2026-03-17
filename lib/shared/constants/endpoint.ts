export const Endpoint = {
    MOVIES: '/api/movies',
    AUTH: '/api/auth',
} as const;

export type EndpointKey = (typeof Endpoint)[keyof typeof Endpoint];