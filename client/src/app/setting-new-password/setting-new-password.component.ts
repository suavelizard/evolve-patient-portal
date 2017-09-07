import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service'
import { User } from '../User';

@Component({
  selector: 'evolve-setting-new-password',
  templateUrl: './setting-new-password.component.html',
  styleUrls: ['./setting-new-password.component.css']
})
export class SettingNewPasswordComponent implements OnInit {
  invalidPassword: boolean;
  nonMatchingPasswords: boolean;
  newPassword: string;
  dataService: DataService;
  confirmNewPassword: string;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  changedPassword: boolean;
  evolveLogoPath: string;
  user: User;

  constructor(dataService: DataService) { 
    this.evolveLogoPath = 'assets/EvolveLogo.svg';
    this.invalidPassword = false;
    this.nonMatchingPasswords = false;
    this.changedPassword = false;
    this.dataService = dataService;
    this.user = new User();
    this.user.username = 'jsmith';//hard coded for testing - change to real user when request reset component is complete
  }

  ngOnInit() {
  }

  changePasswordNext() : void {
    
    this.hasUpperCase = !(this.newPassword==this.newPassword.toLowerCase());
    this.hasLowerCase = !(this.newPassword==this.newPassword.toUpperCase());

    if(this.newPassword == this.confirmNewPassword) {
      if(this.newPassword.length >= 8 && this.hasUpperCase && this.hasLowerCase) {

        this.nonMatchingPasswords = false;
        this.invalidPassword = false;
        //Code to call the update method
        alert("New password entered: " + this.newPassword);
        this.user.password = this.newPassword;

        this.dataService.resetPassword(this.user);

        this.changedPassword = true;
      } else {
        this.nonMatchingPasswords = false;
        this.invalidPassword = true;
      }
    }
    else {
      this.nonMatchingPasswords = true;
    }
  }

  cancelChangePassword() : void {
    this.nonMatchingPasswords = false;
    this.invalidPassword = false;
    this.changedPassword = false;
    this.rerouteToLogin();
    //TODO: Reroute to the log in component 
  }

  rerouteToLogin() : void {
    alert("Rerouting to the login component");
  }
}
