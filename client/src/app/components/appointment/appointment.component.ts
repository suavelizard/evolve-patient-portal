import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { NavigatorGeolocation } from '@ngui/map';
import { Subscription } from 'rxjs/Rx';
import { AppointmentFurtherInfo } from '../../class/AppointmentFurtherInfo';
import { Component, Input, OnChanges, OnDestroy, OnInit, TemplateRef, SimpleChange } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Appointment } from '../../class/Appointment';
import { DataService } from '../../services/data.service';
import { SwitchBoardService } from '../../services/switch-board.service';
import { User } from '../../class/User';
import { Clinician } from '../../class/Clinician';

@Component({
    selector: 'evolve-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit, OnDestroy, OnChanges {

    private appointments: Appointment[];
    private focusedAppointment: AppointmentFurtherInfo;
    private userLocation;
    private subCenter: Subscription;
    private navigatorGeolocation = new NavigatorGeolocation();
    private modalRef: BsModalRef;
    private user: User = new User();
    private userSubscription: Subscription;
    private mapPath: string;
    private clinicians: Clinician[];
    private secondVisible = false;
    private querySubject: string;
    private queryText: string;
    private selectedClinicianID: number;
    private showMap: boolean;
    private showLocalMap: boolean;
    private selectedAppointment: Appointment;
    private invalidInput: boolean;
    private querySuccess: boolean;

    onHidden() { 
        this.secondVisible = false;
        this.showMap = false;
        this.showLocalMap = false;
    }

    // input for viewing as dependant
    @Input() dependantID;

    constructor(private modalService: BsModalService, private data: DataService, private switchboard: SwitchBoardService) {
        this.invalidInput = false;
        this.querySuccess = false;
        this.userSubscription = this.switchboard.user$.subscribe(user => {
            this.user = user;
        });

        this.subCenter = this.navigatorGeolocation.getCurrentPosition({ 'timeout': 10000 }).subscribe((location) => {
            this.userLocation = location;
        });

        this.modalService.onHidden.asObservable().subscribe(() => this.onHidden());
    }

    public openModal(template: TemplateRef<any>, appointment: Appointment) {
        this.selectedClinicianID = -1;
        this.queryText = null;
        this.querySubject = null;
        this.querySuccess = false;
        this.invalidInput = false;
        this.invalidInput = false;
        this.querySuccess = false;
        this.selectedAppointment = appointment;
        this.data.getAppointmentInformation(appointment.appointmentID).subscribe(
            res => {
                this.focusedAppointment = res[0];
                this.mapPath = '../assets/hospitals/' + this.focusedAppointment.locationID + '/' + this.focusedAppointment.departmentID;
                this.modalRef = this.modalService.show(template);
                this.focusedAppointment.showLocalMap = false;
                this.focusedAppointment.showGoogleMap = false;
            }
        );
        const id = this.dependantID || this.user.userID;
        this.data.getUserClinicians(id).subscribe(
            res => this.clinicians = res,
            err => console.log(err)
        );
    }

    submitQuery() {
        if(this.querySubject && this.queryText && this.selectedClinicianID > 0) {
            this.invalidInput = false;
            this.data.addAppointmentQuery(this.selectedAppointment.appointmentID, this.selectedClinicianID, this.querySubject, this.queryText);
            this.querySuccess = true;
        } else {
            this.invalidInput = true;
        }
    }

    ngOnInit() {
        this.data.getUserFromCookie(this.user);   
        this.getAppointmentsForUser();
    }

    getAppointmentsForUser() {
        if (this.user) {
            // uses dependantID if available, else defaults to logged in use ID
            const id = this.dependantID || this.user.userID;

            // get the data from the component
            this.data.getAllAppointmentsByUserID(id).subscribe(
                res => this.appointments = res
            );
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(this.user);

        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.

        // download the new data to update the widgets
        this.getAppointmentsForUser();
    }

    ngOnDestroy() {
        if (this.userSubscription)
            this.userSubscription.unsubscribe();
        if (this.subCenter)
            this.subCenter.unsubscribe();
    }

    private toggle(name): void {
        this.focusedAppointment[name] = !this.focusedAppointment[name];
    }
}