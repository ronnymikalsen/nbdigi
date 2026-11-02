import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Item } from '../../../../core/models';
import { ItemCardModule } from '../../../items-section/items-section/item-card/item-card.module';

@Component({
  selector: 'nbd-chat-result-grid',
  imports: [ItemCardModule, MatButtonModule],
  templateUrl: './chat-result-grid.html',
  styleUrl: './chat-result-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatResultGrid {
  readonly items = input.required<readonly Item[]>();
  readonly compact = input(false);
  readonly label = input.required<string>();
  readonly canLoadMore = input(false);
  readonly pending = input(false);
  readonly moreRequested = output<string>();
  readonly mediaLabel = computed(() => this.label().toLocaleLowerCase('nb-NO'));
}
