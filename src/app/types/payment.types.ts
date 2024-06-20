export class StripeCheckoutResponse implements IStripeCheckoutResponse {
  sessionId?: string | undefined;
  pubKey?: string | undefined;

  constructor(data?: IStripeCheckoutResponse) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.sessionId = _data['sessionId'];
      this.pubKey = _data['pubKey'];
    }
  }

  static fromJS(data: any): StripeCheckoutResponse {
    data = typeof data === 'object' ? data : {};
    let result = new StripeCheckoutResponse();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['sessionId'] = this.sessionId;
    data['pubKey'] = this.pubKey;
    return data;
  }
}

export interface IStripeCheckoutResponse {
  sessionId?: string | undefined;
  pubKey?: string | undefined;
}
