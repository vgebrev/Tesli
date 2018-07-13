import { Directive, Input, HostListener } from '@angular/core';

@Directive({ selector: '[routerLink]' })
export class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

/// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    RouterLinkStubDirective
  ]
})
export class RouterStubsModule {}
