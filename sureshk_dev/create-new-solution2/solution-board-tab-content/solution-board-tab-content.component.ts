import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NextChangeService } from 'src/app/core/services/solution/next-change.service';

@Component({
  selector: 'app-solution-board-tab-content',
  templateUrl: './solution-board-tab-content.component.html',
  styleUrls: [
    './solution-board-tab-content.component.scss',
    './../create-new-solution2.component.scss',
  ],
})
export class SolutionBoardTabContentComponent implements OnInit {
  @Input() tabs!: any;
  showUploadFilesTab: boolean = false;
  @Input() processId!: any;
  @Input() masterSelected!: boolean;
  @Input() isUploadFilesNextBtnEnable!: boolean;
  @Output() changeTabValue = new EventEmitter<Array<any>>();

  uploadedFiles: Array<any> = [];

  constructor(
    private nextDataService: NextChangeService,
    private solService: SolutionService
  ) {}

  ngOnInit() {
    console.log(
      'this.nextDataService.uploadedFiles: ',
      this.nextDataService.uploadedFiles
    );
    let uploadedFiles = this.nextDataService.uploadedFiles;
    if (uploadedFiles && uploadedFiles.length > 0){
      this.uploadedFiles = this.nextDataService.uploadedFiles;
      this.showUploadFilesTab = true;
    }
  }

  checkUncheckAllUploadFiles() {
    this.uploadedFiles.forEach((obj: any) => {
      obj?.totalSheetList?.forEach((item: any) => {
        item.isSheetSelected = this.masterSelected;
      });
    });
    this.nextBtnEnableInUF();
  }

  nextBtnEnableInUF() {
    const checkedSheets = this.uploadedFiles
      .filter((element: any) =>
        element.totalSheetList?.some(
          (subElement: any) => subElement.isSheetSelected == true
        )
      )
      .map((element: any) => {
        return Object.assign({}, element, {
          totalSheetList: element.totalSheetList.filter(
            (subElement: any) => subElement.isSheetSelected == true
          ),
        });
      });
    if (checkedSheets.length == 0) this.isUploadFilesNextBtnEnable = true;
    else this.isUploadFilesNextBtnEnable = false;
  }

  isAllSelectedUploadFiles() {
    let p = 1;
    this.uploadedFiles.forEach((obj: any) => {
      obj.totalSheetList.forEach((item: any) => {
        if (item.isSheetSelected == false) {
          p = 0;
          return;
        }
      });
    });
    if (p == 0) this.masterSelected = false;
    else this.masterSelected = true;
    this.nextBtnEnableInUF();
  }

  saveiputFiles(ev: any) {
    //R
    this.showUploadFilesTab = true;
    // let processId: string = this.process.processId;
    const formData = new FormData();
    formData.append('processId', this.processId);

    for (let i = 0; i < ev.target.files.length; i++) {
      formData.append('file', ev.target.files[i]);
    }

    for (let index = 0; index < ev.target.files.length; index++) {
      const file = ev.target.files[index];
      this.uploadedFiles.push({
        fileName: file.name.split('.').slice(0, -1).join('.'),
        isProgressBar: true,
      });
    }

    // R
    this.solService.postInputFiles(formData).subscribe((res: any) => {
      if (res.statusCode == 200) {
        const sheetMetaData = JSON.parse(res.responseData.sheetMetaData);

        sheetMetaData.forEach((fileObj: any) => {
          fileObj.fileExtention = fileObj.fileName
            .split('.')
            .slice(1, 2)
            .join('');
          fileObj.fileName = fileObj.fileName.split('.').slice(0, -1).join('.');
          fileObj.totalSheetList.forEach((sheetObj: any) => {
            sheetObj.isSheetSelected = false;
            const sheetName = sheetObj.sheetName;
            sheetObj.sheet.forEach((columnObj: any) => {
              columnObj.isChecked = false;
              columnObj.tableName = sheetObj.tableName;
              columnObj.fs_A_JcolName =
                fileObj.fileName +
                '-' +
                sheetName +
                '[' +
                columnObj.columnName +
                ']';
            });
          });
        });
        this.nextDataService.uploadedFiles = sheetMetaData;
        this.uploadedFiles = sheetMetaData;
        console.log('uploadedFiles: ', this.uploadedFiles);
      }
    });
  }

  changeTabs(item: any) {
    let filesWithSelectedSheets: any = [];

    this.nextBtnEnableInUF();
    if (this.isUploadFilesNextBtnEnable == true) return;
    this.uploadedFiles.forEach((file: any) => {
      if (
        file.totalSheetList.filter((x: any) => x.isSheetSelected).length != 0
      ) {
        filesWithSelectedSheets.push(file);
      }
    });
    console.log('filesWithSelectedSheets: ', filesWithSelectedSheets);
    this.nextDataService.filteredFiles = filesWithSelectedSheets;
    console.log('tabs: ', this.tabs);
    this.changeTabValue.emit(
      this.tabs.map((obj: any) => {
        if (item.id == obj.id) obj.isActive = true;
        else obj.isActive = false;
        return obj;
      })
    );
  }
}
