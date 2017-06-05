import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {

    translate:any;

  userGenders = {"m":502,"f":382};
  public barChartOptions:any = {
    scaleShowVerticalLines: true,
   scales: {
          xAxes: [{
                  display: true,
                  scaleLabel: {
                      display: true,
                  }
              }],
          yAxes: [{
                  display: true,
                  ticks: {
                      beginAtZero: true,
                      steps: 10,
                      stepValue: 5,
                      max: 700
                  }
              }]
                },
    responsive: true
  };
  public barChartLabels:string[] = [ 'Gender'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [502], label: 'Male'},
    {data: [382], label: 'Female'}
  ];

  public doughnutChartLabels:string[] = [];
  public doughnutChartData:number[] = [];
  public doughnutChartType:string = 'doughnut';


  public dirtyData = {
    "Algeria":null,"Antarctica":null,
    "Argentina":29.3333333333,"Armenia":25.0,
    "Australia":21.0,"Austria":null,"Belarus":null,"Belgium":21.0,"Bosnia and Herzegovina":null,"Brazil":26.6666666667,"British Indian Ocean Territory":30.0,"Bulgaria":19.0,"Canada":24.1666666667,"Chile":26.0,"China":null,"Colombia":null,"Congo, the Democratic Republic of the":null,"Cote D'Ivoire":21.0,"Croatia":18.0,"Czech Republic":21.5,"Estonia":19.0,"Finland":22.5,"France":30.5,"Germany":27.6,"Greece":23.0,"Hungary":29.5,"Iceland":null,"India":null,"Ireland":20.0,"Israel":null,"Italy":23.375,"Japan":27.0,"Korea, Democratic People's Republic of":103.0,"Latvia":23.0,"Lithuania":null,"Macedonia":null,"Malta":null,"Mexico":24.8,"Morocco":22.0,"Netherlands":20.2,"Netherlands Antilles":null,"New Zealand":28.0,"Nicaragua":24.0,"Northern Mariana Islands":null,"Norway":26.1818181818,"Peru":30.0,"Poland":22.0,"Portugal":26.0,"Romania":22.0,"Russian Federation":23.4,"Serbia":25.5,"Singapore":null,"Slovakia":22.5,"Slovenia":null,"Spain":23.6666666667,"Sweden":26.4545454545,"Switzerland":30.3333333333,"Thailand":20.0,"Trinidad and Tobago":22.0,"Tunisia":null,"Turkey":26.6666666667,"United Kingdom":28.2894736842,"United States":25.380952381,"United States Minor Outlying Islands":21.0,"Venezuela":18.0,"Zimbabwe":null}



  constructor(private service: AppService) { 

            this.translate = service.getTranslate();

            var keys = Object.keys(this.dirtyData);

            for(var i = 0 ;i < keys.length ; i++)
            {
              if(this.dirtyData[keys[i]] != null)
              {
                this.doughnutChartLabels.push(keys[i]);
                this.doughnutChartData.push(this.dirtyData[keys[i]] )
              }
                
            }

  }

  ngOnInit() {
  }

}
