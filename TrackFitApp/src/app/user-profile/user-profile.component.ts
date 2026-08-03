import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { IUserProfile } from '../interfaces/userProfile';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  userId: number = 0;
  ret: number = 0;
  errorMessage: string = '';
  isUpdatedMode: boolean = false;

  previewImage: string | ArrayBuffer | null = null;
  @ViewChild('avatarScroll') avatarScroll!: ElementRef;
  avatars: string[] = ['assets/images/1.png', 'assets/images/2.png', 'assets/images/3.png', 'assets/images/4.png', 'assets/images/5.png']
  selectedAvatar: string = '';
  isImageRemoved: boolean = false;
  profile: any = {
    age: '',
    height: '',
    weight: '',
    goal: '',
    profileImage:''
  }
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    const sessionId = sessionStorage.getItem('userId');
    const localId = localStorage.getItem('userId');
    const id = sessionId || localId ;
    if (id) { 
      this.userId = +id;
    } else {
      this.router.navigate(['/register']);
    }

    this.userService.getUserProfile(this.userId).subscribe((res: any) => {
      if (res) {
        this.profile = res;
        this.selectedAvatar = res.profileImage;

        this.isUpdatedMode = true;
      }
    })
  }

  selectAvatar(avatar: string) {
    this.profile.photo = avatar;
    this.selectedAvatar = avatar;
    localStorage.setItem('profilePhoto', avatar);
  }


  scrollLeft() {
    this.avatarScroll.nativeElement.scrollBy({
      left: -150,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.avatarScroll.nativeElement.scrollBy({
      left: 150,
      behavior: 'smooth'
    });
  }

  skipProfile() {
    if (!this.profile.age || !this.profile.goal) {
      const confirmSkip = confirm("Some fields are empty. Are you sure you want to skip?");
      if (!confirmSkip) return;
    }
    this.router.navigate(['/home']);
  }

  removeProfileImage() {
    this.selectedAvatar = '';
    this.isImageRemoved = true
  }

  saveProfile(form: any) {
    if (!this.isUpdatedMode) { 
    if (!this.profile.goal || !this.profile.age) {
      alert("Age and Goal are mandatory");
      return;
    }
  }

    const profileData: IUserProfile = {
      userId: this.userId,
      age: form.value.age,
      height: form.value.height ?
        Number(form.value.height): null,
      weight: form.value.weight ?
        Number(form.value.weight): null,
      goal: form.value.goal,
      profileImage: this.isImageRemoved ? 'assets/default-avatar.png' : (this.selectedAvatar || this.profile.profileImage)
    };

    console.log(profileData);
    localStorage.setItem('profilePhoto', profileData.profileImage || 'assets/default-avatar.png');

    this.userService.createProfile(profileData).subscribe({
      next: (res) => {
        this.ret = res;
        console.log(this.ret)
        if (res === 1) {

          console.log('Profile saved successfully');
          alert("Profile saved successfully");
        }
        else if (res === 2) {
          alert("Profile updated Successfully");
        }
        else {
          alert("Failed to save profile");
        }
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error saving profile', err);
        this.errorMessage = "Please fill the required fields"
        alert("Something went wrong")
      }
    });
  }
}
