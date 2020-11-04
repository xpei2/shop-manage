import { request } from "./request";

export function postLogin(obj) {
    return request({
        url: "/login",
        method: "post",
        data: {
            username: obj.username,
            password: obj.password
        }
    });
}
