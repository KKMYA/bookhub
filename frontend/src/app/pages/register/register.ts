import { Component } from '@angular/core';
import { Input } from "../../ui/components/input/input";
import { PasswordInput } from "../../ui/components/input-password/input-password";
import { Button } from "../../ui/components/button/button";

@Component({
    selector: 'app-register',
    imports: [Input, PasswordInput, Button],
    templateUrl: './register.html'
})

export class Register {

}
