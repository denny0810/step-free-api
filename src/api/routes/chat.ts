import _ from 'lodash';

import Request from '@/lib/request/Request.ts';
import Response from '@/lib/response/Response.ts';
import chat from '@/api/controllers/chat.ts';

// 容器环境变量 `CHAT_AUTHORIZATION` 
const CHAT_AUTHORIZATION = process.env.CHAT_AUTHORIZATION;
const DEBUG_MODE = process.env.DEBUG_MODE;

export default {
    prefix: '/v1/chat',

    post: {

        '/completions': async (request: Request) => {
            request
                .validate('body.messages', _.isArray)
                .validate('headers.authorization', v => _.isUndefined(v) || _.isString(v))
            
            if (DEBUG_MODE === 'ON' || DEBUG_MODE === 'on') {
                console.log('[DEBUG] Raw authorization:', request.headers.authorization);
            }

            // Check if authorization header exists and has enough characters
            const authHeader = request.headers.authorization;
            const authContent = authHeader && authHeader.startsWith("Bearer ") 
              ? authHeader.slice(7) // Remove "Bearer " prefix
              : "";
            
            // Use CHAT_AUTHORIZATION if authContent is less than 30 characters or undefined
            if (!authContent || authContent.length < 30) {
              request.headers.authorization = "Bearer " + CHAT_AUTHORIZATION;
            }

            // refresh_token切分
            const tokens = chat.tokenSplit(authHeader);
            // 随机挑选一个refresh_token
            const token = _.sample(tokens);
          
            if (DEBUG_MODE === 'ON' || DEBUG_MODE === 'on') {
              console.log('[DEBUG] CHAT_AUTHORIZATION:', CHAT_AUTHORIZATION);
              console.log('[DEBUG] Using authHeader:', request.headers.authorization);
              console.log('[DEBUG] Tokens:', tokens);
              console.log('[DEBUG] Token:', token);
            } 
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
