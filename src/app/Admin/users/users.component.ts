import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { Region } from '../../models/region';
import { User, UserRole } from '../../models/user';
import { AdminService, CreateUserPayload } from '../../services/admin.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  roles: UserRole[] = ['DRIVER', 'CLIENT', 'MECHANIC', 'ADMIN'];
  regions = Object.values(Region);
  editingUserId: number | null = null;
  selectedRole: UserRole | null = null;

  user: Partial<User> = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'CLIENT',
    region: Region.TUNIS,
    longitude: null,
    latitude: null
  };

  successMessage = '';
  errorMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe((data) => (this.users = data));
  }

  startEdit(user: User): void {
    this.editingUserId = user.id ?? null;
    this.selectedRole = user.role;
  }

  saveRole(user: User): void {
    if (!this.selectedRole || !user.id || this.selectedRole === user.role) {
      this.cancelEdit();
      return;
    }

    this.adminService.updateUserRole(user.id, this.selectedRole).subscribe((updated) => {
      user.role = updated.role;
      this.cancelEdit();
    });
  }

  cancelEdit(): void {
    this.editingUserId = null;
    this.selectedRole = null;
  }

  deleteUser(user: User): void {
    if (!user.id) {
      return;
    }
    if (confirm(`Supprimer ${user.firstName} ${user.lastName} ?`)) {
      this.adminService.deleteUser(user.id).subscribe(() => {
        this.users = this.users.filter((u) => u.id !== user.id);
      });
    }
  }

  getInitials(user: User): string {
    if (!user.firstName || !user.lastName) {
      return '??';
    }
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  generatePassword(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  addUser(): void {
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.role) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    const generatedPassword = this.generatePassword();
    const payload: CreateUserPayload = {
      firstName: this.user.firstName ?? '',
      lastName: this.user.lastName ?? '',
      email: this.user.email ?? '',
      role: this.user.role ?? 'CLIENT',
      password: generatedPassword,
      region: this.user.region ?? null,
      longitude: this.user.longitude ?? null,
      latitude: this.user.latitude ?? null
    };

    const templateParams = {
      to_name: this.user.firstName,
      to_email: this.user.email,
      message: `Bonjour ${this.user.firstName},

Votre compte Livry a été créé avec succès.
Identifiant : ${this.user.email}
Mot de passe : ${generatedPassword}

Cordialement,
L'équipe Livry`
    };

    emailjs
      .send('service_julqdyl', 'template_ekqjq0u', templateParams, 'RXHSzTygkeqR67wc4')
      .then(() => {
        this.adminService.createUser(payload).subscribe({
          next: () => {
            this.successMessage = 'Utilisateur créé et email envoyé ✅';
            this.errorMessage = '';
            this.loadUsers();
            this.user = { firstName: '', lastName: '', email: '', role: 'CLIENT', region: Region.TUNIS, longitude: null, latitude: null };
          },
          error: () => {
            this.errorMessage = 'Erreur lors de la création du compte.';
          }
        });
      })
      .catch(() => {
        this.errorMessage = 'Erreur lors de l’envoi de l’email.';
      });
  }
}
