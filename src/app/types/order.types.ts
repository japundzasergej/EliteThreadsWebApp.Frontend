//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v14.0.8.0 (NJsonSchema v11.0.1.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

export class OrderDTO implements IOrderDTO {
  orderHeader?: OrderHeaderDTO;
  orderDetails?: OrderDetailDTO[] | undefined;

  constructor(data?: IOrderDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.orderHeader = _data['orderHeader']
        ? OrderHeaderDTO.fromJS(_data['orderHeader'])
        : <any>undefined;
      if (Array.isArray(_data['orderDetails'])) {
        this.orderDetails = [] as any;
        for (let item of _data['orderDetails'])
          this.orderDetails!.push(OrderDetailDTO.fromJS(item));
      }
    }
  }

  static fromJS(data: any): OrderDTO {
    data = typeof data === 'object' ? data : {};
    let result = new OrderDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['orderHeader'] = this.orderHeader
      ? this.orderHeader.toJSON()
      : <any>undefined;
    if (Array.isArray(this.orderDetails)) {
      data['orderDetails'] = [];
      for (let item of this.orderDetails)
        data['orderDetails'].push(item.toJSON());
    }
    return data;
  }
}

export interface IOrderDTO {
  orderHeader?: OrderHeaderDTO;
  orderDetails?: OrderDetailDTO[] | undefined;
}

export class OrderDetailDTO implements IOrderDetailDTO {
  orderDetailId?: number;
  orderHeaderId?: string | undefined;
  orderHeader?: OrderHeaderDTO;
  selectedSize?: number;
  selectedColor?: string | undefined;
  productId?: number;
  orderProduct?: OrderProductDTO;
  quantity?: number;
  individualPrice?: number;

  constructor(data?: IOrderDetailDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.orderDetailId = _data['orderDetailId'];
      this.orderHeaderId = _data['orderHeaderId'];
      this.orderHeader = _data['orderHeader']
        ? OrderHeaderDTO.fromJS(_data['orderHeader'])
        : <any>undefined;
      this.selectedSize = _data['selectedSize'];
      this.selectedColor = _data['selectedColor'];
      this.productId = _data['productId'];
      this.orderProduct = _data['orderProduct']
        ? OrderProductDTO.fromJS(_data['orderProduct'])
        : <any>undefined;
      this.quantity = _data['quantity'];
      this.individualPrice = _data['individualPrice'];
    }
  }

  static fromJS(data: any): OrderDetailDTO {
    data = typeof data === 'object' ? data : {};
    let result = new OrderDetailDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['orderDetailId'] = this.orderDetailId;
    data['orderHeaderId'] = this.orderHeaderId;
    data['orderHeader'] = this.orderHeader
      ? this.orderHeader.toJSON()
      : <any>undefined;
    data['selectedSize'] = this.selectedSize;
    data['selectedColor'] = this.selectedColor;
    data['productId'] = this.productId;
    data['orderProduct'] = this.orderProduct
      ? this.orderProduct.toJSON()
      : <any>undefined;
    data['quantity'] = this.quantity;
    data['individualPrice'] = this.individualPrice;
    return data;
  }
}

export interface IOrderDetailDTO {
  orderDetailId?: number;
  orderHeaderId?: string | undefined;
  orderHeader?: OrderHeaderDTO;
  selectedSize?: number;
  selectedColor?: string | undefined;
  productId?: number;
  orderProduct?: OrderProductDTO;
  quantity?: number;
  individualPrice?: number;
}

export class OrderHeaderDTO implements IOrderHeaderDTO {
  orderHeaderId?: string | undefined;
  totalPrice?: number;
  userId?: string | undefined;
  personalInfo?: PersonalInfoDTO;
  dateCreated?: Date;
  orderCancelled?: boolean;
  paymentComplete?: boolean;

