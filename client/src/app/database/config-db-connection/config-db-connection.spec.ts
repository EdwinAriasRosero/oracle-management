import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigDbConnection } from './config-db-connection';

describe('ConfigDbConnection', () => {
  let component: ConfigDbConnection;
  let fixture: ComponentFixture<ConfigDbConnection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigDbConnection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigDbConnection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
