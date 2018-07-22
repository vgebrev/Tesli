import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { MatSnackBar } from '@angular/material';
import { Notification } from '../../model/notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Tesli';
  constructor(private notificationService: NotificationService, public snackBar: MatSnackBar) {
    this.notificationService.notification$.subscribe((notification: Notification) => {
      const snackBarRef = this.snackBar.open(notification.message, notification.action, notification.config);
      snackBarRef.onAction().subscribe(() => {
        if (notification.callback) {
          notification.callback();
        }
      });
    });
  }
}
