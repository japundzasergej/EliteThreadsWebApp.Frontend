export class ImagesDTO implements IImagesDTO {
  imageBytes?: string | undefined;
  contentType?: string | undefined;
  imageUrl?: string | undefined;

  constructor(data?: IImagesDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.imageBytes = _data['imageBytes'];
      this.contentType = _data['contentType'];
    }
  }

  static fromJS(data: any): ImagesDTO {
    data = typeof data === 'object' ? data : {};
    let result = new ImagesDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['imageBytes'] = this.imageBytes;
    data['contentType'] = this.contentType;
    return data;
  }
}

export interface IImagesDTO {
  imageBytes?: string | undefined;
  contentType?: string | undefined;
  imageUrl?: string | undefined;
}
