import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {LocalDate, LocalDateTime, LocalTime} from 'js-joda';

import {Child} from '../../models/child'
import {Stop} from "../../models/stop";
import {Builder} from "builder-pattern";
import {StopList} from "../../models/stop-list";
import {ReservationsService} from 'src/app/reservations.service';
import {Line} from "../../models/line";

@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

    selectedLine = null;
    selectedRun = 0;
    lines = [];
    selectedDate = null;
    selectedDirection = "outward";

    reservations = [];
    reservedStops;

    isMobile = false;
    public res = [];

    /**
     * Filter passed to the date picker to filter out non-school days, i.e. sundays (0) and saturdays(6)
     * **/
    allowedDaysFilter = (d: Date): boolean => {
        let dayNum = d.getDay();
        return !(dayNum === 0);
    };

    constructor(private reservationsService: ReservationsService) {
        this.selectedDate = new FormControl(new Date());

        // check if it is a mobile user, if so, use touchUI elements for better targeting
        // see https://stackoverflow.com/a/25394023/6945436 for userAgent checking
        // TODO: check this on mobile, seems to work on desktop
        let userAgent = navigator.userAgent;
        this.isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent);
        this.reservationsService.lines().subscribe(data => {
            this.lines = data.map((line) => {
                let day = this.selectedDate.value.getDate();
                let month = (this.selectedDate.value.getMonth() + 1).toString();
                if (month.length < 2)
                    month = "0" + month;
                let year = this.selectedDate.value.getFullYear();
                let date = day.toString() + month + year.toString();
                let outwards: Array<StopList> = [];
                let backs: Array<StopList> = [];
                // map outwards
                for (let out of line.outward) {
                    let stopList = Builder(StopList)
                        .stops(out.map(function (stop) {
                            let time = LocalTime.parse(stop.time);
                            return Builder(Stop)
                                .name(stop.name)
                                .time(time)
                                .position(stop.position)
                                .build();
                        }))
                        .build();
                    outwards.push(stopList);
                }

                // map inwards
                for (let b of line.back) {
                    let stopList = Builder(StopList)
                        .stops(b.map(function (stop) {
                            let time = LocalTime.parse(stop.time);
                            return Builder(Stop)
                                .name(stop.name)
                                .time(time)
                                .position(stop.position)
                                .build();
                        }))
                        .build();
                    backs.push(stopList);
                }

                // finally build the Line
                return Builder(Line)
                    .id(line.id)
                    .lineName(line.name)
                    .adminEmail(line.admin_email)
                    .outward(outwards)
                    .back(backs)
                    .build();
            });
        }, () => null, () => {
            this.selectedLine = this.lines[0];
            this.updateData()
        });
    }

    ngOnInit() {

    }

    updateData() {
        if (this.selectedLine != null) {
            if (this.selectedLine.outward[0].endsAt.isAfter(LocalTime.now()) || this.selectedDirection === 'outward') {
                this.selectedRun = 0;
            } else if (this.selectedLine.back[0].endsAt.isAfter(LocalTime.now())) {
                this.selectedRun = 1;
            } else if (this.selectedLine.back[1].endsAt.isAfter(LocalTime.now())) {
                this.selectedRun = 2;
            } else if (this.selectedDirection === 'back') {
                this.selectedRun = 1;
            } else {
                this.selectedRun = 0;
                let today = new Date();
                today.setDate(today.getDate() + 1);
                this.selectedDate.setValue(today);
            }

            this.updateReservation();
        }
    }

    updateReservation() {
        let day = this.selectedDate.value.getDate();
        let month = (this.selectedDate.value.getMonth() + 1).toString();
        if (month.length < 2)
            month = "0" + month;
        let year = this.selectedDate.value.getFullYear();
        let date = day.toString() + month + year.toString();
        this.reservationsService.reservations(this.selectedLine.lineName, date)
            .subscribe(data => {
                this.reservations = data;
                console.log(this.reservations);
            }, () => null, () => {
                if(this.selectedLine != null){

                    this.reservedStops = {"outward": [], "back": []};
                    let arr = [];

                    let i =0;
                    for(let stop of this.selectedLine.outward[0].stops){
                        let children = this.childrenByStop(stop.name, 0, "outward");
                        if(children !== undefined){
                            arr.push(children);
                        }else{
                            arr.push([])
                        }
                        i++;
                    }
                    this.reservedStops["outward"].push(arr);

                    i=0;
                    for(let run of this.selectedLine.back){
                        let arr = [];
                        for(let stop of run.stops){
                            let children = this.childrenByStop(stop.name, i, "back");
                            if(children !== undefined){
                                arr.push(children);
                            }else{
                                arr.push([])
                            }
                        }
                        this.reservedStops["back"].push(arr);
                        i++;
                    }
                }
            });
    }

    childrenByStop(stopName, index, direction) {
        let reservations = null;
        if (direction == 'outward') {
            reservations = this.reservations.outward[index];
            if(reservations!=undefined) {
                reservations = reservations.filter(res => {
                    return res.stopName === stopName;
                });
                if(reservations!=undefined){
                    reservations=reservations[0];
                }
            }
        }else{
            reservations = this.reservations.backward[index];
            if(reservations!=undefined) {
                reservations = reservations.filter(res => {
                    return res.stopName === stopName;
                });
                if(reservations!=undefined){
                    reservations=reservations[0];
                }

            }
        }

        if(reservations!=undefined && reservations.childs!=undefined)
            return reservations.childs.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            else return 0;
        });
        else
            return undefined;

    }
}
