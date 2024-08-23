export type User = {
    id: string;
    hex_qr_id: string | null;
    email: string;
    username: string;
    completed_profile: boolean;
    full_name: string | null;
    role: "admin" | "vendor" | "member" | "user";
    vendor_id: string | null;
    pfp: string | null;
};

export type Vendor = {
    id: string;
    name: string;
    description: string | null;
    owner: Omit<User, "pfp">;
    numOfUsers: number;
};
