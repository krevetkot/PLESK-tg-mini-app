import { Component, OnInit } from '@angular/core';

import {Profile} from '../../models/profile';
import {Order} from '../../models/order';
import {ProfileService} from '../../services/profile.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ProfileComponent implements OnInit {
  profile!: Profile;
  orders: Order[] = [];
  isEditing = false;
  editedProfile: {} = {};

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadOrders();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe(profile => {
      this.profile = profile;
      this.editedProfile = { ...profile };
    });
  }

  loadOrders(): void {
    this.profileService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.editedProfile = { ...this.profile! };
  }

  // cancelEdit(): void {
  //   this.isEditing = false;
  //   this.editedProfile = { ...this.profile! };
  // }

  saveProfile(): void {
    if (this.editedProfile) {
      this.profileService.updateProfile(this.editedProfile).subscribe(profile => {
        this.profile = profile;
        this.isEditing = false;
      });
    }
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileService.updateAvatar(e.target.result).subscribe(profile => {
          this.profile = profile;
        });
      };
      reader.readAsDataURL(file);
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'delivered': return 'Доставлен';
      case 'processing': return 'В обработке';
      case 'shipped': return 'В пути';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered': return 'status-delivered';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      default: return '';
    }
  }
}
