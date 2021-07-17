import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isIframeMode = false;
  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.isIframeMode = this.activatedRoute.snapshot.queryParamMap.get('iframe') === '1' ?? false;
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data?.iframe === '1') {
        this.isIframeMode = true
      }
    })
  }
}
