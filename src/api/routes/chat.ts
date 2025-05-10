import _ from 'lodash';

import Request from '@/lib/request/Request.ts';
import Response from '@/lib/response/Response.ts';
import chat from '@/api/controllers/chat.ts';

// 容器环境变量 `CHAT_AUTHORIZATION` 
const CHAT_AUTHORIZATION = process.env.CHAT_AUTHORIZATION;

export default {

    prefix: '/v1/chat',

    post: {

        '/completions': async (request: Request) => {
            request
                .validate('body.messages', _.isArray)
                .validate('headers.authorization', v => _.isUndefined(v) || _.isString(v))

            // Use client-provided token if available; otherwise, use environment variable
            const authHeader = request.headers.authorization || 
                             (CHAT_AUTHORIZATION ? `Bearer ${CHAT_AUTHORIZATION}` : null);
            
            if (!authHeader) {
                throw new Error('Authorization header or environment variable must be provided');
            }

            // refresh_token切分
            const tokens = chat.tokenSplit(authHeader);
            // 随机挑选一个refresh_token
            const token = _.sample(tokens);
            const model = request.body.model;
            const messages =  request.body.messages;
            if (request.body.stream) {
                const stream = await chat.createCompletionStream(model, messages, token, request.body.use_search);
                return new Response(stream, {
                    type: "text/event-stream"
                });
            }
            else
                return await chat.createCompletion(model, messages, token, request.body.use_search);
        }

    }

}
