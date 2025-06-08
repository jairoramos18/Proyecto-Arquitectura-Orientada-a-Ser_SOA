import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { User } from '../interfaces/user.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit {
  usuarios: User[] = [];
  usuarioForm: FormGroup;
  editando: boolean = false;
  idEditando: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  guardarUsuario() {
    if (this.usuarioForm.invalid) return;

    const usuario: User = this.usuarioForm.value;

    if (this.editando && this.idEditando) {
      this.usuarioService
        .actualizarUsuario(this.idEditando, usuario)
        .then(() => {
          this.editando = false;
          this.idEditando = null;
          this.usuarioForm.reset();
        });
    } else {
      this.usuarioService.agregarUsuario(usuario).then(() => {
        this.usuarioForm.reset();
      });
    }
  }

  editarUsuario(usuario: User) {
    this.editando = true;
    this.idEditando = usuario.id || null;
    this.usuarioForm.patchValue(usuario);
  }

  eliminarUsuario(id: string) {
    this.usuarioService.eliminarUsuario(id);
  }

  cancelarEdicion() {
    this.editando = false;
    this.idEditando = null;
    this.usuarioForm.reset();
  }
}