  constructor(data?: IOrderHeaderDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.orderHeaderId = _data['orderHeaderId'];
      this.totalPrice = _data['totalPrice'];
      this.userId = _data['userId'];
      this.personalInfo = _data['personalInfo']
        ? PersonalInfoDTO.fromJS(_data['personalInfo'])
        : <any>undefined;
      this.dateCreated = _data['dateCreated']
        ? new Date(_data['dateCreated'].toString())
        : <any>undefined;
      this.orderCancelled = _data['orderCancelled'];
      this.paymentComplete = _data['paymentComplete'];
    }
  }

  static fromJS(data: any): OrderHeaderDTO {
    data = typeof data === 'object' ? data : {};
    let result = new OrderHeaderDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['orderHeaderId'] = this.orderHeaderId;
    data['totalPrice'] = this.totalPrice;
    data['userId'] = this.userId;
    data['personalInfo'] = this.personalInfo
      ? this.personalInfo.toJSON()
      : <any>undefined;
    data['dateCreated'] = this.dateCreated
      ? this.dateCreated.toISOString()
      : <any>undefined;
    data['orderCancelled'] = this.orderCancelled;
    data['paymentComplete'] = this.paymentComplete;
    return data;
  }
}

export interface IOrderHeaderDTO {
  orderHeaderId?: string | undefined;
  totalPrice?: number;
  userId?: string | undefined;
  personalInfo?: PersonalInfoDTO;
  dateCreated?: Date;
  orderCancelled?: boolean;
  paymentComplete?: boolean;
}

export class OrderProductDTO implements IOrderProductDTO {
  productId?: number;
  productName?: string | undefined;
  image?: string | undefined;

  constructor(data?: IOrderProductDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.productId = _data['productId'];
      this.productName = _data['productName'];
      this.image = _data['image'];
    }
  }

  static fromJS(data: any): OrderProductDTO {
    data = typeof data === 'object' ? data : {};
    let result = new OrderProductDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['productId'] = this.productId;
    data['productName'] = this.productName;
    data['image'] = this.image;
    return data;
  }
}

export interface IOrderProductDTO {
  productId?: number;
  productName?: string | undefined;
  image?: string | undefined;
}

export class PaginatedOrderListDTO implements IPaginatedOrderListDTO {
  items?: OrderDTO[] | undefined;
  totalCount?: number;
  pageIndex?: number;
  totalPages?: number;
  pageSize?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;

  constructor(data?: IPaginatedOrderListDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      if (Array.isArray(_data['items'])) {
        this.items = [] as any;
        for (let item of _data['items'])
          this.items!.push(OrderDTO.fromJS(item));
      }
      this.totalCount = _data['totalCount'];
      this.pageIndex = _data['pageIndex'];
      this.totalPages = _data['totalPages'];
      this.pageSize = _data['pageSize'];
      this.hasPreviousPage = _data['hasPreviousPage'];
      this.hasNextPage = _data['hasNextPage'];
    }
  }

  static fromJS(data: any): PaginatedOrderListDTO {
    data = typeof data === 'object' ? data : {};
    let result = new PaginatedOrderListDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    if (Array.isArray(this.items)) {
      data['items'] = [];
      for (let item of this.items) data['items'].push(item.toJSON());
    }
    data['totalCount'] = this.totalCount;
    data['pageIndex'] = this.pageIndex;
    data['totalPages'] = this.totalPages;
    data['pageSize'] = this.pageSize;
    data['hasPreviousPage'] = this.hasPreviousPage;
    data['hasNextPage'] = this.hasNextPage;
    return data;
  }
}

export interface IPaginatedOrderListDTO {
  items?: OrderDTO[] | undefined;
  totalCount?: number;
  pageIndex?: number;
  totalPages?: number;
  pageSize?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export class PersonalInfoDTO implements IPersonalInfoDTO {
  userId?: string | undefined;
  name?: string | undefined;
  country?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  address?: string | undefined;

  constructor(data?: IPersonalInfoDTO) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.userId = _data['userId'];
      this.name = _data['name'];
      this.country = _data['country'];
      this.city = _data['city'];
      this.state = _data['state'];
      this.address = _data['address'];
    }
  }

  static fromJS(data: any): PersonalInfoDTO {
    data = typeof data === 'object' ? data : {};
    let result = new PersonalInfoDTO();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['userId'] = this.userId;
    data['name'] = this.name;
    data['country'] = this.country;
    data['city'] = this.city;
    data['state'] = this.state;
    data['address'] = this.address;
    return data;
  }
}

export interface IPersonalInfoDTO {
  userId?: string | undefined;
  name?: string | undefined;
  country?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  address?: string | undefined;
}
