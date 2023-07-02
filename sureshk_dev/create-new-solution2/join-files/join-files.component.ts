import { MatDialog } from '@angular/material/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastComponent } from '../../../all-common/toast/toast.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NextChangeService } from 'src/app/core/services/solution/next-change.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { AppendNamDialogComponent } from '../append-nam-dialog/append-nam-dialog.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { joinType, JOIN_TABLE_KEYS } from '../solution-board.config';

@Component({
  selector: 'app-join-files',
  templateUrl: './join-files.component.html',
  styleUrls: [
    './join-files.component.scss',
    './../create-new-solution2.component.scss',
  ],
})
export class JoinFilesComponent implements OnInit {
  @Input() tabs!: any;
  @Input() processId!: any;
  @Output() changeTabValue = new EventEmitter<Array<any>>();
  pkFKs = JOIN_TABLE_KEYS;
  joinType = joinType;

  sortedCheckedList: Array<any> = [];
  appendUnchechedList: Array<any> = [];
  mergeCheckedList: Array<any> = [];
  mergeList: Array<any> = [];
  sortedFileList: Array<any> = [];
  unCheckedListAddToMergeList: Array<any> = [];

  submitted: boolean = false;
  submittedErrorMsg!: string;

  joinSetForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastComponent,
    public dialog: MatDialog,
    private loader: LoaderService,
    private nextDataService: NextChangeService,
    private solService: SolutionService
  ) {}

  ngOnInit() {
    let sdata = this.nextDataService.sortedCheckedList;
    if (sdata && sdata.length > 0) this.sortedCheckedList = sdata;

    let adata = this.nextDataService.appendUnchechedList;
    if (adata) this.appendUnchechedList = adata;

    let sfldata = this.nextDataService.appendFiles;
    if (sfldata && sfldata.length > 0) this.sortedFileList = sfldata;

    let ucdata = this.nextDataService.unCheckedListAddToMergeList;
    if (ucdata && ucdata.length > 0) this.unCheckedListAddToMergeList = ucdata;

    console.log('sortedCheckedList: ', this.sortedCheckedList);
    this.joinSetForm = this.formBuilder.group({
      Merg: this.formBuilder.array([]),
    });
  }

  Merg(): FormGroup {
    return this.formBuilder.group({
      tableControl: this.formBuilder.array([]),
    });
  }

  addTable(): FormGroup {
    return this.formBuilder.group({
      table1: ['', Validators.required],
      join: ['', Validators.required],
      table2: ['', Validators.required],
      column: this.formBuilder.array([]),
    });
  }

  addColumn(): FormGroup {
    return this.formBuilder.group({
      column1: ['', Validators.required],
      column2: ['', Validators.required],
    });
  }

  MergeArr(): FormArray {
    return this.joinSetForm.get('Merg') as FormArray;
  }

  TableArr(i: number): FormArray {
    return this.MergeArr().controls[i].get('tableControl') as FormArray;
  }

  columnArr(i: number, j: number): FormArray {
    return this.TableArr(i).controls[j].get('column') as FormArray;
  }

  getMergeList() {
    this.solService.getMergeList(this.processId).subscribe((res: any) => {
      console.log(
        'getMergeList: ',
        res.responseData.templatesMergeDetailsList[0]
      );
      let resp = res.responseData.templatesMergeDetailsList;
      this.mergeList = res.responseData.templatesMergeDetailsList;

      resp.forEach((ele: any, ind: number) => {
        ele.templatesMergeList.forEach((element: any, j: number) => {
          element.columnArrayList.forEach((colElement: any) => {});
        });
      });
    });
  }

  addMergeJoin() {
    this.MergeArr().push(this.Merg());
    let len = this.MergeArr().length;
    this.TableArr(len - 1).push(this.addTable());
    let j = this.TableArr(len - 1).length;
    this.columnArr(len - 1, j - 1).push(this.addColumn());
  }

  addTableJoins(i: any) {
    this.TableArr(i).push(this.addTable());
    let len = this.TableArr(i).length;
    this.columnArr(i, len - 1).push(this.addColumn());
  }

  addColumnJoin(i: any, j: any) {
    //column add
    this.columnArr(i, j).push(this.addColumn());
  }

  removeTable(i: any, j: any) {
    // let len=this.TableArr(i).controls.length
    this.TableArr(i).removeAt(j);
  }

  removeCol(i: any, j: any, k: any) {
    this.columnArr(i, j).removeAt(k);
  }

  checkedInJoin(e: any, obj: any, i: number) {
    this.submitted = false;
    this.submittedErrorMsg = '';
    obj.isSelected = e.target.checked;
  }

  join2Sheets() {
    let checkedSortedList = this.sortedCheckedList.filter(
      (x) => x.isSelected == true
    );
    if (checkedSortedList.length < 2) {
      this.submitted = true;
      this.submittedErrorMsg = 'Please select atleast two sheets';
      return;
    }

    const dialogRef = this.dialog.open(AppendNamDialogComponent, {
      data: { formName: 'Join' },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      console.log('The dialog was closed');
      console.log(result);
      if (result != 'cancel') {
        this.loader.show();
        await this.mergeSet(result.name);
      }
    });
  }

  private async mergeSet(name: string) {
    this.addMergeJoin();
    let mergedTableList: Array<any> = [];
    let primaryTableList: any = [];
    console.log('this.sortedCheckedList: ', this.sortedCheckedList);
    let checkedSortedList = this.sortedCheckedList.filter(
      (x) => x.isSelected == true
    );
    console.log('checkedSortedList: ', checkedSortedList);
    // return;

    let mergeName: any[] = [];

    let mergeTableSheetNames: any[] = [];
    const columnList: any[] = [];

    checkedSortedList.forEach((obj: any) => {
      obj.fileName_SheetName.forEach((s: any) => {
        mergeName.push(s);
      });

      obj.tableList.forEach((obj1: any) => {
        mergedTableList.push(obj1);
      });

      obj.showAppendName.forEach((arrVal: any) => {
        mergeTableSheetNames.push(arrVal);
      });

      obj.columnList.forEach((cLObj: any) => {
        cLObj = JSON.parse(JSON.stringify(cLObj));
        cLObj.fs_A_JcolName = `${name}[${cLObj.columnName}]`;
        columnList.push({
          ...cLObj,
          joinName: name,
        });
      });
    });

    mergedTableList.forEach((fileObj: any) => {
      primaryTableList.push({
        value: fileObj.fileName + ' - ' + fileObj.sheetName,
        templateId: fileObj.templateId,
        sheet: fileObj.sheet,
        isSelected: false,
      });
    });
    primaryTableList.primaryKeyList = [];

    this.pkFKs.forEach((res: any) => {
      if (res.hasOwnProperty('primaryTableList'))
        res['primaryTableList'] = mergeTableSheetNames;
    });

    console.log('this.pkFKs: ', this.pkFKs);

    let foreignTableList: any = [];
    foreignTableList.foreignKeyList = [];
    let objMerge = {
      dropDownList: [{ primaryTableList, foreignTableList }],
      columnList,
      mergeList: checkedSortedList,
      mergeName: name,
      mergedTableList,
      showMergeSheetNames: mergeTableSheetNames,
      pkFkMergeTypeList: this.pkFKs,
      templatesMergeList: [
        {
          order: 1,
          mergeName: name,
        },
      ],
    };

    this.mergeCheckedList.push(objMerge);
    // this.enableMergeNamePopup = false;
    this.sortedCheckedList.forEach((appAndFilesObj: any) => {
      appAndFilesObj.isSelected = false;
    });

    console.log('joinSetForm after merge: ', this.joinSetForm);
    this.MergeSubmit();

  }

  selectPrimaryTable(e: any, j: number, i: number) {
    const value = e.value.value;
    let ddl = this.mergeCheckedList[i].dropDownList[j];
    // console.log(item,j,i);

    if (j == 0) {
      ddl.primaryTableList.forEach(
        (priTab: any) => (priTab.isSelected = false)
      );
      e.value.isSelected = true;
      ddl.foreignTableList = ddl.primaryTableList.filter(
        (x: any) => !x.isSelected
      );
      ddl.foreignTableList.foreignKeyList = [];

      //columns
      ddl.primaryTableList.primaryKeyList = [];
      ddl.primaryTableList.primaryKeyList.push(e.value.sheet);
    } else {
    }
    console.log(this.mergeCheckedList[i]?.dropDownList[j]);
  }

  selectForeignTable(e: any, j: number, i: number) {
    const value = e.value.value;
    let ddl = this.mergeCheckedList[i].dropDownList[j];
    this.mergeCheckedList[i].dropDownList[j].foreignTableList.forEach(
      (priTab: any) => (priTab.isSelected = false)
    );
    e.value.isSelected = true;
    //columns
    ddl.foreignTableList.foreignKeyList = [];
    ddl.foreignTableList.foreignKeyList.push(e.value.sheet);

    let ptl: any = [];
    let ftl: any = [];
    if (j == 0) {
      const pt = this.mergeCheckedList[i].dropDownList[
        j
      ].primaryTableList.filter((x: any) => x.isSelected == true)[0];
      ptl.push(pt);
      const ft = this.mergeCheckedList[i].dropDownList[
        j
      ].foreignTableList.filter((x: any) => x.isSelected == true)[0];
      ptl.push(ft);
      ptl.primaryKeyList = [];
      const fpt = this.mergeCheckedList[i].dropDownList[
        j
      ].primaryTableList.filter((x: any) => x.isSelected == false);
      fpt.forEach((fptObj: any) => ftl.push(fptObj));

      const fft = this.mergeCheckedList[i].dropDownList[
        j
      ].foreignTableList.filter((x: any) => x.isSelected == false);
      fft.forEach((fftObj: any) => ftl.push(fftObj));

      let ftlUnduplicate: any = [];
      ftlUnduplicate = ftl.filter(
        (v: any, i: any, a: any) =>
          a.findIndex((v2: any) =>
            ['templateId'].every((k) => v2[k] === v[k])
          ) === i
      );
      ftlUnduplicate.foreignKeyList = [];
      this.mergeCheckedList[i].dropDownList[j + 1] = {
        primaryTableList: ptl,
        foreignTableList: ftlUnduplicate,
      };
      console.log(this.mergeCheckedList);
      if (
        this.mergeCheckedList[i].dropDownList[j + 1].foreignTableList.length ==
        0
      ) {
        this.mergeCheckedList[i].allTablesSelected = true;
      }
    } else {
      this.mergeCheckedList[i].dropDownList[j].primaryTableList.forEach(
        (obj: any) => ptl.push(obj)
      );
      const ft = this.mergeCheckedList[i].dropDownList[
        j
      ].foreignTableList.filter((x: any) => x.isSelected == true)[0];
      ptl.push(ft);
      ptl.primaryKeyList = [];
      const fft = this.mergeCheckedList[i].dropDownList[
        j
      ].foreignTableList.filter((x: any) => x.isSelected == false);
      fft.forEach((fftObj: any) => ftl.push(fftObj));
      let ftlUnduplicate = ftl.filter(
        (v: any, i: any, a: any) =>
          a.findIndex((v2: any) =>
            ['templateId'].every((k) => v2[k] === v[k])
          ) === i
      );
      ftlUnduplicate.foreignKeyList = [];
      this.mergeCheckedList[i].dropDownList[j + 1] = {
        primaryTableList: ptl,
        foreignTableList: ftlUnduplicate,
      };
      console.log(this.mergeCheckedList);
      if (
        this.mergeCheckedList[i].dropDownList[j + 1].foreignTableList.length ==
        0
      ) {
        this.mergeCheckedList[i].allTablesSelected = true;
      }
    }

    console.log(this.mergeCheckedList[i].dropDownList[j + 1]);
  }

  selectPrimarykey(e: any, j: number) {
    const value = e.value;
  }
  selectForeignKey(e: any, j: number) {
    const value = e.value;
  }

  resetMerge() {
    this.mergeCheckedList = [];
    const appendList = this.appendUnchechedList.filter(
      (x: any) => x.isAppend == true
    );
    if (appendList.length > 0) {
      this.sortedCheckedList = JSON.parse(JSON.stringify(appendList));
    } else {
      this.sortedCheckedList = JSON.parse(JSON.stringify(appendList));
    }

    // this.gotoNextTab({ id: 3 }, 'unChedkedList');
    this.MergeArr().clear();
  }

  public MergeSubmit() {
    this.loader.show();
    let data: any = {};
    data.processId = this.processId;
    data.templatesMergeDetailsList = [{}];
    console.log('this.mergeCheckedList: ', this.mergeCheckedList);
    this.MergeArr().controls.forEach((ele: any, i: any) => {
      console.log('this.mergeCheckedList[i].mergeName:', this.mergeCheckedList[i]);
      data.templatesMergeDetailsList[i].mergeName = this.mergeCheckedList[i].mergeName;
      data.templatesMergeDetailsList[i].templatesMergeList = [{}];
      this.TableArr(i).controls.forEach((elem: any, j: any) => {
        console.log(elem);
        data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTemplateId = elem.value.table1.templateId;
        data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTemplateId = elem.value.table2.templateId;
        data.templatesMergeDetailsList[i].templatesMergeList[j].joinType = elem.value.join[0];
        data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTableName = '';
        data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTableName = '';
        data.templatesMergeDetailsList[i].templatesMergeList[j].order = j == 0 ? 1 : 2;
        data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList = [{}];
        this.columnArr(i, j).controls.forEach((element: any, k: any) => {
          console.log(element);
          data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].primaryKeyId = element.value.column1.columnId;
          data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].secondaryKeyId = element.value.column2.columnId;
        });
      });
    });
    console.log(data);
    this.solService.addJoinFiles(data).subscribe(
      (res: any) => {
        console.log(res);
        let dataMergeList: {
          joinType: '';
          primaryTemplateId: '';
          secondaryTemplateId: '';
          primaryKeyId: '';
          secondaryKeyId: '';
        }[] = [];

        // templatesMergeList
        const response: any[] = res.responseData.templatesMergeDetailsList;
        response.forEach((merge: any) => {
          merge.templatesMergeList.forEach((list: any) => {
            list.columnArrayList.forEach((col: any) => {
              dataMergeList.push({
                joinType: list.joinType,
                primaryTemplateId: list.primaryTemplateId,
                secondaryTemplateId: list.secondaryTemplateId,
                primaryKeyId: col.primaryKeyId,
                secondaryKeyId: col.secondaryKeyId,
              });
              this.toast.success({
                title: 'Success',
                message: 'Saved Successfully !',
              });
            });
          });

          console.log('dataMergeList: ', dataMergeList);

          response.forEach((fileObj: any) => {
            this.mergeCheckedList.forEach((mcL: any) => {
              if (fileObj.mergeName == mcL.mergeName) {
                mcL.mergeIdFromAPI = fileObj.mergeId;

                mcL.templatesMergeIdsListFromAPI = dataMergeList;
                mcL.mergeFieldListDTOFromAPI = fileObj.mergeFieldListDTO;
              }
            });
          });
        });

        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  public gotoNextORPreviousTab(tab: any, value?:string) {
    if(!value){
      if (this.sortedFileList?.length > 0) {
        let sortedLength = this.sortedFileList?.length;
        let sortedCheckedLength = this.sortedCheckedList.length;
        this.sortedCheckedList.splice(
          sortedCheckedLength - sortedLength,
          this.unCheckedListAddToMergeList.length
        );
      }
    }
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
