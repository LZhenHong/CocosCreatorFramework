import { BaseModel } from "../model/BaseModel";
import BaseManager from "../utility/BaseManager";
import { Constructor } from "../utility/GameUtility";

enum RequestMethod {
    GET,
    POST,
    PUT,
    DELETE,
    HEAD,
}

export abstract class NetworkRequest {
    method: RequestMethod = RequestMethod.GET;
    path: string = '';
    timeout: number = 10;
    retryCount: number = 0;
    log: boolean = true;
    showErrorCodeTips: boolean = true;
    parameters: Map<string, any> = new Map();
    success: (rspData: NetworkResponse<BaseModel>) => void;
    failure: (error: Error) => void;
    timeoutFunc: () => void;

    net_xmlHTTPRequest: XMLHttpRequest = null;

    net_onSuccess(rspText: string) {
        let rsp = rspText;
        if (!rsp || rsp.length <= 0) {
            rsp = '{}';
        }
        if (this.log) {
            console.log(`request path: '${this.path}', rsp text: ${rsp}`);
        }
        let rspJSON = JSON.parse(rsp)[this.path];
        let response = new NetworkResponse<BaseModel>();
        if (rspJSON) {
            response.rspJSON = rspJSON;

            response.request = this;
            response.serverTime = rspJSON['serverTime'];
            response.message = rspJSON['message'];
            response.errorCode = parseInt(rspJSON['code']);
        }


        if (!response.isSuccess) {
            this.net_onFailure(response.error);
        } else {
            response.rspModel = this.convertHttpResponse(rspJSON);
            this.success && this.success(response);
        }
    }

    net_onFailure(error: Error) {
        this.failure && this.failure(error);

        if (this.showErrorCodeTips) {
            // show error tips
        }
    }

    net_onTimeout() {
        this.timeoutFunc && this.timeoutFunc();
    }

    get requestText(): string {
        let parameters = {};
        this.parameters.forEach((val, key) => {
            parameters[key] = val;
        });
        parameters['method'] = this.path;
        parameters['commData'] = this.commonData;
        return JSON.stringify(parameters);
    }

    private get commonData(): any {
        let commonData = this.nativeCommonData;
        commonData['time'] = Date.now();
        return commonData;
    }

    private get nativeCommonData(): any {
        let commonData = {};
        return commonData;
    }

    net_textForSend() {
        let requestText = this.requestText;
        return `message=${encodeURIComponent(requestText)}`;
    }

    cancel() {
        this.net_xmlHTTPRequest && this.net_xmlHTTPRequest.abort();
    }

    abstract convertHttpResponse(responseJson: any): BaseModel | null;
}

export class NetworkResponse<T extends BaseModel> {
    errorCode: RequestErrorCode = RequestErrorCode.None;
    message: string = '';
    serverTime: number = 0;
    request: NetworkRequest = null;
    rspJSON: any = null;

    get isSuccess(): boolean {
        return this.errorCode === RequestErrorCode.Success;
    }

    get error(): Error {
        let error = new Error();
        error.name = RequestErrorCode[this.errorCode];
        error.message = this.message;
        return error;
    }

    rspModel: T = null;
}

enum RequestErrorCode {
    None = 0,
    NoRequestClazz = 100,
    RequestFailed = 101,
    Success = 200,
};

export default class NetworkManager extends BaseManager {
    protected onInit() { }
    protected onDestroy() { }

    baseUrl: string = '';

    GET(urlPath: string,
        success: (rspData: NetworkResponse<BaseModel>) => void,
        failure?: (error: Error) => void): NetworkRequest {
        let requestClazz = this.requestClazzNameForUrlPath(urlPath);
        if (requestClazz) {
            let request = new requestClazz();
            request.path = urlPath;
            request.success = success;
            request.failure = failure;
            this.sendRequest(request);
            return request;
        } else {
            let error = this.errorForCode(RequestErrorCode.NoRequestClazz);
            failure && failure(error);
        }
        return null;
    }

    POST(urlPath: string,
        parameters: Map<string, any> | null,
        success: (rspData: NetworkResponse<BaseModel>) => void,
        failure?: (error: Error) => void): NetworkRequest {
        let requestClazz = this.requestClazzNameForUrlPath(urlPath);
        if (requestClazz) {
            let request = new requestClazz();
            request.method = RequestMethod.POST;
            request.path = urlPath;
            request.parameters = parameters ?? new Map<string, any>();
            request.success = success;
            request.failure = failure;
            this.sendRequest(request);
            return request;
        } else {
            let error = this.errorForCode(RequestErrorCode.NoRequestClazz);
            failure && failure(error);
        }
        return null;
    }

    private sendRequest(request: NetworkRequest) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && (xhr.status >= 200 || xhr.status < 400)) {
                let rspText = xhr.responseText;
                request.net_onSuccess(rspText);
            }
        };
        xhr.ontimeout = () => {
            request.net_onTimeout();
        };
        xhr.timeout = request.timeout * 1000;

        let method = RequestMethod[request.method];
        xhr.open(method, this.baseUrl, true);
        xhr.responseType = 'text';
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        let sendText = request.net_textForSend();
        xhr.send(sendText);

        if (request.log) {
            console.log(`send request path: '${request.path}', params: ${JSON.stringify(request.requestText)}.`);
        }

        request.net_xmlHTTPRequest = xhr;
    }

    private requestClazzNameForUrlPath(urlPath: string): Constructor<NetworkRequest> {
        let lastPathComponent = cc.path.basename(urlPath);
        let firstChar = lastPathComponent.charAt(0);
        let clazzName = firstChar.toUpperCase() + lastPathComponent.substring(1) + 'Request';
        let clazz = cc.js.getClassByName(clazzName) as Constructor<NetworkRequest>;
        return clazz;
    }

    private errorForCode(errorCode: RequestErrorCode): Error {
        let error = new Error();
        error.name = RequestErrorCode[errorCode];
        switch (errorCode) {
            case RequestErrorCode.NoRequestClazz:
                error.message = '没有对应的请求类';
                break;
            case RequestErrorCode.RequestFailed:
                error.message = '网络请求失败';
                break;
        }
        return error;
    }

}
