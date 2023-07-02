import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

export interface DialogData {
  columnsArr: Array<any>;
  selectedM_A_S: Array<any>;
}

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss','./../create-new-solution2.component.scss']
})
export class PreviewDialogComponent implements OnInit {
  _data!:any;
  constructor(
    public dialogRef: MatDialogRef<PreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    console.log('dialog data: ', this.data)
    this._data = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
