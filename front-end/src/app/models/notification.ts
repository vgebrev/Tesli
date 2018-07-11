import { MatSnackBarConfig } from "@angular/material";
export { MatSnackBarConfig };

export class Notification {
    message: string;
    action?: string;
    config?: MatSnackBarConfig;
    callback?: () => any;
}