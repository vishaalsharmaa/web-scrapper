import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  public validURLPattern: RegExp = /^(?:(http(s)?)?(sftp)?(ftp)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  scrapperForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    this.scrapperForm = this.fb.group({
      websiteURL: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.pattern(this.validURLPattern)])],
    })
  }

  scrapURL() {
    let url = this.scrapperForm.get('websiteURL').value;
    const extras: NavigationExtras = {
      queryParams: { url: url },
    };
    this.router.navigate(['/results'], extras);
  }
}
