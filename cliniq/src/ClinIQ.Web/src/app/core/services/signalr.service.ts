import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

export interface QueueUpdate {
  queueId: string;
  patientId: string;
  patientName: string;
  tokenNumber: number;
  status: string;
  doctorId: string;
  roomNumber: string;
}

export interface NotificationMessage {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: Date;
  isRead: boolean;
}

export interface BedStatusUpdate {
  bedId: string;
  bedNumber: string;
  wardName: string;
  status: string;
  patientName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;
  private notificationHubConnection: signalR.HubConnection | null = null;

  private connectionStateSubject = new BehaviorSubject<boolean>(false);
  connectionState$ = this.connectionStateSubject.asObservable();

  // Queue events
  private queueUpdateSubject = new Subject<QueueUpdate>();
  queueUpdate$ = this.queueUpdateSubject.asObservable();

  private tokenCalledSubject = new Subject<QueueUpdate>();
  tokenCalled$ = this.tokenCalledSubject.asObservable();

  // Notification events
  private notificationSubject = new Subject<NotificationMessage>();
  notification$ = this.notificationSubject.asObservable();

  // Bed status events
  private bedStatusSubject = new Subject<BedStatusUpdate>();
  bedStatus$ = this.bedStatusSubject.asObservable();

  startConnection(accessToken: string): void {
    this.startQueueHub(accessToken);
    this.startNotificationHub(accessToken);
  }

  private startQueueHub(accessToken: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}/queue`, {
        accessTokenFactory: () => accessToken
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.onreconnecting(() => {
      this.connectionStateSubject.next(false);
    });

    this.hubConnection.onreconnected(() => {
      this.connectionStateSubject.next(true);
    });

    this.hubConnection.onclose(() => {
      this.connectionStateSubject.next(false);
    });

    // Queue event handlers
    this.hubConnection.on('QueueUpdated', (data: QueueUpdate) => {
      this.queueUpdateSubject.next(data);
    });

    this.hubConnection.on('TokenCalled', (data: QueueUpdate) => {
      this.tokenCalledSubject.next(data);
    });

    this.hubConnection.on('BedStatusChanged', (data: BedStatusUpdate) => {
      this.bedStatusSubject.next(data);
    });

    this.hubConnection.start()
      .then(() => {
        this.connectionStateSubject.next(true);
        console.log('Queue Hub Connected');
      })
      .catch(err => {
        console.error('Queue Hub Connection Error:', err);
        this.connectionStateSubject.next(false);
      });
  }

  private startNotificationHub(accessToken: string): void {
    this.notificationHubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}/notifications`, {
        accessTokenFactory: () => accessToken
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.notificationHubConnection.on('ReceiveNotification', (data: NotificationMessage) => {
      this.notificationSubject.next(data);
    });

    this.notificationHubConnection.start()
      .then(() => console.log('Notification Hub Connected'))
      .catch(err => console.error('Notification Hub Connection Error:', err));
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = null;
    }

    if (this.notificationHubConnection) {
      this.notificationHubConnection.stop();
      this.notificationHubConnection = null;
    }

    this.connectionStateSubject.next(false);
  }

  // Queue methods
  joinDoctorQueue(doctorId: string): Promise<void> {
    return this.hubConnection?.invoke('JoinDoctorQueue', doctorId) ?? Promise.reject('Not connected');
  }

  leaveDoctorQueue(doctorId: string): Promise<void> {
    return this.hubConnection?.invoke('LeaveDoctorQueue', doctorId) ?? Promise.reject('Not connected');
  }

  callNextToken(doctorId: string): Promise<void> {
    return this.hubConnection?.invoke('CallNextToken', doctorId) ?? Promise.reject('Not connected');
  }

  recallToken(queueId: string): Promise<void> {
    return this.hubConnection?.invoke('RecallToken', queueId) ?? Promise.reject('Not connected');
  }

  // Ward/Bed methods
  joinWardGroup(wardId: string): Promise<void> {
    return this.hubConnection?.invoke('JoinWardGroup', wardId) ?? Promise.reject('Not connected');
  }

  leaveWardGroup(wardId: string): Promise<void> {
    return this.hubConnection?.invoke('LeaveWardGroup', wardId) ?? Promise.reject('Not connected');
  }
}
