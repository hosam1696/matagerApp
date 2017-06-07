import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';


@Directive({
    selector: '[changeColor]'
})

export class wordColorDirective implements OnInit{
    @Input('changeColor') changeColor: {
      prop: string,
      value: any
    };
    constructor(
        public elm: ElementRef,
        public rendrer: Renderer2
    ) {

    }

    ngOnInit() {
        this.rendrer.setStyle(this.elm.nativeElement, this.changeColor.prop, this.changeColor.value || '#666')
    }


}
