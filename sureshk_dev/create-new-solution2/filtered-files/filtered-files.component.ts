import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';
import { NextChangeService } from 'src/app/core/services/solution/next-change.service';

@Component({
  selector: 'app-filtered-files',
  templateUrl: './filtered-files.component.html',
  styleUrls: [
    './filtered-files.component.scss',
    './../create-new-solution2.component.scss',
  ],
})
export class FilteredFilesComponent implements OnInit {
  @Input() tabs!: any;
  @Input() filesWithSelectedSheets!: any;
  @Output() changeTabValue = new EventEmitter<Array<any>>();

  constructor(
    public dialog: MatDialog,
    private loader: LoaderService,
    private nextDataService: NextChangeService,
    private solService: SolutionService
  ) {
    console.log('this.nextDataService.data: ', this.nextDataService.filteredFiles);
  }

  ngOnInit() {
    this.filesWithSelectedSheets = this.nextDataService.filteredFiles;
    console.log('filesWithSelectedSheets: ', this.filesWithSelectedSheets);
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

  public gotoNextTab(tab:any): void {
    let list: Array<any> = [].splice(1, 1);
    this.filesWithSelectedSheets.forEach((file: any) => {
      file.totalSheetList.forEach((sheetObj: any) => {
        if (sheetObj.isSheetSelected) {
          const columnNames = sheetObj.sheet.map((x: any) => x.columnName);
          let obj = {
            fileName: file.fileName,
            isSelected: false,
            ...sheetObj,
            [sheetObj.sheetName]: sheetObj.sheetData,
            columnNames,
            [sheetObj.sheetName + 'columnList']: columnNames,
          };
          list.push(obj);
        }
      });
    });
    this.nextDataService.appendFiles = list;
    this.changeTabValue.emit(
      this.tabs.map((obj: any) => {
        if (tab.id == obj.id) obj.isActive = true;
        else obj.isActive = false;
        return obj;
      })
    );
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
}
