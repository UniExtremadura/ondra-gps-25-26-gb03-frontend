// src/app/features/user-profile/components/social-networks-section/social-networks-section.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RedSocialService } from '../../services/red-social.service';
import {
  RedSocial,
  RedSocialCrear,
  RedSocialEditar,
  TIPOS_REDES_SOCIALES,
  TipoRedSocialInfo
} from '../../models/red-social.model';

@Component({
  selector: 'app-social-networks-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './social-networks-section.component.html',
  styleUrls: ['./social-networks-section.component.scss']
})
export class SocialNetworksSectionComponent implements OnInit {
  @Input() artistaId!: number;

  redesSociales: RedSocial[] = [];
  isLoading = false;
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  errorMessage = '';

  // Para crear
  nuevaRed: RedSocialCrear = {
    tipoRedSocial: 'INSTAGRAM',
    urlRedSocial: ''
  };

  // Para editar
  redEnEdicion: RedSocial | null = null;
  datosEdicion: RedSocialEditar = {};

  // Para eliminar
  redAEliminar: RedSocial | null = null;

  // Tipos disponibles
  tiposDisponibles = TIPOS_REDES_SOCIALES;

  constructor(private redSocialService: RedSocialService) {}

  ngOnInit(): void {
    this.cargarRedesSociales();
  }

  cargarRedesSociales(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.redSocialService.listarRedesSociales(this.artistaId).subscribe({
      next: (redes) => {
        this.redesSociales = redes;
        this.isLoading = false;
        console.log('✅ Redes sociales cargadas:', redes);
      },
      error: (error) => {
        console.error('❌ Error al cargar redes sociales:', error);
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  openAddModal(): void {
    this.nuevaRed = {
      tipoRedSocial: 'INSTAGRAM',
      urlRedSocial: ''
    };
    this.errorMessage = '';
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.errorMessage = '';
  }

  crearRedSocial(): void {
    this.errorMessage = '';

    this.redSocialService.crearRedSocial(this.artistaId, this.nuevaRed).subscribe({
      next: (redCreada) => {
        console.log('✅ Red social creada:', redCreada);
        this.redesSociales.push(redCreada);
        this.closeAddModal();
      },
      error: (error) => {
        console.error('❌ Error al crear red social:', error);
        this.errorMessage = error.message;
      }
    });
  }

  openEditModal(red: RedSocial): void {
    this.redEnEdicion = { ...red };
    this.datosEdicion = {
      tipoRedSocial: red.tipoRedSocial,
      urlRedSocial: red.urlRedSocial
    };
    this.errorMessage = '';
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.redEnEdicion = null;
    this.datosEdicion = {};
    this.errorMessage = '';
  }

  editarRedSocial(): void {
    if (!this.redEnEdicion) return;

    this.errorMessage = '';

    this.redSocialService.editarRedSocial(
      this.artistaId,
      this.redEnEdicion.idRedSocial,
      this.datosEdicion
    ).subscribe({
      next: (redActualizada) => {
        console.log('✅ Red social actualizada:', redActualizada);
        const index = this.redesSociales.findIndex(
          r => r.idRedSocial === redActualizada.idRedSocial
        );
        if (index !== -1) {
          this.redesSociales[index] = redActualizada;
        }
        this.closeEditModal();
      },
      error: (error) => {
        console.error('❌ Error al actualizar red social:', error);
        this.errorMessage = error.message;
      }
    });
  }

  openDeleteModal(red: RedSocial): void {
    this.redAEliminar = red;
    this.errorMessage = '';
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.redAEliminar = null;
    this.errorMessage = '';
  }

  confirmarEliminacion(): void {
    if (!this.redAEliminar) return;

    this.errorMessage = '';

    this.redSocialService.eliminarRedSocial(
      this.artistaId,
      this.redAEliminar.idRedSocial
    ).subscribe({
      next: () => {
        console.log('✅ Red social eliminada');
        this.redesSociales = this.redesSociales.filter(
          r => r.idRedSocial !== this.redAEliminar!.idRedSocial
        );
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('❌ Error al eliminar red social:', error);
        this.errorMessage = error.message;
      }
    });
  }

  getTipoInfo(tipo: string): TipoRedSocialInfo {
    const info = this.tiposDisponibles.find(
      t => t.value === tipo.toUpperCase()
    );
    return info || {
      value: tipo,
      label: tipo,
      icon: 'globe',
      color: 'gray'
    };
  }

  getIconClass(tipo: string): string {
    const info = this.getTipoInfo(tipo);
    const colorMap: Record<string, string> = {
      pink: 'text-pink-600',
      black: 'text-gray-900',
      blue: 'text-blue-600',
      red: 'text-red-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      gray: 'text-gray-600'
    };
    return colorMap[info.color] || 'text-gray-600';
  }
}
