
export interface ChatRoom {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    selected?: boolean;
    visible:boolean;
}