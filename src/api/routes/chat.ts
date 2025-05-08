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
                .validate('headers.authorization', _.isString)

            // 如果环境变量没有token则读取请求中的
            if (CHAT_AUTHORIZATION) {
                request.headers.authorization = "Bearer " + CHAT_AUTHORIZATION;
            }
            
            // refresh_token切分
            const tokens = chat.tokenSplit(request.headers.authorization);
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
