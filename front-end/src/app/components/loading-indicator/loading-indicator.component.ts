import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.css']
})
export class LoadingIndicatorComponent implements OnInit {
  
  @Input() isLoading:boolean;
  
  constructor() { }

  ngOnInit() {
  }

}
