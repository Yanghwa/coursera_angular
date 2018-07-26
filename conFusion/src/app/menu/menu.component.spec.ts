import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MenuComponent } from './menu.component';

// import { MatToolbarModule } from '@angular/material/toolbar'; 
// import { FlexLayoutModule } from '@angular/flex-layout';
// import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatInputModule } from '@angular/material/input';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSliderModule } from '@angular/material/slider';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { DISHES } from '../shared/dishes';
import { baseURL } from '../shared/baseurl';
import { Observable } from 'rxjs';
import { of } from 'rxjs';


describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    let dishServiceStub = {
      getDishes: function(): Observable<Dish[]> {
        return of(DISHES);
      }
    };
    TestBed.configureTestingModule({
      imports: [ 
        BrowserAnimationsModule,
        // FlexLayoutModule,
        // MatToolbarModule,
        // MatListModule,
        MatGridListModule,
        // MatToolbarModule,
        // FlexLayoutModule,
        // MatListModule,
        // MatGridListModule,
        // MatCardModule,
        // MatButtonModule,
        // MatDialogModule,
        // MatInputModule,
        // MatCheckboxModule,
        // MatSelectModule,
        // MatSlideToggleModule,
        // ReactiveFormsModule,
        MatProgressSpinnerModule,
        // MatSliderModule,
        RouterTestingModule.withRoutes([{ path: 'menu', component: MenuComponent }]) 
      ],
      declarations: [ MenuComponent ],
      providers: [
        { provide: DishService, useValue: dishServiceStub },
        { provide: 'BaseURL', useValue: baseURL },
      ]
    })
    .compileComponents();

    let dishservice = TestBed.get(DishService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dishes items should be 4', () => {
    expect(component.dishes.length).toBe(4);
    expect(component.dishes[1].name).toBe('Zucchipakoda');
    expect(component.dishes[3].featured).toBeFalsy();
  });

  it('should use dishes in the template', () => {
    fixture.detectChanges();

    let de:      DebugElement;
    let el:      HTMLElement;
    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
    
    expect(el.textContent).toContain(DISHES[0].name.toUpperCase());

  });
});
