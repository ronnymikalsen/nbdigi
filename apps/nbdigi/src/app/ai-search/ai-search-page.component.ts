import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchBoxModule } from '../shared/search-box/search-box.module';

@Component({
  selector: 'nbd-ai-search-page',
  standalone: true,
  imports: [SearchBoxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ai-search-page.component.html',
  styleUrl: './ai-search-page.component.scss',
})
export class AiSearchPageComponent {}
