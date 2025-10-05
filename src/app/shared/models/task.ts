import { User } from "./user";

export interface Task {
    id: string;
    name: string;
    description: string;
    type: string;
    created: Date | null;
    status: string;
    user?: User;
}
