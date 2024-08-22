export type ResponseData<T = {}> = {
    success: boolean;
    error?: string;
} & Partial<T>;

export type Vendor = {
    id: string;
    name: string;
    description: string | null;
    numOfUsers: number;
};
