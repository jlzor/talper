import { Component } from '@angular/core';
import { first, map, count } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { InicioService } from './inicio.service';
import { Estado } from './Estado';
import { HttpClient } from '@angular/common/http';

@Component({ templateUrl: 'inicio.component.html' })
export class InicioComponent {
    loading = false;
    users: User[];
    bEstado: boolean = false;
    labelEstado: string;
    results = []
    resultsContaminacion = []

    estados: Estado[];
    population2017: number[] = [];
    population2016: number[] = [];
    population2015: number[] = [];
    population20132017: number[] = [];

    contaminacionPorEstado: number[] = [];

    public barChartLabels: Label[] = [];
    public barChartLabelsContaminacion: Label[] = [];
    public barChartLabelsExtra: Label[] = [];
    
    public barChartType: ChartType = 'bar';
    public radarChartType: ChartType = 'radar';

    public barChartLegend = false;
    public barChartPlugins = [pluginDataLabels];

    public barChartData: ChartDataSets[] = [];
    public barChartDataContaminacion: ChartDataSets[] = [];
    public barChartDataExtra: ChartDataSets[] = [];

    public barChartOptions: ChartOptions = {};
    public barChartOptionsContaminacion: ChartOptions = {};
    public barChartOptionsExtra: ChartOptions = {};
    

    constructor(private userService: UserService, private http: HttpClient) { }

    ngOnInit() {
        this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        });  
     
        this.graficaPopulation();
        this.graficaContaminacion();
        this.graficaExtra();
    }

  public graficaPopulation(){
      //Simulo API ya que https://datausa.io/api/data?drilldowns=State&measures=Population&year=2017
      //No cuenta con los CORS habilitados para peticiones desde el local. Si tuviese acceso al backend del datausa pudiese habilitarlos y hacerlo funcionar
    let data2017 = 'assets/data/2017.json';
    let data2016 = 'assets/data/2016.json';
    let data2015 = 'assets/data/2017.json';

    this.http
        .get<any>(data2017)
        .subscribe(data => {
          // Read the result field from the JSON response.
          this.results = data;
          this.results.forEach(x => {
            this.barChartLabels.push(x.State)
            this.population2017.push(parseInt(x.Population));
          });
        
        });

        this.http
        .get<any>(data2016)
        .subscribe(data => {
          // Read the result field from the JSON response.
          this.results = data;
          this.results.forEach(x => {
            this.population2016.push(parseInt(x.Population));
          });
        });

        this.http
        .get<any>(data2015)
        .subscribe(data => {
          // Read the result field from the JSON response.
          this.results = data;
          this.results.forEach(x => {
            this.population2015.push(parseInt(x.Population));
          });
        });

        this.barChartData = [{ data: this.population2017, label: '2017' }, { data: this.population2016, label: '2016' }, { data: this.population2015, label: '2015' }];
        this.barChartOptions = {
            responsive: true,
            // We use these empty structures as placeholders for dynamic theming.
            scales: { xAxes: [{stacked: true}], yAxes: [{stacked: true}] },
            plugins: {
              datalabels: {
                anchor: 'end',
                align: 'end',
              }
            }
          };
    }

  public graficaPorEstado(estado){
    let all = 'assets/data/all.json';
    this.bEstado = true;
    this.http
        .get<any>(all)
        .subscribe(data => {
          // Read the result field from the JSON response.
          this.results = data;
          this.results.reverse().forEach(x => {
            if(x.State == estado){
                if(x.Year == "2013"){
                    this.population20132017.push(parseInt(x.Population));
                }
                else if(x.Year == "2014"){
                    this.population20132017.push(parseInt(x.Population));
                }
                else if(x.Year == "2015"){
                    this.population20132017.push(parseInt(x.Population));
                }
                else if(x.Year == "2016"){
                    this.population20132017.push(parseInt(x.Population));
                }
                else if(x.Year == "2017"){
                    this.population20132017.push(parseInt(x.Population));
                }
            }
           
          });
        });
    this.barChartLabels = ['2013','2014','2015','2016','2017'];
    this.barChartData = [{ data: this.population20132017, label: this.labelEstado }];
    this.barChartOptions =  {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: { xAxes: [{}], yAxes: [{}] },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
          }
        }
      };
    }

  public graficaContaminacion(){
    let contaminacion = 'assets/data/contaminacion.json';
    this.http
    .get<any>(contaminacion)
    .subscribe(data => {
      // Read the result field from the JSON response.
      this.resultsContaminacion = data;
      this.resultsContaminacion.forEach(x => {
        this.barChartLabelsContaminacion.push(x.State);
        this.contaminacionPorEstado.push(parseFloat(x.air_pollution))
      });
    });
    console.log(this.contaminacionPorEstado);
    this.barChartDataContaminacion = [{ data: this.contaminacionPorEstado, label: '2017' }];
    this.barChartOptionsContaminacion =  {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: { xAxes: [{}], yAxes: [{}] },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
          }
        }
      };
  }

  public graficaExtra(){
    this.barChartLabelsExtra = ['Comiendo', 'Nadando', 'Durmiendo', 'Programando', 'Diseñando', 'Ciclismo', 'Corriendo'];
    this.barChartDataExtra = [{ data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' }, { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }]
    this.barChartOptionsExtra =  {
        responsive: true,
      };
  }

  public populationClicked(e:any):void {
    if (e.active.length > 0) {
        const chart = e.active[0]._chart;
        const activePoints = chart.getElementAtEvent(e.event);
        if ( activePoints.length > 0) {

          const clickedElementIndex = activePoints[0]._index;
          const label = chart.data.labels[clickedElementIndex];

          const value = chart.data.datasets[0].data[clickedElementIndex];
          this.labelEstado = label;
          this.graficaPorEstado(label);
        }
      }
  }

}