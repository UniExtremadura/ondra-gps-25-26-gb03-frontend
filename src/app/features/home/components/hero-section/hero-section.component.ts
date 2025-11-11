import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  animations: [
    /**
     * Animación de entrada con efecto de desvanecimiento y escala.
     */
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class HeroSectionComponent implements OnInit, OnDestroy {

  // === Lista de banners ===
  banners = [
    { src: 'assets/images/banner1.jpg', alt: 'Banner 1' },
    { src: 'assets/images/banner2.jpg', alt: 'Banner 2' },
    { src: 'assets/images/banner3.jpg', alt: 'Banner 3' },
    { src: 'assets/images/banner4.jpg', alt: 'Banner 4' }
  ];

  // Orden actual de apilamiento
  currentOrder = [0, 1, 2, 3];
  private intervalId: any;

  ngOnInit(): void {
    // Rota los banners cada 4 segundos
    this.intervalId = setInterval(() => {
      this.currentOrder.push(this.currentOrder.shift()!);
    }, 4000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  /**
   * Devuelve los estilos de posición, escala y opacidad
   * para lograr efecto de apilado + desvanecimiento suave.
   */
  getBannerStyle(index: number): any {
    const order = this.currentOrder.indexOf(index);

    // Número total de banners visibles
    const total = this.banners.length;

    // Si por algún motivo no encuentra el índice, lo mandamos al fondo
    if (order === -1) return { opacity: 0, position: 'absolute' };

    // 🔧 Ajustes proporcionales
    const offsetStep = 20;   // separación vertical/horizontal entre banners
    const scaleStep = 0.03;  // diferencia de tamaño entre capas
    const opacityStep = 0.2; // diferencia de opacidad entre capas

    // Cálculo dinámico según el orden
    const depth = total - 1 - order;

    return {
      top: `${-depth * offsetStep}px`,
      right: `${-depth * offsetStep}px`,
      transform: `scale(${1 - depth * scaleStep})`,
      zIndex: 10 + (total - depth) * 10,
      opacity: 1 - depth * opacityStep,
      width: '100%',
      height: '100%',
      position: 'absolute',
      transition:
        'top 0.4s ease, right 0.4s ease, transform 0.4s ease, opacity 0.4s ease',
      transformOrigin: 'center center'
    };
  }

}
