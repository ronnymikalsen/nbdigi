import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ItemDetailsMetadataComponent } from './item-details-metadata.component';

describe('ItemDetailsMetadataComponent', () => {
  let component: ItemDetailsMetadataComponent;
  let fixture: ComponentFixture<ItemDetailsMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemDetailsMetadataComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailsMetadataComponent);
    component = fixture.componentInstance;
    component.manifest = aDefaultManifest();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show metadata', () => {
    const metadatas = fixture.debugElement.queryAll(By.css('.metadata'));

    expect(metadatas.length).toBe(1);
  });

  function aDefaultManifest() {
    return {
      id: '1',
      metadata: [{ label: 'test-label', value: 'test-value' }]
    };
  }
});
