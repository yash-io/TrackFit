import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {

  faqs = [
    {
      question: 'How do I track my steps?',
      answer: 'You can enter your daily steps in the dashboard under the steps section.',
      isOpen: false
    },
    {
      question: 'How to reset my data?',
      answer: 'Click the reset button on the dashboard to clear all input fields.',
      isOpen: false
    },
    {
      question: 'How do I contact support?',
      answer: 'Go to Help → Contact Support and submit your query.',
      isOpen: false
    },
    {
      question: 'how do i track my steps?',
      answer: 'you can enter your daily steps in the dashboard under the steps section.',
      isOpen: false
    },
    {
      question: 'how do i track my water intake?',
      answer: 'use the water tracking section to log your daily water consumption',
      isOpen: false
    },
    {
      question: 'how are calories calculated?',
      answer: 'calories are calcukated based upon the data you input for your daily activities and meals',
      isOpen: false
    },
    {
      question: 'how do i reset my data?',
      answer: 'click on the reset button on the dashboard to clear all the input fields. This wwill not affect saved data.',
      isOpen: false
    },
    {
      question: 'how do i contact-support?',
      answer: 'Go to Help -> Contact-Support and submit your query.',
      isOpen: false
    },
    {
      question: 'How do i delete my account?',
      answer: 'Go to Help -> Delete Account and follow the instructions.',
      isOpen: false
    },
    {
      question: 'Can i edit my previous entries?',
      answer: 'Yes, you can update your entries anytime before saving them',
      isOpen: false
    }
  ];

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
