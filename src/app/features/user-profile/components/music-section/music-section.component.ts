import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesPreviewComponent } from '../purchases-preview/purchases-preview.component';
import { FavoritesPreviewComponent } from '../favorites-preview/favorites-preview.component';

@Component({
  selector: 'app-music-section',
  standalone: true,
  imports: [CommonModule, PurchasesPreviewComponent, FavoritesPreviewComponent],
  templateUrl: './music-section.component.html',
  styleUrls: ['./music-section.component.scss']
})
export class MusicSectionComponent {
  @Input() userId!: number;
}
