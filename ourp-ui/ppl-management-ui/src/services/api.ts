export type RequestInterceptor = (
input: RequestInfo,
init?: RequestInit,
) => Promise<[RequestInfo, RequestInit?]>;
export type ResponseInterceptor = (response: Response) => Promise<Response>;


export class ApiClient {
baseUrl: string;
requestInterceptors: RequestInterceptor[] = [];
responseInterceptors: ResponseInterceptor[] = [];


constructor(baseUrl = '/api') {
this.baseUrl = baseUrl;
}


useRequest(interceptor: RequestInterceptor) { this.requestInterceptors.push(interceptor); }
useResponse(interceptor: ResponseInterceptor) { this.responseInterceptors.push(interceptor); }


async request(path: string, init?: RequestInit) {
  let input: RequestInfo = this.baseUrl + path;
  let config: RequestInit | undefined = {
    headers: { 'Content-Type': 'application/json' },
    ...(init || {}),
  };
for (const i of this.requestInterceptors) {
[input, config] = await i(input, config);


}


const res = await fetch(input, config);
let intercepted = res;
for (const i of this.responseInterceptors) {
intercepted = await i(intercepted);
}
return intercepted;
}


get<T>(path: string) { return this.request(path).then((r) => r.json() as Promise<T>); }
}


export const api = new ApiClient('/api');


// Example interceptors
api.useRequest(async (input, init) => {
const token = localStorage.getItem('token');
return [input, { ...init, headers: { ...(init?.headers || {}), Authorization: token ? `Bearer ${token}` : '' } }];
});
api.useResponse(async (res) => {
if (!res.ok) console.error('API error', res.status, res.statusText);
return res;
});