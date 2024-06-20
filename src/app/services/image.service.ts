import { HttpClient, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG_SERVICE } from '../appconfig/app.config.service';
import { ImagesDTO } from '../types/image-dto.types';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly httpClient = inject(HttpClient);
  private readonly gatewayEndpoint = inject(APP_CONFIG_SERVICE).gatewayEndpoint;
  private readonly url = `${this.gatewayEndpoint}/image-upload`;
  uploadImage(dto: ImagesDTO, httpOptions: any) {
    const req = new HttpRequest('POST', this.url, dto, httpOptions);
    return this.httpClient.request(req);
  }
}
