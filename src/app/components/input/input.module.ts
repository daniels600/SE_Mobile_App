import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';


@NgModule({
    declarations: [InputComponent],
    imports: [ CommonModule, IonicModule  ],
    exports: [ InputComponent],
    providers: [],
})
export class InputModule {}