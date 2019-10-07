import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    HostListener,
    Input, OnInit,
    ViewChild
} from '@angular/core';

@Component({
    selector: 'app-stop-list',
    templateUrl: './stop-list.component.html',
    styleUrls: ['./stop-list.component.scss']
})
export class StopListComponent{

    @Input("stops") stops;
    @Input("times") times;

    direction(i) {
        if (i % 2 == 0)
            return "start";
        return "end";
    }


}
