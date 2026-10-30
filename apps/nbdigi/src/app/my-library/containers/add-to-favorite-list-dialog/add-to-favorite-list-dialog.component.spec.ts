import { CommonModule } from '@angular/common';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatListModule } from '@angular/material/list';
import { MatActionListItemHarness } from '@angular/material/list/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { FavoriteFacade } from '../../../+state/favorite/favorite.facade';
import { CreateFavoriteListComponent } from '../../components/create-favorite-list/create-favorite-list.component';
import { AddToFavoriteListDialogComponent } from './add-to-favorite-list-dialog.component';

describe('AddToFavoriteListDialogComponent', () => {
  let fixture: ComponentFixture<AddToFavoriteListDialogComponent>;
  let loader: HarnessLoader;
  const favorite = {
    id: 'list-1',
    name: 'Min liste',
    items: [],
    timestamp: null,
  };
  const item = { id: 'item-1' };
  const dialogRef = { close: jest.fn() };
  const favoriteFacade = {
    getFavoriteList$: of([favorite]),
    addList: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      declarations: [
        AddToFavoriteListDialogComponent,
        CreateFavoriteListComponent,
      ],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatListModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { item } },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatSnackBar, useValue: {} },
        { provide: FavoriteFacade, useValue: favoriteFacade },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AddToFavoriteListDialogComponent);
    fixture.autoDetectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('adds the item to the selected list', async () => {
    const list = await loader.getHarness(
      MatActionListItemHarness.with({ title: favorite.name }),
    );
    await list.click();
    expect(dialogRef.close).toHaveBeenCalledWith({
      id: favorite.id,
      name: favorite.name,
      items: [item],
    });
  });

  it('closes the dialog when cancelled', async () => {
    await (
      await loader.getHarness(MatButtonHarness.with({ text: 'Avbryt' }))
    ).click();
    expect(dialogRef.close).toHaveBeenCalled();
    expect(favoriteFacade.addList).not.toHaveBeenCalled();
  });

  it('creates a list and returns to list selection', async () => {
    await (
      await loader.getHarness(MatButtonHarness.with({ text: 'Lag ny liste' }))
    ).click();
    await (await loader.getHarness(MatInputHarness)).setValue('Ny liste');
    await (
      await loader.getHarness(MatButtonHarness.with({ text: 'Lagre' }))
    ).click();
    expect(favoriteFacade.addList).toHaveBeenCalledWith('Ny liste');
    expect(await loader.hasHarness(MatActionListItemHarness)).toBe(true);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('returns to list selection when creating a list is cancelled', async () => {
    await (
      await loader.getHarness(MatButtonHarness.with({ text: 'Lag ny liste' }))
    ).click();
    await (
      await loader.getHarness(MatButtonHarness.with({ text: 'Avbryt' }))
    ).click();
    expect(await loader.hasHarness(MatActionListItemHarness)).toBe(true);
    expect(favoriteFacade.addList).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
