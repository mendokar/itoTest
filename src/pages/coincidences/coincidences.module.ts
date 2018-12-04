import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoincidencesPage } from './coincidences';

@NgModule({
  declarations: [
    CoincidencesPage,
  ],
  imports: [
    IonicPageModule.forChild(CoincidencesPage),
  ],
})
export class CoincidencesPageModule {}
