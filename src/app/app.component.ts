import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'placesnap';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.router.navigate([`/${params['id']}`]);
      }
    });
  }
}
