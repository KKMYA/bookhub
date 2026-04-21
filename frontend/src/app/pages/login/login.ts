import { Component } from '@angular/core';
import { Button } from "../../ui/components/button/button";
import { Input } from "../../ui/components/input/input";
import { PasswordInput } from "../../ui/components/input-password/input-password";

@Component({
  selector: 'app-login',
  imports: [Button, Input, PasswordInput],
  templateUrl: './login.html'
})
export class Login {}
