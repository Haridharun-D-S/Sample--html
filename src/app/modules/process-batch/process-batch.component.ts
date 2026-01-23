import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/shared/services/sharedservice.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonLoaderService } from 'src/app/Standalone/common-loader/common-loader.service';
declare var $;

@Component({
  selector: 'app-process-batch',
  templateUrl: './process-batch.component.html',
  styleUrls: ['./process-batch.component.scss']
})
export class ProcessBatchComponent implements OnInit {
  constructor(private sharedService: SharedServiceService,
    public router: Router,
    private sanitizer: DomSanitizer,private loaderService: CommonLoaderService,
    ) {}
  
  batchList: string[] = [];
  message: SafeHtml = '';
  batchCount: number = 0;

  ngOnInit(): void {}


  processBatch() {
    this.loaderService.showLoader();
    this.sharedService.InitiateFolderIntake().subscribe({
      next: (response: any) => {
        this.loaderService.hideLoader();
        const result = response;
  
        this.batchCount = result.length;
  
        if (this.batchCount === 0) {
          this.message = this.sanitizer.bypassSecurityTrustHtml(
            'No new batches available in the input folder to process. Please add new batches and try again.'
          );
          this.batchList = [];
        } 
        // else if (this.batchCount <= 3) {
        //   const formattedList = result
        //     .map((name) => `<strong>${name}</strong>`)
        //     .join(', ')
        //     .replace(/, ([^,]*)$/, ', and $1');
        //   this.message = this.sanitizer.bypassSecurityTrustHtml(
        //     `Processing has started for the following <strong> ${this.batchCount} </strong> new batch(es): ${formattedList}. Please check the Batch Work Queue List for more details.`
        //   );
        //   this.batchList = result;
        // } 
        else {
          // const topThree = result.slice(0, 3).map((name) => `<strong>${name}</strong>`).join(', ');
          // const formattedList = `${topThree}, and others`;
          // this.message = this.sanitizer.bypassSecurityTrustHtml(
          //   `Processing has started for <strong> ${this.batchCount} </strong> new batch(es): ${formattedList}. Please check the Batch Work Queue List for further details.`
          // );
          this.message = 'Batch process started successfully, you can track the processing status in the Batch Work Queue List.';
          this.batchList = result;
        }
  
        (<any>$('#processSuccess')).modal('show');
      },
      error: (error) => {
        this.loaderService.hideLoader();
        console.error('Error during batch initiation:', error);
      },
      complete: () => {}
    });
  }

  gotoBatchPage() {
    if (this.batchCount != 0){
      this.router.navigate(['/dashboard']);
    }
  }
}
