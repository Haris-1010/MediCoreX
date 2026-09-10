import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
export class SignalRService {
    constructor() {
        this.hubConnection = null;
        this.notificationHubConnection = null;
        this.connectionStateSubject = new BehaviorSubject(false);
        this.connectionState$ = this.connectionStateSubject.asObservable();
        // Queue events
        this.queueUpdateSubject = new Subject();
        this.queueUpdate$ = this.queueUpdateSubject.asObservable();
        this.tokenCalledSubject = new Subject();
        this.tokenCalled$ = this.tokenCalledSubject.asObservable();
        // Notification events
        this.notificationSubject = new Subject();
        this.notification$ = this.notificationSubject.asObservable();
        // Bed status events
        this.bedStatusSubject = new Subject();
        this.bedStatus$ = this.bedStatusSubject.asObservable();
    }
    startConnection(accessToken) {
        this.startQueueHub(accessToken);
        this.startNotificationHub(accessToken);
    }
    startQueueHub(accessToken) {
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
        this.hubConnection.on('QueueUpdated', (data) => {
            this.queueUpdateSubject.next(data);
        });
        this.hubConnection.on('TokenCalled', (data) => {
            this.tokenCalledSubject.next(data);
        });
        this.hubConnection.on('BedStatusChanged', (data) => {
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
    startNotificationHub(accessToken) {
        this.notificationHubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.hubUrl}/notifications`, {
            accessTokenFactory: () => accessToken
        })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Information)
            .build();
        this.notificationHubConnection.on('ReceiveNotification', (data) => {
            this.notificationSubject.next(data);
        });
        this.notificationHubConnection.start()
            .then(() => console.log('Notification Hub Connected'))
            .catch(err => console.error('Notification Hub Connection Error:', err));
    }
    stopConnection() {
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
    joinDoctorQueue(doctorId) {
        return this.hubConnection?.invoke('JoinDoctorQueue', doctorId) ?? Promise.reject('Not connected');
    }
    leaveDoctorQueue(doctorId) {
        return this.hubConnection?.invoke('LeaveDoctorQueue', doctorId) ?? Promise.reject('Not connected');
    }
    callNextToken(doctorId) {
        return this.hubConnection?.invoke('CallNextToken', doctorId) ?? Promise.reject('Not connected');
    }
    recallToken(queueId) {
        return this.hubConnection?.invoke('RecallToken', queueId) ?? Promise.reject('Not connected');
    }
    // Ward/Bed methods
    joinWardGroup(wardId) {
        return this.hubConnection?.invoke('JoinWardGroup', wardId) ?? Promise.reject('Not connected');
    }
    leaveWardGroup(wardId) {
        return this.hubConnection?.invoke('LeaveWardGroup', wardId) ?? Promise.reject('Not connected');
    }
    static { this.ɵfac = function SignalRService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SignalRService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: SignalRService, factory: SignalRService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SignalRService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();
//# sourceMappingURL=signalr.service.js.map