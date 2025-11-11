import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsGlobales } from '../../../../shared/models/stats.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnChanges {
  @Input() stats: StatsGlobales | null = null;

  displayStats: { label: string; value: number; current: number }[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stats'] && this.stats) {
      this.initializeStats();
      this.animateNumbers();
    }
  }

  private initializeStats(): void {
    if (!this.stats) return;

    this.displayStats = [
      { label: 'Usuarios activos', value: this.stats.totalUsuarios, current: 0 },
      { label: 'Artistas', value: this.stats.totalArtistas, current: 0 },
      { label: 'Canciones', value: this.stats.totalCanciones, current: 0 },
      { label: 'Reproducciones', value: this.stats.totalReproducciones, current: 0 }
    ];
  }

  private animateNumbers(): void {
    this.displayStats.forEach((stat) => {
      let start = 0;
      const increment = stat.value / 80;
      const interval = setInterval(() => {
        start += increment;
        stat.current = Math.floor(start);
        if (start >= stat.value) {
          stat.current = stat.value;
          clearInterval(interval);
        }
        this.cdr.detectChanges();
      }, 25);
    });
  }
}
