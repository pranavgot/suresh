import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NextChangeService } from 'src/app/core/services/solution/next-change.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AppendNamDialogComponent } from '../append-nam-dialog/append-nam-dialog.component';
import { ToastComponent } from '../../../all-common/toast/toast.component';

@Component({
  selector: 'app-append-files',
  templateUrl: './append-files.component.html',
  styleUrls: [
    './append-files.component.scss',
    './../create-new-solution2.component.scss',
  ],
})
export class AppendFilesComponent implements OnInit {
  @Input() tabs!: any;
  @Input() processId!: any;
  @Output() changeTabValue = new EventEmitter<Array<any>>();

  sortedFileList: Array<any> = [];
  appendFiles: Array<any> = [];
  sortedCheckedList: Array<any> = [];

  submitted: boolean = false;
  submittedErrorMsg!: string;
  hideCreateIdenticalBtn: boolean = false;

  constructor(
    private toast: ToastComponent,
    public dialog: MatDialog,
    private loader: LoaderService,
    private nextDataService: NextChangeService,
    private solService: SolutionService
  ) {}

  ngOnInit() {
    let data = this.nextDataService.appendFiles;
    if (data && data.length > 0) {
      this.sortedFileList = data;
    }
    console.log('sortedFileList: ', this.sortedFileList);
  }

  public previewPopup(item: any, name: string): void {
    let selectedM_A_S = [];
    let columnsArr = [];
    if (name != '' || name?.length != 0) {
      this.loader.show();
      this.solService.viewTableDetails(name).subscribe(
        (res: any) => {
          selectedM_A_S = res.responseData;
          columnsArr = this.preview(selectedM_A_S[0]);
          this._previewPopup(columnsArr, selectedM_A_S);
          this.loader.hide();
        },
        (err: any) => {
          this.loader.hide();
        }
      );
    } else {
      selectedM_A_S = item.sheetData;
      columnsArr = this.preview(selectedM_A_S[0]);
      this._previewPopup(columnsArr, selectedM_A_S);
    }
  }

