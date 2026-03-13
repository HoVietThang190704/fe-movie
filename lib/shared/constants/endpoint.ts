export const Endpoint = {
    MOVIES: '/api/movies',
} as const;

export type EndpointKey = (typeof Endpoint)[keyof typeof Endpoint];