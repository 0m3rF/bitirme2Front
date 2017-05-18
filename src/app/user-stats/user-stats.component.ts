import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {

  // Pie
  public pieChartLabels:string[] = ['Pop', 'Metal', 'Country'];
  public pieChartData:number[] = [300, 500, 100];
  public pieChartType:string = 'pie';
 
  // events
  public chartClicked(e:any):void {
   // console.log(e);
  }
 
  public chartHovered(e:any):void {
   // console.log(e);
  }

  constructor(private service: AppService) { }

  ngOnInit() {
  }

}
