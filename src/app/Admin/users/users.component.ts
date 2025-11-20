import { Component, OnInit } from '@angular/core';
import { User, UserRole } from '../../models/user';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule,CommonModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent  implements OnInit{
users: User[] = [];
  roles: UserRole[] = ['DRIVER', 'CLIENT', 'MECHANIC', 'ADMIN'];
  editingUserId: number | null = null;
  selectedRole: UserRole | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe(data => this.users = data);
  }

  startEdit(user: User) {
    this.editingUserId = user.id!;
    this.selectedRole = user.role;
  }

  saveRole(user: User) {
    if (!this.selectedRole || this.selectedRole === user.role) {
      this.cancelEdit();
      return;
    }

    this.adminService.updateUser(user.id!, { role: this.selectedRole }).subscribe(updated => {
      user.role = updated.role;
      this.cancelEdit();
    });
  }

  cancelEdit() {
    this.editingUserId = null;
    this.selectedRole = null;
  }

  deleteUser(user: User) {
    if (confirm(`Supprimer ${user.firstName} ${user.lastName} ?`)) {
      this.adminService.deleteUser(user.id!).subscribe(() => {
        this.users = this.users.filter(u => u.id !== user.id);
      });
    }
  }


//emailsender

  
  user: Partial<User> = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'CLIENT',
  };

  successMessage = '';
  errorMessage = '';


  generatePassword(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  addUser() {
    // 🧠 Generate a random password on the frontend
    const generatedPassword = this.generatePassword();
    const newUser = { ...this.user, password: generatedPassword };

    // 📨 Send email to the user before saving
    const templateParams = {
      to_name: this.user.firstName,
      to_email: this.user.email,
      message: `Bonjour ${this.user.firstName},\n\nVotre compte Livry a été créé avec succès.\n\nIdentifiant : ${this.user.email}\nMot de passe : ${generatedPassword}\n\nCordialement,\nL'équipe Livry`
    };

    emailjs.send(
      'service_julqdyl',    // Replace with your EmailJS service ID
      'template_ekqjq0u',   // Replace with your EmailJS template ID
      templateParams,
      'RXHSzTygkeqR67wc4'     // Replace with your EmailJS public key
    ).then(() => {
      // 💾 Save user after email sent successfully
      this.adminService.createUser(newUser as User).subscribe({
        next: () => {
          this.successMessage = 'Utilisateur créé et email envoyé ✅';
          this.loadUsers();
          this.errorMessage = '';
          this.user = { firstName: '', lastName: '', email: '', role: 'CLIENT' };
        },
        error: () => {
          this.errorMessage = 'Erreur lors de l’enregistrement.';
        }
      });
    }).catch(() => {
      this.errorMessage = 'Erreur lors de l’envoi de l’email.';
    });
  }


}