  private _previewPopup(
    columnsArr: Array<any>,
    selectedM_A_S: Array<any>
  ): void {
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      data: { columnsArr, selectedM_A_S },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  private preview(selectedM_A_S: any) {
    let columnsArr = [];
    //identify unique keys in the array
    for (var key in selectedM_A_S) {
      if (selectedM_A_S.hasOwnProperty(key)) {
        columnsArr.push(key);
      }
    }
    return columnsArr;
  }

  isAllSelected(e: any, i: number) {
    this.submitted = false;
    this.submittedErrorMsg = '';
    this.sortedFileList.forEach((item: any, index: number) => {
      if (index == i) {
        item.isSelected = e.target.checked;
      }
    });
  }

  public addAppendName() {
    let checkedList = this.sortedFileList.filter(
      (x: any) => x.isSelected == true
    );
    if (checkedList.length < 2) {
      this.submitted = true;
      this.submittedErrorMsg = 'please select atleast 2 checkboxes';
      return;
    }

    this.createIdentical();
  }

  public createIdentical() {
    let checkedSheetColumns: any[] = [];
    let k = 0;
    let checkedList = this.sortedFileList.filter(
      (x: any) => x.isSelected == true
    );

    console.log('checkedList: ', checkedList);

    checkedList.forEach((obj: any) => {
      const sName = obj.sheetName;
      if (checkedSheetColumns.length == 0) {
        checkedSheetColumns = obj[sName + 'columnList'];
      } else {
        let columnsList = obj[sName + 'columnList'];
        checkedSheetColumns.forEach((value: any) => {
          if (!columnsList.includes(value)) {
            k = 1;
            return;
          }
        });
      }
    });
    console.log('checkedSheetColumns: ', checkedSheetColumns);
    console.log('k==', k);
    if (k == 1) {
      this.submitted = true;
      this.submittedErrorMsg =
        'Ensure that the files with identical columns are selected for appending';
      return;
    }

    const dialogRef = this.dialog.open(AppendNamDialogComponent,{data:{formName:'Append'}});
    dialogRef.afterClosed().subscribe(async (result) => {
      console.log('The dialog was closed');
      console.log(result);
      if (result != 'cancel') {
        this.loader.show();
        await this.createAppendSet(result.name);
      }
    });
  }

  private async createAppendSet(appendName: string) {
    let checkedList = this.sortedFileList.filter((x: any) => x.isSelected);
    this.sortedFileList.forEach(
      (sheetObj: any) => (sheetObj.isSelected = false)
    );

    const fileName_SheetNamee = checkedList.map((x: any) =>
      [x.fileName, x.sheetName].join('-')
    );

    const columnList: Array<any> = [];
    console.log('checkedList: ', checkedList);
    checkedList[0].sheet.forEach((colObj: any) => {
      colObj = JSON.parse(JSON.stringify(colObj));
      colObj.fs_A_JcolName = `${appendName}[${colObj.columnName}]`;
      const cObj = {
        ...colObj,
        isChecked: false,
        dataType: 'Select Data Type',
        newColumnName: '',
        isRowEdit: false,
        fileSheet: [appendName],
        appendName: appendName,
      };
      columnList.push(cObj);
    });

    const identicalSet = {
      columnList: columnList,
      showAppendName: [appendName],
      fileName_SheetName: fileName_SheetNamee,
      tableList: checkedList,
      isSelected: false,
      isAppend: true,
    };
    this.sortedCheckedList.push(identicalSet);
    console.log('sortedCheckedList after: ', this.sortedCheckedList);
    this.nextDataService.sortedCheckedList = this.sortedCheckedList
    await this.saveAppendAPI(this.sortedCheckedList);
  }

  private async saveAppendAPI(sortedCheckedList: Array<any>) {
    const appendSheetList: any[] = [];
    sortedCheckedList.forEach((appendObj: any) => {
      const appendDtos: any[] = [];
      appendObj.tableList.forEach((tableObj: any) => {
        appendDtos.push({
          sheetId: tableObj.templateId,
          fileName: tableObj.fileName,
        });
      });
      appendSheetList.push({
        appendDtos,
        appendName: appendObj.showAppendName.join(),
      });
    });

    const appendObj: any = {
      processId: this.processId,
      appendSheetList: appendSheetList,
    };

    this.solService.addAppendFiles(appendObj).subscribe(
      async (res: any) => {
        // this.appendAPIResp = res.responseData;
        sortedCheckedList.forEach((_appendObj: any) => {
          _appendObj.isPreviewEnable = true;
        });
        this.toast.success({
          title: 'Success',
          message: 'Saved Successfully !',
        });
        this.loader.hide();
        await this.getAppendFiles();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  private async getAppendFiles() {
    this.solService.getAppendFiles(this.processId).subscribe((res: any) => {
      console.log(res);
      this.appendFiles = res.responseData.appendSheetList;
      // this.sortedCheckedList = res.responseData.appendSheetList;
    });
  }

  public deleteTables(e: Event, item: any): void {
    console.log('e: ', e);
    console.log('item: ', item);
    // this.solService.deleteTables({id:item.appendID, type:'append', operation:'check'}).subscribe((res:any)=>{
    //   console.log(res);
    this.solService
      .deleteTables({ id: item.appendID, type: 'append', operation: 'delete' })
      .subscribe((res: any) => {
        console.log(res);
        this.appendFiles.splice(
          this.appendFiles.findIndex((ele) => ele.id === item.id),
          1
        );
      });
    // })
  }

  public gotoPreviousTab(tab: any) {
    console.log('tabs: ', this.tabs);
    this.changeTabValue.emit(
      this.tabs.map((obj: any) => {
        if (tab.id == obj.id) obj.isActive = true;
        else obj.isActive = false;
        return obj;
      })
    );
  }

  public gotoNextTab(tab: any): void {
    if (this.sortedFileList.length > 0) {
      let unCheckedListAddToMergeList = this.sortedFileList.filter(
        (x: any) => x.isSelected == false
      );
      unCheckedListAddToMergeList.forEach((obj: any) => {
        const fileName_SheetNamee = [obj].map((x: any) =>
          [x.fileName, x.sheetName].join('-')
        );
        //
        const columnList: any[] = [];
        //intg changes
        obj.sheet.forEach((sheetObj: any) => {
          const columnObj = {
            ...sheetObj,
            isChecked: false,
            dataType: 'Select Data Type',
            newColumnName: '',
            isRowEdit: false,
            fileSheet: fileName_SheetNamee,
            tableName: obj.tableName,
          };
          columnList.push(columnObj);
        });

        const identicalSet = {
          columnList,
          showAppendName: fileName_SheetNamee,
          fileName_SheetName: fileName_SheetNamee,
          tableList: [obj],
          isSelected: false,
        };
        this.sortedCheckedList.push(identicalSet);
        this.nextDataService.sortedCheckedList = this.sortedCheckedList;
        // this.appendUnchechedList = [];
        console.log('appendUnchechedList this.sortedCheckedList: ', this.sortedCheckedList)
        let appendUnchechedList = JSON.parse(
          JSON.stringify(this.sortedCheckedList)
        );
        this.nextDataService.appendUnchechedList = appendUnchechedList;
      });
      this.nextDataService.unCheckedListAddToMergeList = unCheckedListAddToMergeList;
      this.changeTabValue.emit(
        this.tabs.map((obj: any) => {
          if (tab.id == obj.id) obj.isActive = true;
          else obj.isActive = false;
          return obj;
        })
      );
    }
  }
}
