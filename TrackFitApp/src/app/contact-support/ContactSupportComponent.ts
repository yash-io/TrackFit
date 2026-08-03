import { Component, Input } from '@angular/core';
import { ContactSupportService } from '../contact-support.service';
import { resetForm } from './contact-support.component';


@Component({
    selector: 'app-contact-support',
    templateUrl: './contact-support.component.html',
    styleUrls: ['./contact-support.component.css']
})
export class ContactSupportComponent {

    @Input() userId!: number;

    name: string = "";
    email: string = "";
    message: string = '';
    responseMessage: string = '';

    constructor(private supportService: ContactSupportService) { }

    submitForm() {

        if (!this.message) {
            this.responseMessage = 'Please enter your message';
            return;
        }

        const payload = {
            userId: this.userId,
            message: this.message
        };

        this.supportService.sendMessage(payload).subscribe({
            next: () => {
                this.responseMessage = 'Message sent successfully!';
                this.message = '';
            },
            error: () => {
                this.responseMessage = 'Failed to send message.';
            }
        });

        resetForm(); {
            this.name = '';
            this.email = '';
            this.message = '';
        }
    }
}
