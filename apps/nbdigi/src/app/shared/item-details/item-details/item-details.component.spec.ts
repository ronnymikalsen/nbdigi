import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { ItemActions, PresentationApiActions } from '../../../core/actions';
import { Manifest } from '../../../core/presentation-service/manifest.model';
import * as fromRoot from '../../../core/reducers';
import { TestItems } from '../../../item/metadata/shared/item.mock';
import { ItemDetailsComponent } from './item-details.component';

describe('ItemDetailsComponent', () => {
  let component: ItemDetailsComponent;
  let fixture: ComponentFixture<ItemDetailsComponent>;
  let store: Store<fromRoot.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [StoreModule.forRoot(fromRoot.reducers, {})],
      declarations: [ItemDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getItemCurrentItem', () => {
    store.dispatch(new ItemActions.LoadItemDetails(TestItems.aDefaultItem()));

    const expected = cold('a', { a: TestItems.aDefaultItem() });
    expect(component.item$).toBeObservable(expected);
  });

  it('should getItemCurrentManifest', () => {
    const manifest: Manifest = { id: '1', metadata: null };
    store.dispatch(new PresentationApiActions.LoadSuccess(manifest));

    const expected = cold('a', { a: manifest });
    expect(component.manifest$).toBeObservable(expected);
  });

  it('should getItemLoading', () => {
    store.dispatch(new ItemActions.LoadItemDetails(TestItems.aDefaultItem()));

    const expected = cold('a', { a: true });
    expect(component.loading$).toBeObservable(expected);
  });
});
