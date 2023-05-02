import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ScrapperService } from '../service/scrapper.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileUploader } from 'ng2-file-upload';

interface Scrap {
  brandTitle: string;
  brandURL: string;
  brandLogoUrl: string | ArrayBuffer | null;
  brandDescription: string;
  keywords: string[] | string;
  typography: string[] | '';
  brandColors: string[];
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  public scrapURL: string = '';
  public selectedColor: string;
  scrappedDetails: Scrap;
  public selectedFile: File = null;

  public uploader: FileUploader = new FileUploader({
    url: `http://localhost:3000/api/colors`,
    itemAlias: 'image',
  });

  constructor(
    private route: ActivatedRoute,
    public scrapeService: ScrapperService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.route.queryParams.subscribe((params) => {
      this.scrapURL = params['url'];
      console.log('Website URL: ', this.scrapURL);
    });

    this.invokeScrapper(this.scrapURL);
  }

  invokeScrapper(scrappingURL: string) {
    this.scrapeService.scrape(scrappingURL).subscribe(
      (result) => {
        if (result.success) {
          this.scrappedDetails = result.data;
        }
        console.log(result);
        this.spinner.hide();
      },
      (error: any) => {
        console.log('Something went wrong ', error);
        this.toastr.error(error, 'Server Error', {
          timeOut: 10000,
        });
        this.spinner.hide();
        this.routeHome();
      }
    );
  }

  onFileSelected(event: any) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.scrappedDetails.brandLogoUrl = reader.result;
      };
    }

    console.log('file', file);

    if (file) {
      this.spinner.show();
      this.scrapeService
        .scrapeColors(file)
        .then((colors) => {
          this.scrappedDetails.brandColors = colors;
          this.spinner.hide();
        })
        .catch((error) => {
          console.error('Something went wrong ', error);
          this.toastr.error(error.message, 'Server Error', {
            timeOut: 10 * 1000,
          });
          this.spinner.hide();
        });

      this.uploader.uploadAll();

      this.uploader.onAfterAddingFile = (file) => {
        file.withCredentials = false;
      };

      this.uploader.onCompleteItem = (item: any, status: any) => {
        console.log('onCompleteItem status: ', status);
        console.log('Uploaded File Details:', item);
      };
    }
  }

  openColorPicker() {
    const picker = document.getElementById('uploadColor');
    picker.click();
  }

  updateColor(event: any) {
    console.log(event);
    this.selectedColor = event;
    this.addColor(this.selectedColor);
  }

  addColor(selectedColor: string) {
    this.scrappedDetails.brandColors.push(selectedColor);
  }

  routeHome() {
    this.router.navigate(['/home']);
  }
}
