import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';


@Directive({
    selector: '[change]'
})

export class changePropDirective implements OnInit{
    @Input('change') change: {
      prop: string,
      value: any
    };
    constructor(
        public elm: ElementRef,
        public rendrer: Renderer2
    ) {

    }

    ngOnInit() {
        this.rendrer.setStyle(this.elm.nativeElement, this.change.prop, this.change.value || '#666')
    }


}
