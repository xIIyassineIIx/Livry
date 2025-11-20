import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Problem, ProblemType } from '../../models/probleme';
import { ProblemeService } from '../../services/probleme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-probleme',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './probleme.component.html',
  styleUrl: './probleme.component.css'
})
export class ProblemeComponent {
  
  problemForm: FormGroup;
  problemTypes = Object.values(ProblemType);

  constructor(
    private fb: FormBuilder,
    private problemService: ProblemeService
  ) {
    this.problemForm = this.fb.group({
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      deliveryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  submitProblem() {
    if (this.problemForm.invalid) return;

    const formValue = this.problemForm.value;
    const problem: Problem = {
      type: formValue.type,
      description: formValue.description,
      delivery: { id: +formValue.deliveryId },
      driver: { id: 2 } // 🔧 à remplacer par le vrai ID du chauffeur connecté
    };

    this.problemService.reportProblem(problem).subscribe(() => {
      alert('Problème signalé avec succès 🚗💥');
      this.problemForm.reset();
    });
  }
}
