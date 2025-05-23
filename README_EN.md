# StepChat Free Service

[![](https://img.shields.io/github/license/llm-red-team/step-free-api.svg)](LICENSE)
![](https://img.shields.io/github/stars/llm-red-team/step-free-api.svg)
![](https://img.shields.io/github/forks/llm-red-team/step-free-api.svg)
![](https://img.shields.io/docker/pulls/vinlic/step-free-api.svg)

Supports high-speed streaming output, multi-turn dialogues, internet search, long document reading, image analysis, zero-configuration deployment, multi-token support, and automatic session trace cleanup.

Fully compatible with the ChatGPT interface.

Also, the following free APIs are available for your attention:

Moonshot AI (Kimi.ai) API to API [kimi-free-api](https://github.com/LLM-Red-Team/kimi-free-api/tree/master)

StepFun (StepChat) API to API [step-free-api](https://github.com/LLM-Red-Team/step-free-api)

Ali Tongyi (Qwen) API to API [qwen-free-api](https://github.com/LLM-Red-Team/qwen-free-api)

ZhipuAI (ChatGLM) API to API [glm-free-api](https://github.com/LLM-Red-Team/glm-free-api)

ByteDance (Doubao) API to API [doubao-free-api](https://github.com/LLM-Red-Team/doubao-free-api)

ByteDance (Jimeng) API to API [jimeng-free-api](https://github.com/LLM-Red-Team/jimeng-free-api)

Meta Sota (metaso) API to API [metaso-free-api](https://github.com/LLM-Red-Team/metaso-free-api)

Iflytek Spark (Spark) API to API [spark-free-api](https://github.com/LLM-Red-Team/spark-free-api)

Lingxin Intelligence (Emohaa) API to API [emohaa-free-api](https://github.com/LLM-Red-Team/emohaa-free-api) (OUT OF ORDER)

## Table of Contents

* [Announcement](#Announcement)
* [Effect Examples](#Effect-Examples)
* [Access preparation](#Access-Preparation)
    * [Multiple account access](#Multi-Account-Access)
* [Docker Deployment](#Docker-Deployment)
    * [Docker-compose Deployment](#Docker-compose-Deployment)
    * [Render Deployment](#Render-Deployment)
    * [Vercel Deployment](#Vercel-Deployment)
* [Native Deployment](#Native-Deployment)
* [Recommended Clients](#Recommended-Clients)
* [Interface List](#Interface-List)
    * [Conversation completion](#conversation-completion)
    * [Document Interpretation](#document-interpretation)
    * [Image analysis](#image-analysis)
    * [refresh_token survival detection](#refresh_token-survival-detection)
* [Precautions](#Precautions)
    * [Nginx anti-generation optimization](#Nginx-anti-generation-optimization)
    * [Token statistics](#Token-statistics)
* [Star History](#star-history)

## Announcement

**This API is unstable. So we highly recommend you go to the [StepChat](https://platform.stepfun.com/) use the offical API, avoiding banned.**

**This organization and individuals do not accept any financial donations and transactions. This project is purely for research, communication, and learning purposes!**

**For personal use only, it is forbidden to provide services or commercial use externally to avoid causing service pressure on the official, otherwise, bear the risk yourself!**

**For personal use only, it is forbidden to provide services or commercial use externally to avoid causing service pressure on the official, otherwise, bear the risk yourself!**

**For personal use only, it is forbidden to provide services or commercial use externally to avoid causing service pressure on the official, otherwise, bear the risk yourself!**

## Effect Examples

### Identity Verification

![Identity Verification](./doc/example-1.png)

### Multi-turn Dialogue

![Multi-turn Dialogue](./doc/example-2.png)

### Internet Search

![Internet Search](./doc/example-3.png)

### Long Document Reading

![Long Document Reading](./doc/example-4.png)

### Image Analysis

![Image Analysis](./doc/example-6.png)


## Access Preparation

Obtain `deviceId` and `Oasis-Token` from [yuewen.cn](https://yuewen.cn)

Enter StepChat and start a random conversation, then press F12 to open the developer tools.

1. Find the value of `deviceId` in Application > LocalStorage (remove quotation marks), for example: `267bcc81a01c2032a11a3fc6ec3e372c380eb9d1`
![example7](./doc/example-7.png)

2. Find the value of `Oasis-Token` in Application > Cookies, for example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
![example5](./doc/example-5.png)

3. Concatenate `deviceId` and `Oasis-Token` using `@` to create the Token, which will be used as the Bearer Token value for Authorization: `Authorization: Bearer 267bcc81a01c2032a11a3fc6ec3e372c380eb9d1@eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Multi-Account Access

You can provide multiple account refresh_tokens and use `,` to join them:

`Authorization: Bearer TOKEN1,TOKEN2,TOKEN3`

The service will pick one each time a request is made.

## Docker Deployment

Please prepare a server with a public IP and open port 8000.

Pull the image and start the service

```shell
docker run -it -d --init --name step-free-api -p 8000:8000 -e TZ=Asia/Shanghai vinlic/step-free-api:latest
```

check real-time service logs

```shell
docker logs -f step-free-api
```

Restart service

```shell
docker restart step-free-api
```

Shut down service

```shell
docker stop step-free-api
```

### Docker-compose Deployment

```yaml
version: '3'

services:
  step-free-api:
    container_name: step-free-api
    image: vinlic/step-free-api:latest
    restart: always
    ports:
      - "8000:8000"
    environment:
      - TZ=Asia/Shanghai
```

### Render Deployment

**Attention: Some deployment regions may not be able to connect to Kimi. If container logs show request timeouts or connection failures (Singapore has been tested and found unavailable), please switch to another deployment region!**

**Attention: Container instances for free accounts will automatically stop after a period of inactivity, which may result in a 50-second or longer delay during the next request. It is recommended to check [Render Container Keepalive](https://github.com/LLM-Red-Team/free-api-hub/#Render%E5%AE%B9%E5%99%A8%E4%BF%9D%E6%B4%BB)**

1. Fork this project to your GitHub account.

2. Visit [Render](https://dashboard.render.com/) and log in with your GitHub account.

3. Build your Web Service (`New+` -> `Build and deploy from a Git repository` -> `Connect your forked project` -> `Select deployment region` -> `Choose instance type as Free` -> `Create Web Service`).

4. After the build is complete, copy the assigned domain and append the URL to access it.

### Vercel Deployment

**Note: Vercel free accounts have a request response timeout of 10 seconds, but interface responses are usually longer, which may result in a 504 timeout error from Vercel!**

Please ensure that Node.js environment is installed first.

```shell
npm i -g vercel --registry http://registry.npmmirror.com
vercel login
git clone https://github.com/LLM-Red-Team/step-free-api
cd step-free-api
vercel --prod
```

### Zeabur Deployment

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/GRFYBP)

## Native Deployment

Please prepare a server with a public IP and open port 8000.

Please install the Node.js environment and configure the environment variables first, and confirm that the node command is available.

Install dependencies

```shell
npm i
```

Install PM2 for process guarding

```shell
npm i -g pm2
```

Compile and build. When you see the dist directory, the build is complete.

```shell
npm run build
```

Start service

```shell
pm2 start dist/index.js --name "step-free-api"
```

View real-time service logs

```shell
pm2 logs step-free-api
```

Restart service

```shell
pm2 reload step-free-api
```

Shut down service

```shell
pm2 stop step-free-api
```

## Recommended Clients

Using the following second-developed clients for free-api series projects is faster and easier, and supports document/image uploads!

[Clivia](https://github.com/Yanyutin753/lobe-chat)'s modified LobeChat [https://github.com/Yanyutin753/lobe-chat](https://github.com/Yanyutin753/lobe-chat)

[Time@](https://github.com/SuYxh)'s modified ChatGPT Web [https://github.com/SuYxh/chatgpt-web-sea](https://github.com/SuYxh/chatgpt-web-sea)

## interface list

Currently, the `/v1/chat/completions` interface compatible with openai is supported. You can use the client access interface compatible with openai or other clients, or use online services such as [dify](https://dify.ai/) Access and use.

### Conversation completion

Conversation completion interface, compatible with openai's [chat-completions-api](https://platform.openai.com/docs/guides/text-generation/chat-completions-api).

**POST /v1/chat/completions**

The header needs to set the Authorization header:

```
Authorization: Bearer [refresh_token]
```

Request data:
```json
{
    // Fill in the model name as you like.
    "model": "step",
    "messages": [
        {
            "role": "user",
            "content": "你是谁？"
        }
    ],
    // If using SSE stream, please set it to true, the default is false
    "stream": false
}
```

Response data:
```json
{
    "id": "85466015488159744",
    "model": "step",
    "object": "chat.completion",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "I am StepChat, a large multimodal model developed by StepFun. I can answer your questions, provide information and help, as well as support multimodal interactions such as text, images, etc. If you have any questions or need help, please feel free to ask me."
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 1,
        "completion_tokens": 1,
        "total_tokens": 2
    },
    "created": 1711829974
}
```

### Document interpretation

Provide an accessible file URL or BASE64_URL to parse.

**POST /v1/chat/completions**

The header needs to set the Authorization header:

```
Authorization: Bearer [refresh_token]
```

Request data:
```json
{
    // Fill in the model name as you like.
    "model": "step",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "file",
                    "file_url": {
                        "url": "https://mj101-1317487292.cos.ap-shanghai.myqcloud.com/ai/test.pdf"
                    }
                },
                {
                    "type": "text",
                    "text": "What does the document say?"
                }
            ]
        }
    ]
}
```

Response data:
```json
{
    "id": "85774360661086208",
    "model": "step",
    "object": "chat.completion",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "This is a doc about the magic of love. balabala..."
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 1,
        "completion_tokens": 1,
        "total_tokens": 2
    },
    "created": 1711903489
}
```

### Image analysis

Provide an accessible image URL or BASE64_URL to parse.

This format is compatible with the [gpt-4-vision-preview](https://platform.openai.com/docs/guides/vision) API format. You can also use this format to transmit documents for parsing.

**POST /v1/chat/completions**

The header needs to set the Authorization header:

```
Authorization: Bearer [refresh_token]
```

Request data:
```json
{
    // Fill in the model name as you like.
    "model": "step",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://k.sinaimg.cn/n/sinakd20111/106/w1024h682/20240327/babd-2ce15fdcfbd6ddbdc5ab588c29b3d3d9.jpg/w700d1q75cms.jpg"
                    }
                },
                {
                    "type": "text",
                    "text": "What does the image describe?"
                }
            ]
        }
    ]
}
```

Response data:
```json
{
    "id": "85773574417829888",
    "model": "step",
    "object": "chat.completion",
    "choices": [
        {
        "index": 0,
        "message": {
            "role": "assistant",
            "content": "This image shows the site of an event that appears to be the launch of some new product or technology."
        },
        "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 1,
        "completion_tokens": 1,
        "total_tokens": 2
    },
    "created": 1711903302
}
```

### refresh_token survival detection

Check whether refresh_token is alive. If live is not true, otherwise it is false. Please do not call this interface frequently (less than 10 minutes).

**POST /token/check**

Request data:
```json
{
    "token": "267bcc81a01c2032a11a3fc6ec3e372c380eb9d1@eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response data:
```json
{
    "live": true
}
```

## Notification

### Nginx anti-generation optimization

If you are using Nginx reverse proxy `step-free-api`, please add the following configuration items to optimize the output effect of the stream and optimize the experience.

```nginx
# Turn off proxy buffering. When set to off, Nginx will immediately send client requests to the backend server and immediately send responses received from the backend server back to the client.
proxy_buffering off;
# Enable chunked transfer encoding. Chunked transfer encoding allows servers to send data in chunks for dynamically generated content without knowing the size of the content in advance.
chunked_transfer_encoding on;
# Turn on TCP_NOPUSH, which tells Nginx to send as much data as possible before sending the packet to the client. This is usually used in conjunction with sendfile to improve network efficiency.
tcp_nopush on;
# Turn on TCP_NODELAY, which tells Nginx not to delay sending data and to send small data packets immediately. In some cases, this can reduce network latency.
tcp_nodelay on;
#Set the timeout to keep the connection, here it is set to 120 seconds. If there is no further communication between client and server during this time, the connection will be closed.
keepalive_timeout 120;
```

### Token statistics

Since the inference side is not in step-free-api, the token cannot be counted and will be returned as a fixed number!!!!!

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=LLM-Red-Team/step-free-api&type=Date)](https://star-history.com/#LLM-Red-Team/step-free-api&Date)
