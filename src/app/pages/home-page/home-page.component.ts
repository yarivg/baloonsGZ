import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params} from '@angular/router'
import { ReportService } from '../../../services/report.service'

declare var $: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  private reader: any = new FileReader()
  public imageBase64: string = null
  public currLocation: any
  public currAzimuth: any = ''
  
  constructor(private router: Router, private reportSrv: ReportService) {
    let splitString = window.location.href.split('entry=')
    
    if(splitString.length > 1 && ['undefined', '', null, undefined].includes(localStorage.getItem('userToken'))) {
      localStorage.setItem('userToken', splitString[1])
    }
  }

  ngOnInit() {
    this.reportSrv.checkLocation()
    this.reportSrv.checkAzimuth()
  }

  goToCaptureScreen() {
    this.router.navigate(['/capture']);
  }

  buttonClicked() {
    // activate camera
    $('input').click();
  }

  captureImage(event) {
    if (event.target.files && event.target.files[0]) {
      this.reader.readAsDataURL(event.target.files[0]); // read file as data url

      this.reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.imageBase64 = event.target.result;
        
        // Hold the image in memory, to be used in the next state(route)
        this.reportSrv.setImage(this.imageBase64);
        console.log('cached image', this.reportSrv.getImage())
        // Move further, to next route
        this.goToCaptureScreen();
      }

      this.reportSrv.locationWhenCapturing = this.currLocation
      this.reportSrv.azimuthWhenCapturing = this.currAzimuth
    }
  }
}
