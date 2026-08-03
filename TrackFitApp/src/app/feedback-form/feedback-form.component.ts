
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
})
export class FeedbackFormComponent implements OnInit {

  feedbackText: string = '';
  rating: number | null = null;
  hoverRating = 0;
  stars = [1, 2, 3, 4, 5];
  showSuccessCard: boolean = false;
  isEditMode = false;
  feedbackId: number | null = null;

  statusMessage = '';
  statusType: 'success' | 'error' | ''|'update' = '';
  isLoading = false;

  constructor(private _commonService: CommonService) { }

  ngOnInit(): void { }

  setRating(value: number): void {
    this.rating = value;
  }

  onPrimaryAction(form: NgForm): void {
    if (form.invalid || !this.rating) {
      form.control.markAllAsTouched();
      this.statusType = 'error';
      this.statusMessage = 'Please enter feedback and select rating.';
      return;
    }

    this.isEditMode ? this.updateFeedback() : this.submitFeedback();
  }

  editAgain() {
    this.showSuccessCard = false;
  }
  submitFeedback(): void {
    this.isLoading = true;

    const data = {
      UserId: localStorage.getItem('userId'),
      Message: this.feedbackText,
      Rating: this.rating,
      CreatedDate: new Date()
    };

    this._commonService.submitFeedbackData(data).subscribe({
      next: (res: any) => {
        this.feedbackId = res?.id ?? res;
        this.isEditMode = true;

        this.statusType = 'success';
        this.statusMessage = 'Feedback submitted successfully';
        this.showSuccessCard = true;
        this.isLoading = false;
      },
      error: () => {
        this.statusType = 'error';
        this.statusMessage = 'Submission failed';
        this.isLoading = false;
      }
    });
  }

  updateFeedback(): void {
    if (!this.feedbackId) return;

    this.isLoading = true;

    const data = {
      feedbackId: this.feedbackId,
      Message: this.feedbackText,
      Rating: this.rating,
      CreatedDate: new Date()
    };

    this._commonService.UpdateFeedbackData(data).subscribe({
      next: () => {
        this.statusType = 'update';
        this.statusMessage = 'Feedback updated successfully';
        this.isLoading = false;
        this.showSuccessCard = true;
      },
      error: () => {
        this.statusType = 'error';
        this.statusMessage = 'Update failed';
        this.isLoading = false;
      }
    });
  }

  resetForm(form: NgForm): void {
    form.resetForm();
    this.feedbackText = '';
    this.rating = null;
    this.hoverRating = 0;
    this.isEditMode = false;
    this.feedbackId = null;
    this.statusMessage = '';
    this.statusType = '';
  }
}
