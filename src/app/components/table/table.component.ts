import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DataService } from 'src/app/service/data/data.service';

import { ChartType} from 'chart.js';
// import { SingleDataSet, Label } from 'ng2-charts';

  


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  empData: any
  groupedData:any
  label: any[] = []
  chartOptions: any
  constructor(private data: DataService) {
    this.data.getData().subscribe(val => {
      this.empData = val
      this.groupedData = this.transform(this.empData, 'EmployeeName')
      this.getLabel()

      this.chartOptions = {
        title: {
        text: "Employee vs Worked Days"
        },
        data: [
          {
            type: "pie",
            startAngle: -90,
            indexLabel: "{name}: {y}",
            dataPoints: this.label
          }
        ]
      }	

    })


  }

  transform(collection: any[], property: string): any[] {

    const groupedCollection = collection.reduce((previous, current)=> {
        if(!previous[current[property]]) {
            previous[current[property]] = [current];
        } else {
            previous[current[property]].push(current);
        }

        return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }

  

  ngOnInit(): void {
    this.getLabel()
  }

  getData(date1: any, date2: any){
    var firstDate = moment(date1)
    var secondDate = moment(date2)
    // his.diffInDays = this.firstDate.diff(this.secondDate, 'days')  
    var diffInDays = Math.abs(firstDate.diff(secondDate, 'hours'));
    return  diffInDays
  }

  gethour(list: any){
    var totalhours =0
    for(let i=0; i<list.length; i++){
      totalhours = totalhours + this.getData(list[i].StarTimeUtc, list[i].EndTimeUtc); //use i instead of 0
    }  
    return totalhours
  }

  getLabel(){
    for(let i=0; i<this.groupedData.length; i++){
      var name = this.groupedData[i].key
      var totalhours =this.gethour(this.groupedData[i].value)

      this.label.push({
        name: name,
        y: totalhours
      })
    }

    return this.label
  }


  public pieChartLabels: any[] = ['PHP', '.Net', 'Java'];

  public pieChartData: any = [50, 30, 20];

  public pieChartType: ChartType = 'pie';

  
}
