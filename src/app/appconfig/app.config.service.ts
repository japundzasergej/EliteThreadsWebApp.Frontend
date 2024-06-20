import { InjectionToken } from "@angular/core";
import { AppConfig } from "./app.config.interface";
import { AUDIENCE, CLIENT_ID, DOMAIN, GATEWAY_URL } from "../../environment/environment.config";

export const APP_CONFIG_SERVICE = new InjectionToken<AppConfig>('app.config');
export const APP_CONFIG: AppConfig = {
    gatewayEndpoint: GATEWAY_URL,
    domain: DOMAIN,
    clientId: CLIENT_ID,
    audience: AUDIENCE
};