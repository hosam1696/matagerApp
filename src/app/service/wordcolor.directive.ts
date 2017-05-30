import { Directive, ElementRef, Renderer2, Input } from '@angular/core';


@Directive({
    selector: '[wordcolor]'
})

export class wordColorDirective {
    @Input() Color: string;
    constructor(
        public elm: ElementRef,
        public rendrer: Renderer2
    ) {
        this.rendrer.setStyle(this.elm.nativeElement, 'color', this.Color || '#666')
    }

    
}