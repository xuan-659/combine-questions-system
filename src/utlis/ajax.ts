import { SESSION_ID_KEY } from "@/common/constants";
import axios from "axios";
import Storage from "./localStorage";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { catchException } from "./error";
import { formData } from "./form-data";

const storage = new Storage();
// const baseURL = 'http://47.114.146.52:8080';
// const baseURL = 'http://127.0.0.1:4523/mock/949932'
const baseURL = "http://39.101.197.160:8081/njupt-compose-paper-system";

axios.interceptors.request.use(
    (config) => {
        const sessionId = storage.get(SESSION_ID_KEY);
        if (config.method == "post") {
            config.params = {};
        }
        if (sessionId) {
            config.headers.token = sessionId;
        }
        return config;
    },
    (error) => {
        // TODO: 错误处理
    }
);

export default class AJAX {
    @catchException(true)
    public async get<T>(url: string, data?: any, config?: AxiosRequestConfig) {
        const mergedConfig = { ...config, params: data };
        return await axios.get<T>(baseURL + url, mergedConfig);
    }

    @catchException(true)
    public async post<T>(url: string, data: any, config?: AxiosRequestConfig) {
        if (
            url == "/knowledge/save" ||
            url == "/ability/save" ||
            url == "/knowledge/remove" ||
            url == "/ability/remove" ||
            url == "/question/compose" ||
            url == "/paper/use"
        ) {
            const mergedConfig = { ...config, params: data };
            return await axios.post<T>(baseURL + url, data, mergedConfig);
        } else {
            const mergedConfig = { ...config, params: formData(data) };
            return await axios.post<T>(
                baseURL + url,
                formData(data),
                mergedConfig
            );
        }
    }
}
