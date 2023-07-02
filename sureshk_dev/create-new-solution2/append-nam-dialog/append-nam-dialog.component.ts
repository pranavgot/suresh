import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

export interface DialogData {
  appendNameControl: string;
  formName: string
}

@Component({
  selector: 'app-append-nam-dialog',
  templateUrl: './append-nam-dialog.component.html',
  styleUrls: ['./append-nam-dialog.component.scss', './../create-new-solution2.component.scss']
})
export class AppendNamDialogComponent implements OnInit {

  appendForm!:FormGroup;
  submited!:boolean;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AppendNamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit() {
    this.appendForm = this.formBuilder.group({
      appendNameControl: ['', Validators.required],
    });
    this.submited = false;
  }

  public onSubmit(){
    this.submited = true;
    if (this.appendForm.invalid) return;
    this.dialogRef.close({name : this.appendForm.get('appendNameControl')?.value});
  }

}
