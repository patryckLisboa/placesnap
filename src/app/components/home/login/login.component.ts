import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { HomeService } from '../service/home.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  faSignInAlt = faSignInAlt;

  larguraTela = window.innerWidth;

  @HostListener('window:resize', [])
  onResize() {
    this.larguraTela = window.innerWidth;
  }

  getZoom() {
    if (this.larguraTela < 550) {
      return this.larguraTela / 550;
    }
    return 1;
  }

  loginFormGroup: any = new FormGroup({
    emailFormControl: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    passwordFormControl: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  teste() {
    debugger;
  }
  passwordConfirmFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  get successPasswordConfirm() {
    return (
      this.passwordConfirmFormControl.value ===
      this.loginFormGroup.get('passwordFormControl').value
    );
  }

  constructor(public homeService: HomeService) {}

  ngOnDestroy() {
    this.loginFormGroup.reset();
    this.passwordConfirmFormControl.reset();
  }

  addActiveClass(elementId: string) {
    this.loginFormGroup.reset();
    this.passwordConfirmFormControl.reset();
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('active');
    }
  }

  removeActiveClass(elementId: string) {
    this.loginFormGroup.reset();
    this.passwordConfirmFormControl.reset();
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove('active');
    }
  }

  async emailSignup() {
    await this.homeService.emailSignup(
      this.loginFormGroup.get('emailFormControl').value,
      this.loginFormGroup.get('passwordFormControl').value
    );
    this.loginFormGroup.reset();
    this.passwordConfirmFormControl.reset();
  }

  async emailSignin() {
    await this.homeService.emailSignin(
      this.loginFormGroup.get('emailFormControl').value,
      this.loginFormGroup.get('passwordFormControl').value
    );
    this.loginFormGroup.reset();
    this.passwordConfirmFormControl.reset();
  }

  async googleSignin() {
    await this.homeService.googleSignin();
    this.loginFormGroup.reset();
    this.passwordConfirmFormControl.reset();
  }

  async facebookSignin() {
    await this.homeService.facebookSignin();
    this.loginFormGroup.reset();
    this.passwordConfirmFormControl.reset();
  }
}
