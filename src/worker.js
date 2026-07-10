import { buildConfig } from './utils/env.js';
import { handleRequest } from './utils/handler.js';

export default {
    async fetch(request, env) {
        const e = buildConfig(request, env, false);
        try {
            const result = await handleRequest(e);

            return new Response(result.body, {
                status: result.status,
                headers: result.headers,
            });
        } catch (err) {
            return new Response(JSON.stringify(err.message), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
        }
    },
};
