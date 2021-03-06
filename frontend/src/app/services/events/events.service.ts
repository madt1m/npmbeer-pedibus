import {Injectable, NgZone, OnInit} from '@angular/core';
import {SseService} from "../sse/sse.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Event} from "../../models/event"
import {HttpClient} from "@angular/common/http";
import {take} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnInit{

  private notificationSource: BehaviorSubject<Event[]> = new BehaviorSubject(null);
  currentNotification: Observable<Event[]> = this.notificationSource.asObservable();

  notifications: Event[] = [];

  constructor(private _zone: NgZone, private _sseService: SseService, private http: HttpClient, private auth: AuthService) {
    this.auth.isLoggedIn$.subscribe((loggedIn) =>{
      if(loggedIn){
        this.getServerSentEvent("http://192.168.99.100:8080/events/stream").subscribe( notification => {
          this._zone.run(() => {
            if(!notification.read){
              this.notifications.push(notification);
              this.notificationSource.next(this.notifications);
            }
          })
        });
      }
    });
  }

  ngOnInit(): void {

  }

  getServerSentEvent(url: string): Observable<Event>{
    return new Observable<Event>((observer) => {
      const eventSource = this._sseService.getEventSource(url);
      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(JSON.parse(event.data));
        });
      };

      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
        });
      };
    });
  }

  setNotificationRead(notId: string): Observable<any> {
    let obs = this.http.post(`http://192.168.99.100:8080/events/read`, notId);
    obs.pipe(take(1)).subscribe(() => {
      this.notifications = this.notifications.filter(notification => notification.id !== notId);
      this.notificationSource.next(this.notifications);
    });
    return obs;
  }

}
