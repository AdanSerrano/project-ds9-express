import { User } from '../model/types'; // Adjust the import path and type as needed

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
