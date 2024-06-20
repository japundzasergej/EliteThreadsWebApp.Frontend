export class CreateCollectionDTO implements ICreateCollectionDTO {
  collectionName?: string | undefined;

  constructor(data?: ICreateCollectionDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.collectionName = _data['collectionName'];
    }
  }

  static fromJS(data: any): CreateCollectionDTO {
    data = typeof data === 'object' ? data : {};
    let result = new CreateCollectionDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['collectionName'] = this.collectionName;
    return data;
  }
}

export interface ICreateCollectionDTO {
  collectionName?: string | undefined;
}

export class CreateDiscountDTO implements ICreateDiscountDTO {
  discountName?: string | undefined;
  discountAmount?: number;

  constructor(data?: ICreateDiscountDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.discountName = _data['discountName'];
      this.discountAmount = _data['discountAmount'];
    }
  }

  static fromJS(data: any): CreateDiscountDTO {
    data = typeof data === 'object' ? data : {};
    let result = new CreateDiscountDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['discountName'] = this.discountName;
    data['discountAmount'] = this.discountAmount;
    return data;
  }
}

export interface ICreateDiscountDTO {
  discountName?: string | undefined;
  discountAmount?: number;
}

export class DiscountDTO implements IDiscountDTO {
  discountId?: number;
  discountName?: string | undefined;
  discountAmount?: number;

  constructor(data?: IDiscountDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.discountId = _data['discountId'];
      this.discountName = _data['discountName'];
      this.discountAmount = _data['discountAmount'];
    }
  }

  static fromJS(data: any): DiscountDTO {
    data = typeof data === 'object' ? data : {};
    let result = new DiscountDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['discountId'] = this.discountId;
    data['discountName'] = this.discountName;
    data['discountAmount'] = this.discountAmount;
    return data;
  }
}

export interface IDiscountDTO {
  discountId?: number;
  discountName?: string | undefined;
  discountAmount?: number;
}

export class CollectionsDTO implements ICollectionsDTO {
  collectionId?: number;
  collectionName?: string | undefined;

  constructor(data?: ICollectionsDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.collectionId = _data['collectionId'];
      this.collectionName = _data['collectionName'];
    }
  }

  static fromJS(data: any): CollectionsDTO {
    data = typeof data === 'object' ? data : {};
    let result = new CollectionsDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['collectionId'] = this.collectionId;
    data['collectionName'] = this.collectionName;
    return data;
  }
}

export interface ICollectionsDTO {
  collectionId?: number;
  collectionName?: string | undefined;
}
export class PromotionsDTO implements IPromotionsDTO {
  promotionId?: number;
  message?: string;

  constructor(data?: IPromotionsDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.promotionId = _data['promotionId'];
      this.message = _data['message'];
    }
  }

  static fromJS(data: any): PromotionsDTO {
    data = typeof data === 'object' ? data : {};
    let result = new PromotionsDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['promotionId'] = this.promotionId;
    data['message'] = this.message;
    return data;
  }
}

export interface IPromotionsDTO {
  promotionId?: number;
  message?: string;
}

export class CreatePromotionDTO implements ICreatePromotionDTO {
  message?: string;

  constructor(data?: IPromotionsDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.message = _data['message'];
    }
  }

  static fromJS(data: any): PromotionsDTO {
    data = typeof data === 'object' ? data : {};
    let result = new PromotionsDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['message'] = this.message;
    return data;
  }
}

export interface ICreatePromotionDTO {
  message?: string;
}
