export const Endpoint = {
    MOVIES: '/api/movies',
    AUTH: '/api/auth',
    CATEGORIES: '/api/categories',
} as const;

export type EndpointKey = (typeof Endpoint)[keyof typeof Endpoint];