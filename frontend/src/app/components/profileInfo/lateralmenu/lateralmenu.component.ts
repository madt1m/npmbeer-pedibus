import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {AuthService} from 'src/app/services/auth/auth.service';
import {User} from 'src/app/models/user';
import {Role} from "../../../models/authority";
import {FormBuilder, ValidatorFn, FormControl, Validators, FormGroup} from '@angular/forms';
import {ProfileService} from "../../../services/profile/profile.service";

@Component({
    selector: 'app-lateralmenu',
    templateUrl: './lateralmenu.component.html',
    styleUrls: ['./lateralmenu.component.scss']
})
export class LateralmenuComponent implements OnInit, OnDestroy {

    isAuthenticated: boolean;
    user = null;
    userInfo;
    task = "profilo";
    email: Observable<string>
    name;
    surname;
    address;
    telephone;
    form: FormGroup;
    pic: any;
    isAdmin = false;
    private unsubscribe$ = new Subject<void>();

  constructor(private breakpointObserver: BreakpointObserver, public auth: AuthService, private fb: FormBuilder, private profileService: ProfileService) {
    this.form = this.fb.group({
      nameDopo: [],
      surnameDopo: [],
      addressDopo: [],
      telephoneDopo: []
    })
  }

  ngOnInit() {
    this.profileService.user$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((user) => {
      this.user = user;
    });
    this.isAdmin = this.auth.getCurrentUser().hasMinAuthority(Role.ADMIN);
  }

  onSubmit() {
      this.auth.editProfileInformation(this.user['_email'], this.form.controls.nameDopo.value,
          this.form.controls.surnameDopo.value,
          this.form.controls.addressDopo.value,
          this.form.controls.telephoneDopo.value).subscribe(
          (res) => {
              console.log(res);
          }
      )
  }


    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches)
        );

    selectTaskBambini() {
        this.task = "bambini";
    }

    selectTaskProfilo() {
        this.task = "profilo"
    }

    selectTaskCambioPassword() {
        this.task = "cambioPwd";
    }

    selectTaskGestioneUtenti(){
      this.task = "manageUsers";
    }

}

