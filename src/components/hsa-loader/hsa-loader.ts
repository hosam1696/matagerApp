import {Component, ElementRef, Input, Renderer2, OnInit} from '@angular/core';


@Component({
  selector: 'hsa-loader',
  templateUrl: 'hsa-loader.html'
})
export class HsaLoaderComponent implements OnInit{
  @Input('Color') Color: string;
  text: string;

  constructor(
    private el: ElementRef,
    private render: Renderer2
  ) {
    this.text = 'Hello World';
    console.log(this.el.nativeElement, this.Color);

  }

  ngOnInit () {
    this.render.addClass(this.el.nativeElement, this.Color);
  }

}
