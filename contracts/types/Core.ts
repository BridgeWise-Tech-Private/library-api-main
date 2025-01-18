export type CountType = {
    count: number;
};

export type SuccessType = {
    success: boolean;
};

export type StatusType = {
    status: boolean;
};

export type DeviceInfoType = {
    ipAddress: string;
    browser?: string;
    os?: string;
    deviceId?: string;
    deviceBrand?: string;
};

export type SuccessResponseBaseType = {
    success: boolean;
};

export type ServiceResponseType = {
    status: number;
    data: object | object[] | string
};
