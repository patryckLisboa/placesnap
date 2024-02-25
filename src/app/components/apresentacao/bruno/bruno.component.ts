import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bruno',
  templateUrl: './bruno.component.html',
  styleUrls: ['./bruno.component.scss'],
})
export class BrunoComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.router.navigate([`/${params['id']}`]);
      }
    });
  }
}
