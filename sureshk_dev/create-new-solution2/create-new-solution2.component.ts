import { SolutionBoardTabContentComponent } from './solution-board-tab-content/solution-board-tab-content.component';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import * as XLSX from 'xlsx';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SELECT_ITEM_HEIGHT_EM } from '@angular/material/select/select';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { Observable, of, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ToastComponent } from '../../all-common/toast/toast.component';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-create-new-solution2',
  templateUrl: './create-new-solution2.component.html',
  styleUrls: ['./create-new-solution2.component.scss'],
  providers:[SolutionBoardTabContentComponent]
})
export class CreateNewSolution2Component implements OnInit {

  changeTabsSubject:Subject<any> = new Subject();

  submited: boolean = false;
  appendForm!: FormGroup;
  submit: boolean = false;
  joinForm!: FormGroup;
  uploadedFiles: any[] = [];
  sortedList: any[] = [];
  sortedCheckedList: any[] = [];
  mergeCheckedList: any[] = [];
  appendUnchechedList: any[] = [];

  enableDataSetPopUp: boolean = false;
  datasetDetailsList: any[] = [];
  createExpressionList: any[] = [];
  filesList: any[] = [];
  columnsArr: any[] = [];
  showUploadFilesTab: boolean = false;
  masterSelected: boolean = false;
  tabs = [
    { id: 0, value: 'Upload Files', isActive: true },
    { id: 1, value: 'Filtered FIles', isActive: false },
    { id: 2, value: 'Append', isActive: false },
    { id: 3, value: 'Join', isActive: false },
    { id: 4, value: 'Target Files', isActive: false },
    { id: 5, value: 'Data Modelling', isActive: false },
  ];
  enableAppendNamePopup: boolean = false;
  enableMergeNamePopup: boolean = false;
  enableUploadPhytonPopup: boolean = false;

  submitted: boolean = false;
  submittedErrorMsg: string = '';
  targetFileRowEdit: number = -1;

  hideCreateIdenticalBtnWithLength: boolean = true;
  hideCreateIdenticalBtn: boolean = true;
  selectedM_A_S: any[] = []; //tab4
  showTargetFilePopup: boolean = false; //ta4

  cursorPosition: number = 0;
  appendNameControl: FormControl = new FormControl(null);
  invoiceForm1: FormGroup | any;
  opearatorList = [
    { id: 0, value: 'AND' },
    { id: 1, value: 'OR' },
  ];

  signOperatorList: any = [];
  //accordion
  isOpenAccordion: boolean = false;
  // @ViewChildren('input') public inputs!: QueryList<ElementRef> | any;
  //@ViewChild('textArea') _textArea: ElementRef;
  messages = [
    {
      Fueling_Position: 'Conditional Functions',
      Components: [
        { Component: 'IF c THEN t ELSE f ENDIF' },
        { Component: 'IF c THEN t ELSEIF c2 THEN t2 ELSE f ENDIF' },
        { Component: 'IIF(bool, x, y)' },
        { Component: 'NOT(<logical>)' },
        { Component: 'AND(<logical1>,<logical2>)' },
        { Component: 'OR(<logical1>,<logical2>)' },
        { Component: 'IFERROR(value, value_if_error)' },
        { Component: 'Switch(Value,Default,Case1,Result1,...,CaseN,ResultN)' },
      ],
    },
    {
      Fueling_Position: 'Conversion',
      Components: [
        { Component: 'BinToInt(s)' },
        { Component: 'CharFromInt(x)' },
        { Component: 'CharToInt(s)' },
        { Component: 'ConvertFromCodePage(s, codePage)' },
        { Component: 'ConvertToCodePage(s, codePage)' },
        { Component: 'HexToNumber(x)' },
        { Component: 'IntToBin(x)' },
        { Component: 'IntToHex(x)' },
        {
          Component:
            'ToNumber(x, [bIgnoreErrors], [keepNulls], [decimalSeparator])',
        },
        {
          Component:
            'ToString(x, numDec, [addThousandsSeparator], [decimalSeparator])',
        },
      ],
    },
    {
      Fueling_Position: 'DateTime',
      Components: [
        { Component: 'DateTimeAdd' },
        { Component: 'DateTimeDay' },
        { Component: 'DateTimeDiff' },
        { Component: 'DateTimeFirstOfMonth' },
        { Component: 'DateTimeFormat' },
        { Component: 'DateTimeHour' },
        { Component: 'DateTimeLastOfMonth' },
        { Component: 'DateTimeMinutes' },
        { Component: 'DateTimeMonth' },
        { Component: 'DateTimeNow' },
        { Component: 'DateTimeParse' },
        { Component: 'DateTimeSeconds' },
        { Component: 'DateTimeStart' },
        { Component: 'DateTimeToday' },
        { Component: 'DateTimeToLocal' },
        { Component: 'DateTimeToUTC' },
        { Component: 'DateTimeTrim' },
        { Component: 'DateTimeYear' },
        { Component: 'ToDate' },
        { Component: 'ToDateTime' },
      ],
    },
    {
      Fueling_Position: 'File',
      Components: [
        { Component: 'FileAddPaths' },
        { Component: 'FileExists' },
        { Component: 'FileGetDir' },
        { Component: 'FileGetExt' },
        { Component: 'FileGetFileName' },
      ],
    },
    {
      Fueling_Position: 'Finance',
      Components: [
        { Component: 'FinanceCAGR' },
        { Component: 'FinanceEffectiveRate' },
        { Component: 'FinanceFV' },
        { Component: 'FinanceFVSchedule' },
        { Component: 'FinanceIRR' },
        { Component: 'FinanceMIRR' },
        { Component: 'FinanceMXIRR' },
        { Component: 'FinanceNominalRate' },
        { Component: 'FinanceNPER' },
        { Component: 'FinanceNPV' },
        { Component: 'FinancePMT' },
        { Component: 'FinancePV' },
        { Component: 'FinanceRate' },
        { Component: 'FinanceXIRR' },
        { Component: 'FinanceXNPV' },
      ],
    },
    {
      Fueling_Position: 'Math',
      Components: [
        { Component: 'ABS' },
        { Component: 'ACOS' },
        { Component: 'ASIN' },
        { Component: 'ATAN' },
        { Component: 'ATAN2' },
        { Component: 'Average' },
        { Component: 'CEIL' },
        { Component: 'COS' },
        { Component: 'COSH' },
        { Component: 'EXP' },
        { Component: 'FLOOR' },
        { Component: 'LOG' },
        { Component: 'LOG10' },
        { Component: 'Median' },
        { Component: 'Mod' },
        { Component: 'PI' },
        { Component: 'POW' },
        { Component: 'RAND' },
        { Component: 'RandInt' },
        { Component: 'Round' },
        { Component: 'SIN' },
        { Component: 'SINH' },
        { Component: 'SmartRound' },
        { Component: 'SQRT' },
        { Component: 'TAN' },
        { Component: 'TANH' },
      ],
    },
    {
      Fueling_Position: 'Math: Bitwise',
      Components: [
        { Component: 'BinaryAnd' },
        { Component: 'BinaryNot' },
        { Component: 'BinaryOr' },
        { Component: 'BinaryXOR' },
        { Component: 'ShiftLeft' },
        { Component: 'ShiftRight' },
      ],
    },
    {
      Fueling_Position: 'Min/Max',
      Components: [
        { Component: 'Bound' },
        { Component: 'Max' },
        { Component: 'MaxIDX' },
        { Component: 'Min' },
        { Component: 'MinIDX' },
      ],
    },
    {
      Fueling_Position: 'Operators',
      Components: [
        { Component: 'Block Comment(/* */)' },
        { Component: 'Single Line Comment(//)' },
        { Component: 'Addition' },
        { Component: 'Boolean AND &&' },
        { Component: 'Boolean AND - Keyword' },
        { Component: 'Boolean NOT !' },
        { Component: 'Boolean OR - Keyword' },
        { Component: 'Boolean OR ||' },
        { Component: 'Close Parenthesis)' },
        { Component: 'Division' },
        { Component: 'Equal To' },
        { Component: '>: Greater Than' },
        { Component: '>=: Greater Than Or Equal To' },
        { Component: '<: Less Than' },
        { Component: '<=: Less Than Or Equal' },
        { Component: 'Multiplication' },
        { Component: 'Not Equal To' },
        { Component: 'Open Parenthesis' },
        { Component: 'Subtraction' },
        { Component: 'Value IN (...) - Keyword' },
        { Component: 'Value NOT IN (...) - Keyword' },
      ],
    },
    {
      Fueling_Position: 'Spatial',
      Components: [
        { Component: 'ST_Area' },
        { Component: 'ST_Boundary' },
        { Component: 'ST_BoundingRectangle' },
        { Component: 'ST_Centroid' },
        { Component: 'ST_CentroidX' },
        { Component: 'ST_CentroidY' },
        { Component: 'ST_Combine' },
        { Component: 'ST_Contains' },
        { Component: 'ST_ConvexHull' },
        { Component: 'ST_CreateLine' },
        { Component: 'ST_CreatePoint' },
        { Component: 'ST_CreatePolygon' },
        { Component: 'ST_Cut' },
        { Component: 'ST_Dimension' },
        { Component: 'ST_Distance' },
        { Component: 'ST_EndPoint' },
        { Component: 'ST_Intersection' },
        { Component: 'ST_Intersects' },
        { Component: 'ST_InverseIntersection' },
        { Component: 'ST_Length' },
        { Component: 'ST_MD5' },
        { Component: 'ST_MaxX' },
        { Component: 'ST_MaxY' },
        { Component: 'ST_MinX' },
        { Component: 'ST_MinY' },
        { Component: 'ST_NumParts' },
        { Component: 'ST_NumPoints' },
        { Component: 'ST_ObjectType' },
        { Component: 'ST_PointN' },
        { Component: 'ST_RandomPoint' },
        { Component: 'ST_Relate' },
        { Component: 'ST_StartPoint' },
        { Component: 'ST_Touches' },
        { Component: 'ST_TouchesOrIntersects' },
        { Component: 'ST_Within' },
      ],
    },
    {
      Fueling_Position: 'Specialized',
      Components: [
        { Component: 'EscapeXMLMetacharacters' },
        { Component: 'GetVal' },
        { Component: 'GetEnvironmentVariable' },
        { Component: 'NULL' },
        { Component: 'RangeMedian' },
        { Component: 'ReadRegistryString' },
        { Component: 'Soundex_Digits' },
        { Component: 'TOPNIDX' },
        { Component: 'UrlEncode' },
        { Component: 'Message' },
        { Component: 'Soundex' },
      ],
    },
    {
      Fueling_Position: 'String',
      Components: [
        { Component: 'Contains' },
        { Component: 'CountWords' },
        { Component: 'DecomposeUnicodeForMatch' },
        { Component: 'EndsWith' },
        { Component: 'FindString' },
        { Component: 'GetWord' },
        { Component: 'Left' },
        { Component: 'Length' },
        { Component: 'LowerCase' },
        { Component: 'MD5_ASCII' },
        { Component: 'MD5_UNICODE' },
        { Component: 'MD5_UTF8' },
        { Component: 'PadLeft' },
        { Component: 'PadRight' },
        { Component: 'REGEX_CountMatches' },
        { Component: 'REGEX_Match' },
        { Component: 'REGEX_Replace' },
        { Component: 'Replace' },
        { Component: 'ReplaceChar' },
        { Component: 'ReplaceFirst' },
        { Component: 'ReverseString' },
        { Component: 'Right' },
        { Component: 'StartsWith' },
        { Component: 'STRCSPN' },
        { Component: 'StripQuotes' },
        { Component: 'STRSPN' },
        { Component: 'Substring' },
        { Component: 'TitleCase' },
        { Component: 'Trim' },
        { Component: 'TrimLeft' },
        { Component: 'TrimRight' },
        { Component: 'UpperCase' },
        { Component: 'UuidCreate' },
      ],
    },
    {
      Fueling_Position: 'Test',
      Components: [
        { Component: 'CompareDictionary' },
        { Component: 'CompareDigits' },
        { Component: 'CompareEpsilon' },
        { Component: 'IsEmpty' },
        { Component: 'IsInteger' },
        { Component: 'IsNull' },
        { Component: 'IsNumber' },
        { Component: 'IsSpatialObj' },
        { Component: 'IsString' },
      ],
    },
  ];

  displayedRows$: Observable<any> | any;
  private tableData = new MatTableDataSource(this.messages);
  //accordian-datamodeling-sortedCL,mergedcL
  appendListInMCL: any[] = [];
  appendListInSCL: any[] = [];
  sheetsListInSCL: any[] = [];
  allExpandState: boolean = false;
  panelOpenState: boolean = false;

  dataType = ['Int', 'Float', 'Char', 'Varchar', 'Date time', 'Money', 'Text'];
  //dataTypee = [{ id: 0, value: 'Int' }, { id: 1, value: 'Float' }, { id: 2, value: 'Char' }, { id: 3, value: 'Varchar' }, { id: 4, value: 'DateTime' }, { id: 5, value: 'Money' }, { id: 6, value: 'Text' }]
  dataTypee = [
    { id: 0, value: 'Int' },
    { id: 1, value: 'Float' },
    { id: 2, value: 'Char' },
    { id: 3, value: 'Varchar' },
    { id: 4, value: 'Text' },
    { id: 5, value: 'Money' },
    { id: 6, value: 'DateTime' },
  ];

  dateTimeFormats = [
    { id: 0, value: 'M/dd/yyyy' },
    { id: 1, value: 'M-dd-yyyy' },
    { id: 2, value: 'MM/dd/yyyy' },
    { id: 3, value: 'MM-dd-yyyy' },
    { id: 4, value: 'dd/MM/yyyy' },
    { id: 5, value: 'dd-MM-yyyy' },
    { id: 6, value: 'yyyy/MM/dd' },
    { id: 7, value: 'yyyy-MM-dd' },
    { id: 8, value: 'yyyy/dd/MM' },
    { id: 9, value: 'yyyy-dd-MM' },
    { id: 10, value: 'dd-M-yyyy' },
    { id: 11, value: 'dd/M/yyyy' },
  ];
  joinType = [
    'Inner Join',
    'Left Join',
    'Outer Join',
    'Full Join',
    'Cross Join',
  ];
  unCheckedListAddToMergeList: any[] = []; // try to x
  targetFilesCheckedList: any[] = []; //need to x
  viewscriptForm!: FormGroup;
  sqlScriptForm!: FormGroup;
  selected_filename: any;
  process: any;
  allDatasetDetailsList: any[] = [];
  enableUploadSQLPopup: boolean = false;
  messagesSearch = [
    {
      Fueling_Position: 'Conditional Functions',
      Components: [
        { Component: 'IF c THEN t ELSE f ENDIF' },
        { Component: 'IF c THEN t ELSEIF c2 THEN t2 ELSE f ENDIF' },
        { Component: 'IIF(bool, x, y)' },
        { Component: 'NOT(<logical>)' },
        { Component: 'AND(<logical1>,<logical2>)' },
        { Component: 'OR(<logical1>,<logical2>)' },
        { Component: 'IFERROR(value, value_if_error)' },
        { Component: 'Switch(Value,Default,Case1,Result1,...,CaseN,ResultN)' },
      ],
    },
    {
      Fueling_Position: 'Conversion',
      Components: [
        { Component: 'BinToInt(s)' },
        { Component: 'CharFromInt(x)' },
        { Component: 'CharToInt(s)' },
        { Component: 'ConvertFromCodePage(s, codePage)' },
        { Component: 'ConvertToCodePage(s, codePage)' },
        { Component: 'HexToNumber(x)' },
        { Component: 'IntToBin(x)' },
        { Component: 'IntToHex(x)' },
        {
          Component:
            'ToNumber(x, [bIgnoreErrors], [keepNulls], [decimalSeparator])',
        },
        {
          Component:
            'ToString(x, numDec, [addThousandsSeparator], [decimalSeparator])',
        },
      ],
    },
    {
      Fueling_Position: 'DateTime',
      Components: [
        { Component: 'DateTimeAdd' },
        { Component: 'DateTimeDay' },
        { Component: 'DateTimeDiff' },
        { Component: 'DateTimeFirstOfMonth' },
        { Component: 'DateTimeFormat' },
        { Component: 'DateTimeHour' },
        { Component: 'DateTimeLastOfMonth' },
        { Component: 'DateTimeMinutes' },
        { Component: 'DateTimeMonth' },
        { Component: 'DateTimeNow' },
        { Component: 'DateTimeParse' },
        { Component: 'DateTimeSeconds' },
        { Component: 'DateTimeStart' },
        { Component: 'DateTimeToday' },
        { Component: 'DateTimeToLocal' },
        { Component: 'DateTimeToUTC' },
        { Component: 'DateTimeTrim' },
        { Component: 'DateTimeYear' },
        { Component: 'ToDate' },
        { Component: 'ToDateTime' },
      ],
    },
    {
      Fueling_Position: 'File',
      Components: [
        { Component: 'FileAddPaths' },
        { Component: 'FileExists' },
        { Component: 'FileGetDir' },
        { Component: 'FileGetExt' },
        { Component: 'FileGetFileName' },
      ],
    },
    {
      Fueling_Position: 'Finance',
      Components: [
        { Component: 'FinanceCAGR' },
        { Component: 'FinanceEffectiveRate' },
        { Component: 'FinanceFV' },
        { Component: 'FinanceFVSchedule' },
        { Component: 'FinanceIRR' },
        { Component: 'FinanceMIRR' },
        { Component: 'FinanceMXIRR' },
        { Component: 'FinanceNominalRate' },
        { Component: 'FinanceNPER' },
        { Component: 'FinanceNPV' },
        { Component: 'FinancePMT' },
        { Component: 'FinancePV' },
        { Component: 'FinanceRate' },
        { Component: 'FinanceXIRR' },
        { Component: 'FinanceXNPV' },
      ],
    },
    {
      Fueling_Position: 'Math',
      Components: [
        { Component: 'ABS' },
        { Component: 'ACOS' },
        { Component: 'ASIN' },
        { Component: 'ATAN' },
        { Component: 'ATAN2' },
        { Component: 'Average' },
        { Component: 'CEIL' },
        { Component: 'COS' },
        { Component: 'COSH' },
        { Component: 'EXP' },
        { Component: 'FLOOR' },
        { Component: 'LOG' },
        { Component: 'LOG10' },
        { Component: 'Median' },
        { Component: 'Mod' },
        { Component: 'PI' },
        { Component: 'POW' },
        { Component: 'RAND' },
        { Component: 'RandInt' },
        { Component: 'Round' },
        { Component: 'SIN' },
        { Component: 'SINH' },
        { Component: 'SmartRound' },
        { Component: 'SQRT' },
        { Component: 'TAN' },
        { Component: 'TANH' },
      ],
    },
    {
      Fueling_Position: 'Math: Bitwise',
      Components: [
        { Component: 'BinaryAnd' },
        { Component: 'BinaryNot' },
        { Component: 'BinaryOr' },
        { Component: 'BinaryXOR' },
        { Component: 'ShiftLeft' },
        { Component: 'ShiftRight' },
      ],
    },
    {
      Fueling_Position: 'Min/Max',
      Components: [
        { Component: 'Bound' },
        { Component: 'Max' },
        { Component: 'MaxIDX' },
        { Component: 'Min' },
        { Component: 'MinIDX' },
      ],
    },
    {
      Fueling_Position: 'Operators',
      Components: [
        { Component: 'Block Comment(/* */)' },
        { Component: 'Single Line Comment(//)' },
        { Component: 'Addition' },
        { Component: 'Boolean AND &&' },
        { Component: 'Boolean AND - Keyword' },
        { Component: 'Boolean NOT !' },
        { Component: 'Boolean OR - Keyword' },
        { Component: 'Boolean OR ||' },
        { Component: 'Close Parenthesis)' },
        { Component: 'Division' },
        { Component: 'Equal To' },
        { Component: '>: Greater Than' },
        { Component: '>=: Greater Than Or Equal To' },
        { Component: '<: Less Than' },
        { Component: '<=: Less Than Or Equal' },
        { Component: 'Multiplication' },
        { Component: 'Not Equal To' },
        { Component: 'Open Parenthesis' },
        { Component: 'Subtraction' },
        { Component: 'Value IN (...) - Keyword' },
        { Component: 'Value NOT IN (...) - Keyword' },
      ],
    },
    {
      Fueling_Position: 'Spatial',
      Components: [
        { Component: 'ST_Area' },
        { Component: 'ST_Boundary' },
        { Component: 'ST_BoundingRectangle' },
        { Component: 'ST_Centroid' },
        { Component: 'ST_CentroidX' },
        { Component: 'ST_CentroidY' },
        { Component: 'ST_Combine' },
        { Component: 'ST_Contains' },
        { Component: 'ST_ConvexHull' },
        { Component: 'ST_CreateLine' },
        { Component: 'ST_CreatePoint' },
        { Component: 'ST_CreatePolygon' },
        { Component: 'ST_Cut' },
        { Component: 'ST_Dimension' },
        { Component: 'ST_Distance' },
        { Component: 'ST_EndPoint' },
        { Component: 'ST_Intersection' },
        { Component: 'ST_Intersects' },
        { Component: 'ST_InverseIntersection' },
        { Component: 'ST_Length' },
        { Component: 'ST_MD5' },
        { Component: 'ST_MaxX' },
        { Component: 'ST_MaxY' },
        { Component: 'ST_MinX' },
        { Component: 'ST_MinY' },
        { Component: 'ST_NumParts' },
        { Component: 'ST_NumPoints' },
        { Component: 'ST_ObjectType' },
        { Component: 'ST_PointN' },
        { Component: 'ST_RandomPoint' },
        { Component: 'ST_Relate' },
        { Component: 'ST_StartPoint' },
        { Component: 'ST_Touches' },
        { Component: 'ST_TouchesOrIntersects' },
        { Component: 'ST_Within' },
      ],
    },
    {
      Fueling_Position: 'Specialized',
      Components: [
        { Component: 'EscapeXMLMetacharacters' },
        { Component: 'GetVal' },
        { Component: 'GetEnvironmentVariable' },
        { Component: 'NULL' },
        { Component: 'RangeMedian' },
        { Component: 'ReadRegistryString' },
        { Component: 'Soundex_Digits' },
        { Component: 'TOPNIDX' },
        { Component: 'UrlEncode' },
        { Component: 'Message' },
        { Component: 'Soundex' },
      ],
    },
    {
      Fueling_Position: 'String',
      Components: [
        { Component: 'Contains' },
        { Component: 'CountWords' },
        { Component: 'DecomposeUnicodeForMatch' },
        { Component: 'EndsWith' },
        { Component: 'FindString' },
        { Component: 'GetWord' },
        { Component: 'Left' },
        { Component: 'Length' },
        { Component: 'LowerCase' },
        { Component: 'MD5_ASCII' },
        { Component: 'MD5_UNICODE' },
        { Component: 'MD5_UTF8' },
        { Component: 'PadLeft' },
        { Component: 'PadRight' },
        { Component: 'REGEX_CountMatches' },
        { Component: 'REGEX_Match' },
        { Component: 'REGEX_Replace' },
        { Component: 'Replace' },
        { Component: 'ReplaceChar' },
        { Component: 'ReplaceFirst' },
        { Component: 'ReverseString' },
        { Component: 'Right' },
        { Component: 'StartsWith' },
        { Component: 'STRCSPN' },
        { Component: 'StripQuotes' },
        { Component: 'STRSPN' },
        { Component: 'Substring' },
        { Component: 'TitleCase' },
        { Component: 'Trim' },
        { Component: 'TrimLeft' },
        { Component: 'TrimRight' },
        { Component: 'UpperCase' },
        { Component: 'UuidCreate' },
      ],
    },
    {
      Fueling_Position: 'Test',
      Components: [
        { Component: 'CompareDictionary' },
        { Component: 'CompareDigits' },
        { Component: 'CompareEpsilon' },
        { Component: 'IsEmpty' },
        { Component: 'IsInteger' },
        { Component: 'IsNull' },
        { Component: 'IsNumber' },
        { Component: 'IsSpatialObj' },
        { Component: 'IsString' },
      ],
    },
  ];
  joinSetForm!: FormGroup;
  placetable: any = 'Select Primary Table';
  fx: any[] = [];

  appendFiles:Array<any> = [];
  mergeList:Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastComponent,
    private loader: LoaderService,
    public fb: FormBuilder,
    private renderer: Renderer2,
    private solService: SolutionService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.joinSetForm = this.formBuilder.group({
      Merg: this.formBuilder.array([]),
    });
    // this.process = JSON.parse(localStorage.getItem("process") || '{}') //just commented
    this.process = { processId: '3900A4B8-4A36-4619-B8E1-2EED5A4C03E4' };
    this.appendForm = this.formBuilder.group({
      appendNameControl: ['', Validators.required],
    });
    this.joinForm = this.formBuilder.group({
      appendNameControl: ['', Validators.required],
    });
    this.displayedRows$ = of(this.messages);
    this.createExpressionList = [];
    this.invoiceForm1 = this.fb.group({
      //Rows: this.fb.array([]),
      DRows1: this.fb.array([]),
    });

    this.viewscriptForm = this.fb.group({
      sqlScript: [''],
      datasetId: [''],
    });

    this.sqlScriptForm = this.fb.group({
      datasetName: [''],
      sqlScript: [''],
    });
    // this.MergeArr().push(this.Merg())
    // this.TableArr(0).push(this.addTable())
    // this.columnArr(0,0).push(this.addColumn())
    console.log(this.joinSetForm);
  }

  tabValueFromUploadFiles(e:any){
    console.log('e: ', e);
    this.tabs = e;
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

  getMergeList(){
    this.solService.getMergeList(this.process.processId).subscribe((res:any)=>{
      console.log('getMergeList: ', res.responseData.templatesMergeDetailsList[0])
      let resp = res.responseData.templatesMergeDetailsList;
      this.mergeList = res.responseData.templatesMergeDetailsList;
      console.log('joinForm: ', this.joinForm)
      console.log('joinSetForm: ', this.joinSetForm)

      resp.forEach((ele:any, ind: number) => {
        ele.templatesMergeList.forEach((element:any, j:number) => {

          element.columnArrayList.forEach((colElement:any) => {

          });

        });

      });
      console.log('joinForm: ', this.joinForm)
      console.log('joinSetForm: ', this.joinSetForm)
    })
  }

  MergeSubmit() {
    this.loader.show();
    console.log(this.joinSetForm.value, this.process.processId);
    let data: any = {};
    data.processId = this.process.processId;
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
        const responsee: any[] = res.responseData.templatesMergeDetailsList;
        responsee.forEach((merge: any) => {
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

          responsee.forEach((fileObj: any) => {
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

  ngAfterViewInit(): void {
    //this.rowClickedDataModeling('', this.x, 0, 0)
  }

  isValidName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | any> => {
      let bReturn: boolean = true;
      if (this.appendForm.get('appendNameControl')?.value == '') {
        bReturn = false;
      }
      let err: ValidationErrors = { invalid: true };
      return bReturn ? of(null) : of(err);
    };
  }

  changePrimaryTable(e: any, index: number, obj: any) {
    let value = e.target.value;
    const filteredJoin = obj.mergeList.filter(
      (x: any) => x.showAppendName == value
    );
    let templateId: string = '';

    templateId = filteredJoin[0].tableList[0].templateId;
    const orderNumber = obj.pkFkMergeTypeList[index].order;
    let tML = obj.templatesMergeList[orderNumber - 1];

    if (index == 0) {
      let filteredMergeList = obj.mergeList.filter(
        (x: any) => x.showAppendName == value
      );
      let listVales = filteredMergeList[0].columnList.map(
        (x: any) => x.columnName
      );
      obj.pkFkMergeTypeList[0].selectedPrimaryTable = value;
      obj.pkFkMergeTypeList[0].primaryTemplateId = templateId;
      obj.pkFkMergeTypeList[1].primaryKeyList = listVales;

      let mergeSheetNames = JSON.parse(JSON.stringify(obj.showMergeSheetNames));
      mergeSheetNames.forEach((item: any, index: number) => {
        if (item == value) {
          mergeSheetNames.splice(index, 1);
        }
      });
      obj.pkFkMergeTypeList[3].foreignTableList = mergeSheetNames;
      tML.primaryTemplateId = templateId;
      if (!value.includes('-')) {
        tML.primaryTableName = value;
      }
    }
    if (index == 3) {
      obj.pkFkMergeTypeList[index].selectedForeignTable = value;
      const filteredList = obj.mergeList.filter(
        (x: any) => x.showAppendName == value
      );
      const listValues = filteredList[0].columnList.map(
        (x: any) => x.columnName
      );
      obj.pkFkMergeTypeList[4].foreignKeyList = listValues;
      obj.pkFkMergeTypeList[index].secondaryTemplateId = templateId;

      tML.secondaryTemplateId = templateId;
      if (!value.includes('-')) {
        tML.secondaryTableName = value;
      }
    }
    if (index == 4) {
      console.log('unnecessary');
      obj.pkFkMergeTypeList[4].selectedForeignKey = value;
    }
    if (index > 5) {
      obj.pkFkMergeTypeList[index].selectedForeignTable = value;
      const filteredList = obj.mergeList.filter(
        (x: any) => x.showAppendName == value
      );
      const listValues = filteredList[0].columnList.map(
        (x: any) => x.columnName
      );
      obj.pkFkMergeTypeList[index + 1].foreignKeyList = listValues;

      obj.pkFkMergeTypeList[index].secondaryTemplateId = templateId;

      tML.secondaryTemplateId = templateId;
    }
  }

  changeSecondaryTable(e: any, index: number, obj: any) {
    const value = e.target.value;
    obj.pkFkMergeTypeList[index].selectedSecondaryTable = value;
    const filteredTableList = obj.mergeList.filter(
      (x: any) => x.showAppendName == value
    );
    const columnNames = filteredTableList[0].columnList.map(
      (x: any) => x.columnName
    );
    obj.pkFkMergeTypeList[index + 1].secondaryKeyList = columnNames;

    const filteredJoin = obj.mergeList.filter(
      (x: any) => x.showAppendName == value
    );
    let templateId: string = '';
    templateId = filteredJoin[0].tableList[0].templateId;
    obj.pkFkMergeTypeList[index].primaryTemplateId = templateId;

    const orderNumber = obj.pkFkMergeTypeList[index].order;
    let tML = obj.templatesMergeList[orderNumber - 1];
    tML.primaryTemplateId = templateId;
    if (!value.includes('-')) {
      tML.primaryTableName = value;
    }
  }

  changeSecondaryKey(e: any, index: number, obj: any) {
    obj.pkFkMergeTypeList[index].selectedSecondaryKey = e.target.value;

    let selectedSK = obj.pkFkMergeTypeList[index - 1].selectedSecondaryTable;
    const filteredJoin = obj.mergeList.filter(
      (x: any) => x.showAppendName == selectedSK
    );
    let templateId: any;
    templateId = filteredJoin[0].columnList.filter(
      (x: any) => x.columnName == e.target.value
    );
    obj.pkFkMergeTypeList[index].primaryKeyId = templateId[0].columnId;

    const orderNumber = obj.pkFkMergeTypeList[index].order;
    let tML = obj.templatesMergeList[orderNumber - 1];
    tML.primaryKeyId = templateId[0].columnId;
  }

  changePrimaryKey(e: any, index: number, obj: any) {
    obj.pkFkMergeTypeList[index].selectedPrimaryKey = e.target.value;
    let selectedPK = obj.pkFkMergeTypeList[index - 1].selectedPrimaryTable;

    const filteredJoin = obj.mergeList.filter(
      (x: any) => x.showAppendName == selectedPK
    );
    let templateId: any;
    templateId = filteredJoin[0].columnList.filter(
      (x: any) => x.columnName == e.target.value
    );
    obj.pkFkMergeTypeList[index].primaryKeyId = templateId[0].columnId;

    const orderNumber = obj.pkFkMergeTypeList[index].order;
    let tML = obj.templatesMergeList[orderNumber - 1];
    tML.primaryKeyId = templateId[0].columnId;
  }

  changeForeignKey(e: any, index: number, obj: any) {
    obj.pkFkMergeTypeList[index].selectedForeignKey = e.target.value;

    let selectedFK = obj.pkFkMergeTypeList[index - 1].selectedForeignTable;
    const filteredJoin = obj.mergeList.filter(
      (x: any) => x.showAppendName == selectedFK
    );
    let templateId: any;
    templateId = filteredJoin[0].columnList.filter(
      (x: any) => x.columnName == e.target.value
    );
    obj.pkFkMergeTypeList[index].secondaryKeyId = templateId[0].columnId;

    const orderNumber = obj.pkFkMergeTypeList[index].order;
    let tML = obj.templatesMergeList[orderNumber - 1];
    tML.secondaryKeyId = templateId[0].columnId;
  }

  changeMergeType(e: any, index: number, obj: any) {
    const value = e.target.value;
    obj.pkFkMergeTypeList[index].selectedMergeType = value;

    const orderNumber = obj.pkFkMergeTypeList[index].order;
    let tML = obj.templatesMergeList[orderNumber - 1];
    tML.joinType = value.slice(0, 1);
  }

  getAllFunctions() {
    //fx formula

    this.solService.getAllFunctions().subscribe(
      (res: any) => {
        this.fx = res.responseData;
        console.log(res);
        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  addOpearatorValueFields(i: number, item: any) {
    item.whereList.push({
      signOperatorList: item.signOperatorList,
      opearatorList: this.opearatorList,
      value: '',
    });
  }

  delOpearatorValueFields(j: number, whereObj: any, i: number, item: any) {
    this.createExpressionList[i].whereList.splice(j, 1);
  }

  changeSignOperator(
    e: any,
    j: any,
    whereObj: any,
    i: number,
    item: any,
    listType: string
  ) {
    const value = e.value;
    if (listType == 'parent') {
      this.createExpressionList[i].signOperator = value;
    } else {
      whereObj.signOperator = value;
    }
  }

  changeOperator(e: any, j: any, whereObj: any, i: number, item: any) {
    const value = e.value;
    whereObj.operator = value;
  }

  textAreaSlice(value: any) {
    const textareaVal = this.textAreaIndexinCE.value;
    const cursorPosition = this.textAreaIndexinCE.cursorPosition;
    const newValue = [
      textareaVal.slice(0, cursorPosition),
      value,
      textareaVal.slice(cursorPosition),
    ].join('');
    this.createExpressionList[this.textAreaIndexinCE.index].expression =
      newValue;
  }

  createNewDataSet() {
    this.createExpressionList = [
      {
        sourceFieldName: '',
        columnFormat: '',
        signOperatorList: '',
        expression: '',
        isEdit: false,
        selectedDataType: '',
        where: '',
        or: '',
        groupBy: '',
        orderBy: '',
        value: '',
        signOperator: '',
        whereList: [],
      },
    ];
    if (
      this.datasetDetailsList.filter(
        (x: any) => x.datasetName == this.appendNameControl?.value.trim()
      ).length != 0
    ) {
    } else {
      this.enableDataSetPopUp = false;
      //const datasetFieldDTOList = [{ columnName: '', expression: '', selectedDataType: '', isEdit:false }]
      const ds = {
        isDatasetTableExpand: true,
        having: null,
        groupBytoDB: '',
        orderBytoDB: '',
        datasetName: this.appendNameControl?.value.trim(),
        datasetFieldDTOList: [],
        orderBy: [],
        groupBy: [],
      };
      this.datasetDetailsList.push(ds);
    }
  }

  saveDataSetDropdowns() {
    this.saveDataSetApi();
  }

  //datasetDetailsListShowList: any[] = [];
  selectedColumnsOfDS: any[] = []; //can b remvd
  saveDataSetPopup: boolean = false;
  dropDownsInDS: any[] = [];
  saveDataSet(obj: any, i: number) {
    this.selectedColumnsOfDS = [];
    obj?.datasetFieldDTOList.forEach((ds: any) => {
      const cNameInDS = ds.sourceFieldName.trim();
      if (cNameInDS.includes('[')) {
        const splitCName = cNameInDS.split(/[[]+/);
        const fileNameinDS = splitCName[0];
        const sheetNameinDS = splitCName[1].slice(0, -1);

        this.AJFDlist?.forEach((ajfd: any) => {
          if (fileNameinDS == ajfd.fileName) {
            if (
              this.selectedColumnsOfDS.filter(
                (x: any) => x.fileName == fileNameinDS
              ).length == 0
            ) {
              this.selectedColumnsOfDS.push(ajfd);
            }
          }
        });
      }
    });

    if (this.selectedColumnsOfDS.length < 2) {
      if (this.selectedColumnsOfDS[0].fileType == 'source file') {
        obj.dataSetMergeListDTOs = [
          {
            primaryTemplateId:
              this.selectedColumnsOfDS[0].tableList[0].templateId,
          },
        ];
      } else {
      }
      //primaryTableName:'',
      this.saveDataSetApi();
      //obj.isDatasetTableExpand = false;
      //this.datasetDetailsListShowList = this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand == false)
    } else {
      if (obj.pkFKs == undefined) {
        const pkFKs: any[] = [
          {
            type: null,
            primaryTableList: this.selectedColumnsOfDS,
            selectedPrimaryTable: '',
            optionValue: 'select Primary Table',
            order: 1,
          },
          {
            type: null,
            primaryKeyList: [],
            selectedPrimaryKey: '',
            optionValue: 'select Primary Key',
            order: 1,
          },
          {
            type: null,
            mergeType: '',
            optionValue: 'select Join Type',
            selectedMergeType: '',
            order: 1,
          },
          {
            type: null,
            foreignTableList: [],
            selectedForeignTable: '',
            optionValue: 'select Foreign Table',
            order: 1,
          },
          {
            type: null,
            foreignKeyList: [],
            selectedForeignKey: '',
            optionValue: 'select Foreign Key',
            order: 1,
          },
        ];

        const dataSetMergeListDTOs: any[] = [{ order: 1 }];

        for (let i = 2; i < this.selectedColumnsOfDS.length; i++) {
          pkFKs.push(
            {
              type: null,
              secondaryTableList: [],
              selectedSecondaryTable: '',
              optionValue: 'select Secondary Table',
              order: i,
            },
            {
              type: null,
              secondaryKeyList: [],
              selectedSecondaryKey: '',
              optionValue: 'select Secondary Key',
              order: i,
            },
            {
              type: null,
              mergeType: '',
              optionValue: 'select Join Type',
              selectedMergeType: '',
              order: i,
            },
            {
              type: null,
              foreignTableList: [],
              selectedForeignTable: '',
              optionValue: 'select Foreign Table',
              order: i,
            },
            {
              type: null,
              foreignKeyList: [],
              selectedForeignKey: '',
              optionValue: 'select Foreign Key',
              order: i,
            }
          );

          dataSetMergeListDTOs.push({ order: i });
        }

        obj.pkFKs = pkFKs;

        obj.dataSetMergeListDTOs = dataSetMergeListDTOs;
      }
      this.dropDownsInDS = [obj];

      this.saveDataSetPopup = true;
    }
  }

  changePrimaryTableInDS(
    e: any,
    index: number,
    columnObj: any,
    indexPKFK: number,
    fileObj: any
  ) {
    const value = e.target.value;
    let templateId: any;
    //let pTList = (columnObj.primaryTableList == undefined) ? [] : JSON.parse(JSON.stringify(columnObj.primaryTableList));
    let pTList = JSON.parse(JSON.stringify(fileObj.pkFKs[0].primaryTableList));
    let sTList =
      columnObj.secondaryTableList == undefined
        ? []
        : JSON.parse(JSON.stringify(columnObj.secondaryTableList));
    let fileType: any;

    //if ((columnObj?.primaryTableList[0]?.fileType == undefined) ? false : columnObj?.primaryTableList[0]?.fileType == 'source file') {
    if (value.includes('-')) {
      let fName = value.split('-')[0];
      let sName = value.split('-')[1];
      this.uploadedFiles.filter((fileObj: any) => {
        if (fileObj.fileName == fName) {
          fileObj?.totalSheetList.forEach((sheetObj: any) => {
            if (sheetObj.sheetName == sName) templateId = sheetObj.templateId;
          });
        }
      });
    } else {
      if (indexPKFK == 0)
        fileType = columnObj.primaryTableList
          .filter((x: any) => x.fileName == value)
          .map((y: any) => y.fileType);
      else
        fileType = columnObj.secondaryTableList
          .filter((x: any) => x.fileName == value)
          .map((y: any) => y.fileType);
      if (fileType == 'append file') {
        templateId = this.appendAPIResp.appendSheetList.filter(
          (x: any) => x.appendName == value
        )[0].appendID;
      }
      if (fileType == 'join file') {
        templateId = this.mergeCheckedList.filter(
          (x: any) => x.mergeName == value
        )[0].mergeIdFromAPI;
      }
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].primaryTableName =
        value;
    }

    if (indexPKFK == 0) {
      const filteredPT = columnObj.primaryTableList.filter(
        (x: any) => x.fileName == e.target.value
      );

      columnObj.selectedPrimaryTable = value;
      columnObj.primaryTemplateId = templateId;
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].primaryTemplateId =
        templateId;

      if (fileType == 'join file') {
        const cList = this.mergeCheckedList.filter(
          (x: any) => x.mergeName == value
        );
        fileObj.pkFKs[indexPKFK + 1].primaryKeyList =
          cList[0].mergeFieldListDTOFromAPI;
      } else {
        const cList = columnObj.primaryTableList.filter(
          (x: any) => x.fileName == value
        );
        fileObj.pkFKs[indexPKFK + 1].primaryKeyList = cList[0].columnList;
      }

      columnObj.primaryTableList.forEach((fileObj: any, index: number) => {
        if (fileObj.fileName == value) {
          pTList.splice(index, 1);
        }
      });
      fileObj.pkFKs[indexPKFK + 3].foreignTableList = pTList;
    }
    let secTList: any[] = [];
    if (indexPKFK > 4) {
      columnObj.selectedSecondaryTable = value;
      columnObj.primaryTemplateId = templateId;
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].primaryTemplateId =
        templateId;

      if (fileType == 'join file') {
        const cList = this.mergeCheckedList.filter(
          (x: any) => x.mergeName == value
        );

        fileObj.pkFKs[indexPKFK + 1].secondaryKeyList =
          cList[0].mergeFieldListDTOFromAPI;

        //columnObj.secondaryTableList.forEach((fileObj: any, index: number) => {
        //  this.mergeCheckedList.forEach((filePrimaryObj: any) => {
        // if (!sTList.map((x: any) => x.fileName).includes(filePrimaryObj.fileName)) {
        //   secTList.push(filePrimaryObj)
        // }

        // })
        // this.mergeCheckedList.forEach((mc:any)=>{
        //   this.
        // })

        //secTList = secTList.map(({ mergeName: fileName, ...rest }) => ({ fileName, ...rest }));
      } else {
        const cList = columnObj.secondaryTableList.filter(
          (x: any) => x.fileName == value
        );
        fileObj.pkFKs[indexPKFK + 1].secondaryKeyList = cList[0].columnList;
      }
      pTList.forEach((filePrimaryObj: any) => {
        if (
          !sTList.map((x: any) => x.fileName).includes(filePrimaryObj.fileName)
        ) {
          secTList.push(filePrimaryObj);
        }
      });

      fileObj.pkFKs[indexPKFK + 3].foreignTableList = secTList;
    }
  }

  changePrimaryKeyInDS(
    e: any,
    index: number,
    columnObj: any,
    indexPKFK: number,
    fileObj: any
  ) {
    const value = e.target.value;
    const orderNumber = columnObj.order;
    let cId: any;
    if (indexPKFK == 1) {
      columnObj.selectedPrimaryKey = value;
      columnObj.primaryKeyList.forEach((colObj: any) => {
        if (colObj.columnName == value) {
          cId = colObj.columnId;
        }
      });
      columnObj.primaryKeyId = cId;
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].primaryKeyId = cId;
    } else {
      columnObj.selectedSecondaryKey = value;
      columnObj.secondaryKeyList.forEach((colObj: any) => {
        if (colObj.columnName == value) {
          cId = colObj.columnId;
        }
      });
      columnObj.primaryKeyId = cId;
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].primaryKeyId = cId;
    }
  }

  changeJoinTypeInDS(
    e: any,
    index: number,
    columnObj: any,
    indexPKFK: number,
    fileObj: any
  ) {
    const value = e.target.value;
    columnObj.selectedMergeType = value;

    fileObj.dataSetMergeListDTOs[columnObj.order - 1].joinType = value.slice(
      0,
      1
    );
  }

  changeSecondaryTableInDS(
    e: any,
    index: number,
    columnObj: any,
    indexPKFK: number,
    fileObj: any
  ) {
    const value = e.target.value;
    let templateId: any;
    let fileType: any;
    //if (columnObj.foreignTableList[0].fileType == 'source file') {
    if (value.includes('-')) {
      let fName = value.split('-')[0];
      let sName = value.split('-')[1];
      this.uploadedFiles.filter((fileObj: any) => {
        if (fileObj.fileName == fName) {
          fileObj?.totalSheetList.forEach((sheetObj: any) => {
            if (sheetObj.sheetName == sName) templateId = sheetObj.templateId;
          });
        }
      });
    } else {
      if (indexPKFK == 3)
        fileType = columnObj.foreignTableList
          .filter((x: any) => x.fileName == value)
          .map((y: any) => y.fileType);
      else
        fileType = columnObj.foreignTableList
          .filter((x: any) => x.fileName == value)
          .map((y: any) => y.fileType);
      if (fileType == 'append file') {
        templateId = this.appendAPIResp.appendSheetList.filter(
          (x: any) => x.appendName == value
        )[0].appendID;
      }
      if (fileType == 'join file') {
        templateId = this.mergeCheckedList.filter(
          (x: any) => x.mergeName == value
        )[0].mergeIdFromAPI;
      }
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].secondaryTableName =
        value;
    }
    //}

    const orderNumber = columnObj.order;
    columnObj.selectedForeignTable = value;
    columnObj.secondaryTemplateId = templateId;

    if (fileType == 'join file') {
      const cList = this.mergeCheckedList.filter(
        (x: any) => x.mergeName == value
      );
      fileObj.pkFKs[indexPKFK + 1].foreignKeyList =
        cList[0].mergeFieldListDTOFromAPI;
    } else {
      const cList = columnObj.foreignTableList.filter(
        (x: any) => x.fileName == value
      );
      fileObj.pkFKs[indexPKFK + 1].foreignKeyList = cList[0].columnList;
    }

    //list adding to index=5,10,..
    const selectedPT = fileObj.pkFKs
      .filter((x: any) => x.selectedPrimaryTable)
      .map((y: any) => y.selectedPrimaryTable);
    const selectedFT = fileObj.pkFKs
      .filter((x: any) => x.selectedForeignTable)
      .map((y: any) => y.selectedForeignTable);
    const secondaryTableListt = [...selectedPT, ...selectedFT];
    const secdryTabList: any[] = [];
    fileObj.pkFKs[0].primaryTableList.forEach((fileObj: any) => {
      if (secondaryTableListt.includes(fileObj.fileName)) {
        secdryTabList.push(fileObj);
      }
    });
    if (fileObj.pkFKs[indexPKFK + 2] != undefined)
      fileObj.pkFKs[indexPKFK + 2].secondaryTableList = secdryTabList;

    fileObj.dataSetMergeListDTOs[columnObj.order - 1].secondaryTemplateId =
      templateId;
  }

  changeSecondaryKeyInDS(
    e: any,
    index: number,
    columnObj: any,
    indexPKFK: number,
    fileObj: any
  ) {
    const value = e.target.value;
    columnObj.selectedForeignKey = value;

    const cList = columnObj.foreignKeyList.filter(
      (x: any) => x.columnName == value
    );
    columnObj.secondaryKeyId = cList[0].columnId;

    fileObj.dataSetMergeListDTOs[columnObj.order - 1].secondaryKeyId =
      cList[0].columnId;
  }

  accordionFilesRowClicked(
    item: any,
    i: number,
    comp: any,
    j: number,
    listType: any
  ) {
    //const value = (listType == 'JF') ? item.mergeName + '[' + comp.columnName + ']' : (listType == 'AF') ? item.showAppendName + '[' + comp.columnName + ']' : comp.fileSheet + '[' + comp.columnName + ']';
    const value =
      listType == 'JF'
        ? item.mergeName + '[' + comp.columnName + ']'
        : listType == 'AF'
        ? item.showAppendName + '[' + comp.columnName + ']'
        : listType == 'SF'
        ? comp.fileSheet + '[' + comp.columnName + ']'
        : comp.fs_A_JcolName; //comp.fs_A_JcolName for 'SF'

    if (this.textAreaIndexinCE.tagType == 'textArea') this.textAreaSlice(value);
    if (this.textAreaIndexinCE.tagType == 'input') {
      this.createExpressionList[this.textAreaIndexinCE.index].sourceFieldName =
        value;
      this.createExpressionList[this.textAreaIndexinCE.index].selectedDataType =
        comp.generatedDataType;
      this.createExpressionList[this.textAreaIndexinCE.index].sqlColumn =
        comp.sqlColumn;
    }
  }

  //create Expression in DM
  inputInCreateExpression(e: any, i: number) {
    this.createExpressionList[i].sourceFieldName = e.target.value;
    const start = e.target.selectionStart;

    this.textAreaIndexinCE = {
      index: i,
      cursorPosition: start,
      value: e.target.value,
      tagType: 'input',
    };
  }

  textAreaIndexinCE: any = {};
  textAreaInCreateExpression(e: any, i: number) {
    this.createExpressionList[i].expression = e.target.value;
    const start = e.target.selectionStart;

    this.textAreaIndexinCE = {
      index: i,
      cursorPosition: start,
      value: e.target.value,
      tagType: 'textArea',
    };
  }

  createDataSetinDM() {
    const filteredList = this.datasetDetailsList.filter(
      (x: any) => x.isDatasetTableExpand == true
    );
    if (filteredList.length == 1) {
      return;
    }
    this.enableDataSetPopUp = true;
    this.appendForm.get('appendNameControl')?.reset();
  }

  accordionExpValue(obj: any, value: any) {
    this.textAreaSlice(value);
    this.isOpenAccordion = false;
  }

  changeDTinCreateExpression(e: any, i: number) {
    this.createExpressionList[i].selectedDataType = e.value.value;
    if (e.value.id == 6) {
      this.createExpressionList[i].isColumnType = true;
      this.signOperatorList = [
        { id: 0, value: 'NULL' },
        { id: 1, value: 'NOT NULL' },
        { id: 2, value: 'ON' },
        { id: 3, value: 'AFTER (ABSOLUTE)' },
        { id: 4, value: 'BEFORE (ABSOLUTE)' },
        { id: 5, value: 'AFTER (RELATIVE)' },
        { id: 6, value: 'BEFORE (RELATIVE)' },
        { id: 7, value: 'NOT' },
        { id: 8, value: 'TODAY' },
        { id: 9, value: 'YESTERDAY' },
        { id: 10, value: 'THIS WEEK' },
        { id: 11, value: 'LAST WEEK' },
        { id: 12, value: 'THIS MONTH' },
        { id: 12, value: 'LAST MONTH' },
      ];
    } else this.createExpressionList[i].isColumnType = false;
    if (
      e.value.id == 2 ||
      e.value.id == 3 ||
      e.value.id == 4 ||
      e.value.id == 5
    ) {
      this.signOperatorList = [
        { id: 0, value: 'NULL' },
        { id: 1, value: 'NOT NULL' },
        { id: 2, value: 'PRESENT' },
        { id: 3, value: 'BLANK' },
        { id: 4, value: 'LIKE' },
        { id: 5, value: 'NOT LIKE' },
        { id: 6, value: 'IS' },
        { id: 7, value: 'NOT' },
        { id: 8, value: 'STARTS WITH' },
        { id: 9, value: 'ENDS WITH' },
        { id: 10, value: 'IN' },
        { id: 11, value: 'CONTAINS' },
      ];
    }
    if (e.value.id == 0 || e.value.id == 1) {
      this.signOperatorList = [
        { id: 0, value: 'NULL' },
        { id: 1, value: 'NOT NULL' },
        { id: 2, value: 'IN' },
        { id: 3, value: '=' },
        { id: 4, value: '!=' },
        { id: 5, value: '&gt;=' },
        { id: 6, value: '&gt;' },
        { id: 7, value: '&lt;' },
        { id: 8, value: '&lt;=' },
      ];
    }
    this.createExpressionList[i].whereList = [];
  }

  changeDateTimeinCreateExpression(e: any, i: number) {
    this.createExpressionList[i].columnFormat = e.value.value;
  }

  add_SaveCreateExpression(obj: any) {
    let fieldName: any;
    let tableNamee: any;
    if (obj.sourceFieldName.includes('-')) {
      tableNamee = obj.sourceFieldName.split('[')[0];
      fieldName = obj.sourceFieldName.split('[')[1].split(']')[0];
      obj.tableNameInDataset = tableNamee;
      const fSName = tableNamee.split('-');
      const fName = fSName[0];
      const sName = fSName[1];
      const filteredFile = this.filesWithSelectedSheets.filter(
        (x: any) => x.fileName == fName
      );
      obj.tableName = filteredFile[0].totalSheetList.filter(
        (x: any) => x.sheetName == sName
      )[0].tableName;
      obj.fieldName = fieldName;
    } else {
      obj.tableName = obj.sourceFieldName.split('[')[0];
    }

    if (obj.expression == '' || obj.expression?.length == 0)
      obj.expression = obj.sqlColumn;
    else {
      if (obj.expression.includes('-')) {
        let tableNameee = obj.sourceFieldName.split('[')[0];
        let fieldNamee = obj.sourceFieldName.split('[')[1].split(']')[0];
        obj.tableNameInDataset = tableNameee;
        const fSName = tableNameee.split('-');
        const fName = fSName[0];
        const sName = fSName[1];
        const filteredFile = this.uploadedFiles.filter(
          (x: any) => x.fileName == fName
        );
        const tName = filteredFile[0].totalSheetList.filter(
          (x: any) => x.sheetName == sName
        )[0].tableName;
        const sqlName = filteredFile[0].totalSheetList
          .filter((x: any) => x.sheetName == sName)[0]
          .sheet.filter((y: any) => y.columnName == fieldNamee)[0].sqlColumn;
        obj.expression = tName + '.' + sqlName;
      }
    }
    //where key
    if (obj.value != '' && obj.signOperator != '') {
      const whereQuery = [
        obj.sqlColumn + ' ' + obj.signOperator + ' ' + obj.value,
      ];
      obj.whereList.forEach((element: any) => {
        const x =
          element.operator +
          ' ' +
          obj.sqlColumn +
          ' ' +
          element.signOperator +
          ' ' +
          element.value;
        whereQuery.push(x);
      });
      obj.where = whereQuery.join(' ');
    }

    const filteredList = this.datasetDetailsList.filter(
      (x: any) => x.isDatasetTableExpand == true
    );
    const dsDTOList = filteredList[0]?.datasetFieldDTOList;
    const columnNamesList = this.datasetDetailsList[0].datasetFieldDTOList.map(
      (x: any) => x.sourceFieldName
    );

    //groupby-orderby
    let selectedColumn = this.aJFDAllFilesList.filter(
      (x: any) => x.fileColumnName == obj.sourceFieldName
    )[0];
    let o_gByObj: any = {};
    if (selectedColumn == undefined) {
      o_gByObj = {
        fileColumnName: obj.sourceFieldName,
        dbtableColumnName: obj.sourceFieldName,
      };
    } else {
      o_gByObj = {
        fileColumnName: selectedColumn.fileColumnName,
        dbtableColumnName: selectedColumn.dbtableColumnName,
      };
    }
    this.datasetDetailsList[0].orderBy.push(o_gByObj);
    this.datasetDetailsList[0].groupBy.push(o_gByObj);

    if (dsDTOList?.length == 0) dsDTOList.push(obj);
    else {
      if (!obj.isEdit) {
        dsDTOList.push(obj);
      } else {
        dsDTOList.forEach((element: any, index: number) => {
          if (element.isEdit) {
            obj.isEdit = false;
            dsDTOList.splice(index, 1, obj);
          }
        });
      }
    }
    // columnName: '',
    this.createExpressionList = [
      {
        sourceFieldName: '',
        expression: '',
        columnFormat: '',
        signOperatorList: '',
        isEdit: false,
        selectedDataType: '',
        where: '',
        or: '',
        groupBy: '',
        value: '',
        signOperator: '',
        whereList: [],
      },
    ];
    //this.groupbyOrderby(tableNamee, fieldName, 'add');
  }

  datasetTableExpand(item: any, i: number) {
    // this.datasetDetailsList[i].isDatasetTableExpand = (item.isDatasetTableExpand) ? false : true;
    // item.isDatasetTableExpand = (item.isDatasetTableExpand) ? false : true;

    this.datasetDetailsList[i].isDatasetTableExpand = true;
    item.isDatasetTableExpand = item.isDatasetTableExpand = true;
  }

  editRowInDataSet(i: number, j: number, item: any) {
    item.isEdit = true;
    this.createExpressionList = [];
    this.createExpressionList.push(JSON.parse(JSON.stringify(item)));
  }

  deleteRowInDataset(i: number, j: number, item: any) {
    this.datasetDetailsList[i]?.datasetFieldDTOList.splice(j, 1);

    //changes update in orderby,groupby
    this.datasetDetailsList[i]?.orderBy.forEach((obObj: any, index: number) => {
      if (item.sourceFieldName == obObj.fileColumnName)
        this.datasetDetailsList[i]?.orderBy.splice(index, 1);
    });
    this.datasetDetailsList[i]?.groupBy.forEach((gbObj: any, index: number) => {
      if (item.sourceFieldName == gbObj.fileColumnName)
        this.datasetDetailsList[i]?.groupBy.splice(index, 1);
    });
  }

  getAllDataSetNameAPI() {
    this.solService.getAllDatasetName(this.process.processId).subscribe(
      (res: any) => {
        res.responseData.forEach((datasetObj: any) => {
          datasetObj.datasetFieldDTOList.forEach((colObj: any) => {
            colObj.fs_A_JcolName =
              datasetObj.datasetName + '[' + colObj.fieldName + ']';
          });
        });
        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  deleteDataSet(i: number) {
    this.datasetDetailsList.splice(i, 1);
  }

  aJFDlistForeach(mc: any, fName: any, type: string) {
    this.AJFDlist.push({
      fileName: fName,
      columnList: mc.columnList,
      fileType: type,
      tableList: mc.tableList,
    });
  }

  //dataModellingDropDownList: any[] = []; //x
  AJFDlist: Array<any> = [];
  aJFDAllFilesList: any[] = [];
  filesWithSelectedSheets: any[] = [];
  templatesMergeObj: any = {};
  mergeCheckedListForDM: any[] = [];
  secndAPIResp: any = {};
  isUploadFilesNextBtnEnable: boolean = false;

  changeTabs(item: any, value?: string) {
    //intgChanges
    this.getAllFunctions(); //functions list
    if (item.id == 1) {
      this.filesWithSelectedSheets = [];

      // this.nextBtnEnableInUF();
      if (this.isUploadFilesNextBtnEnable == true) return;
      this.uploadedFiles.forEach((file: any) => {
        if (
          file.totalSheetList.filter((x: any) => x.isSheetSelected).length != 0
        ) {
          this.filesWithSelectedSheets.push(file);
        }
      });
    }

    if (item.id == 3) {
      console.log('sortedCheckedList @id->3: ', this.sortedCheckedList);
      this.getMergeList();
    }
    this.submitted = false;
    this.submittedErrorMsg = '';
    if (item.id == 4) {
      this.loader.show();
      this.getAllDataSetNameAPI();

    }

    if (item.id == 5) {
      this.mergeCheckedListForDM = [];

      this.appendListInMCL = [];
      this.appendListInSCL = [];
      this.sheetsListInSCL = [];
      this.selected_filename = null;
      const appendListInMCL: any[] = [];
      this.mergeCheckedList.forEach((obj: any) => {
        const appendListInMCLL = obj.mergeList.filter(
          (x: any) => !x.showAppendName.join().includes('-')
        );
        appendListInMCLL.forEach((aL: any) => {
          appendListInMCL.push(JSON.parse(JSON.stringify(aL)));
        });
      });
      const appendListInSCL = JSON.parse(
        JSON.stringify(
          this.sortedCheckedList.filter(
            (x: any) => !x.showAppendName.join().includes('-')
          )
        )
      );
      const sheetsListInSCL = JSON.parse(
        JSON.stringify(
          this.sortedCheckedList.filter((x: any) =>
            x.showAppendName.join().includes('-')
          )
        )
      );

      let filteredTrue = sheetsListInSCL
        .filter((element: any) =>
          element.columnList.some(
            (subElement: any) => subElement.isChecked == true
          )
        )
        .map((element: any) => {
          return Object.assign({}, element, {
            columnList: element.columnList.filter(
              (subElement: any) => subElement.isChecked == true
            ),
          });
        });
      let filteredFalse = sheetsListInSCL
        .filter((element: any) =>
          element.columnList.some(
            (subElement: any) => subElement.isChecked == false
          )
        )
        .map((element: any) => {
          return Object.assign({}, element, {
            columnList: element.columnList.filter(
              (subElement: any) => subElement.isChecked == false
            ),
          });
        });
      this.sheetsListInSCL = [...filteredTrue, ...filteredFalse];

      filteredTrue = appendListInSCL
        .filter((element: any) =>
          element.columnList.some(
            (subElement: any) => subElement.isChecked == true
          )
        )
        .map((element: any) => {
          return Object.assign({}, element, {
            columnList: element.columnList.filter(
              (subElement: any) => subElement.isChecked == true
            ),
          });
        });
      filteredFalse = appendListInSCL
        .filter((element: any) =>
          element.columnList.some(
            (subElement: any) => subElement.isChecked == false
          )
        )
        .map((element: any) => {
          return Object.assign({}, element, {
            columnList: element.columnList.filter(
              (subElement: any) => subElement.isChecked == false
            ),
          });
        });
      this.appendListInSCL = [...filteredTrue, ...filteredFalse];

      filteredTrue = appendListInMCL
        .filter((element: any) =>
          element.columnList.some(
            (subElement: any) => subElement.isChecked == true
          )
        )
        .map((element: any) => {
          return Object.assign({}, element, {
            columnList: element.columnList.filter(
              (subElement: any) => subElement.isChecked == true
            ),
          });
        });
      filteredFalse = appendListInMCL
        .filter((element: any) =>
          element.columnList.some(
            (subElement: any) => subElement.isChecked == false
          )
        )
        .map((element: any) => {
          return Object.assign({}, element, {
            columnList: element.columnList.filter(
              (subElement: any) => subElement.isChecked == false
            ),
          });
        });
      this.appendListInMCL = [...filteredTrue, ...filteredFalse];

      filteredTrue = this.mergeCheckedList
        .filter((element: any) =>
          element.columnList.some(
            (subElement: any) => subElement.isChecked == true
          )
        )
        .map((element: any) => {
          return Object.assign({}, element, {
            columnList: element.columnList.filter(
              (subElement: any) => subElement.isChecked == true
            ),
          });
        });
      filteredFalse = this.mergeCheckedList
        .filter((element: any) =>
          element.columnList.some(
            (subElement: any) => subElement.isChecked == false
          )
        )
        .map((element: any) => {
          return Object.assign({}, element, {
            columnList: element.columnList.filter(
              (subElement: any) => subElement.isChecked == false
            ),
          });
        });

      this.mergeCheckedListForDM = [...filteredTrue, ...filteredFalse];

      this.AJFDlist = [];
      this.aJFDAllFilesList = [];
      //1list contains all file- columns
      const mcl = JSON.parse(JSON.stringify(this.mergeCheckedList));
      mcl?.forEach((mc: any) => {
        const fName = mc.mergeName;
        mc.columnList.forEach((colObj: any) => (colObj.fileType = 'join file'));
        this.AJFDlist.push({
          fileName: fName,
          columnList: mc.columnList,
          fileType: 'join file',
          tableList: mc.mergedTableList,
        });

        mc.columnList.forEach((colObj: any) => {
          this.aJFDAllFilesList.push({
            ...colObj,
            fileColumnName: fName + '[' + colObj.columnName + ']',
            fileType: 'join file',
            dbtableColumnName: colObj.tableName + '.' + colObj.sqlColumn,
            columnList: mc.columnList,
          });
        });
      });

      this.appendListInMCL?.forEach((al: any) => {
        const fName = al.showAppendName.join('');
        al.columnList.forEach(
          (colObj: any) => (colObj.fileType = 'append file')
        );
        this.AJFDlist.push({
          fileName: fName,
          columnList: al.columnList,
          fileType: 'append file',
          tableList: al.tableList,
        });

        al.columnList.forEach((colObj: any) => {
          //copy
          this.aJFDAllFilesList.push({
            ...colObj,
            fileColumnName: fName + '[' + colObj.columnName + ']',
            fileType: 'append file',
            dbtableColumnName: colObj.tableName + '.' + colObj.sqlColumn,
            columnList: al.columnList,
          });
        });
      });

      const appendSheetList: any[] = [];

      this.appendListInSCL?.forEach((al: any) => {
        const fName = al.showAppendName.join('');
        al.columnList.forEach(
          (colObj: any) => (colObj.fileType = 'append file')
        );
        this.AJFDlist.push({
          fileName: fName,
          columnList: al.columnList,
          fileType: 'append file',
          tableList: al.tableList,
        });

        al.columnList.forEach((colObj: any) => {
          this.aJFDAllFilesList.push({
            ...colObj,
            fileColumnName: fName + '[' + colObj.columnName + ']',
            fileType: 'append file',
            dbtableColumnName: colObj.tableName + '.' + colObj.sqlColumn,
            columnList: al.columnList,
          });
        });
      });

      //append for post
      this.appendListInSCL?.forEach((appendObj: any) => {
        const sheets: any[] = [];
        appendObj.tableList.forEach((tableObj: any) => {
          sheets.push(tableObj.templateId);
        });
        const object = { appendName: appendObj.showAppendName.join(), sheets };
        appendSheetList.push(object);
      });

      this.appendListInMCL?.forEach((appendObj: any) => {
        const sheets: any[] = [];
        appendObj.tableList.forEach((tableObj: any) => {
          sheets.push(tableObj.templateId);
        });
        const object = { appendName: appendObj.showAppendName.join(), sheets };
        appendSheetList.push(object);
      });

      this.sheetsListInSCL?.forEach((sl: any) => {
        const fName = sl.showAppendName.join('');
        sl.columnList.forEach(
          (colObj: any) => (colObj.fileType = 'source file')
        );
        this.AJFDlist.push({
          fileName: fName,
          columnList: sl.columnList,
          fileType: 'source file',
          tableList: sl.tableList,
        });
        sl.columnList.forEach((colObj: any) => {
          this.aJFDAllFilesList.push({
            ...colObj,
            fileColumnName: fName + '[' + colObj.columnName + ']',
            fileType: 'source file',
            dbtableColumnName: colObj.tableName + '.' + colObj.sqlColumn,
          });
        });
      });

      const allDatasetDetailsList = JSON.parse(
        JSON.stringify(this.allDatasetDetailsList)
      ); //changes for ds merge
      allDatasetDetailsList.forEach((ds: any) => {
        const fName = ds.datasetName;
        this.AJFDlist.push({
          fileName: fName,
          columnList: ds.datasetFieldDTOList,
          fileType: 'dataset file',
        });
        ds.datasetFieldDTOList.forEach((colObj: any) => {
          this.aJFDAllFilesList.push({
            ...colObj,
            fileName: fName,
            fileType: 'dataset file',
          });
        });
      });
    }
    if (value == 'unChedkedList') {
      if (this.sortedList[0]?.length != 0) {
        this.unCheckedListAddToMergeList = this.sortedList[0].filter(
          (x: any) => x.isSelected == false
        );
        this.unCheckedListAddToMergeList.forEach((obj: any) => {
          const fileName_SheetNamee = [obj].map((x: any) =>
            [x.fileName, x.sheetName].join('-')
          );
          //
          const sheetName = obj.sheetName;
          // const columnData = obj[sheetName + 'columnList'];
          const columnListt: any[] = [];

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
            columnListt.push(columnObj);
          });

          const identicalSet = {
            columnList: columnListt,
            showAppendName: fileName_SheetNamee,
            fileName_SheetName: fileName_SheetNamee,
            tableList: [obj],
            isSelected: false,
          };
          this.sortedCheckedList.push(identicalSet);
          this.appendUnchechedList = [];
          this.appendUnchechedList = JSON.parse(
            JSON.stringify(this.sortedCheckedList)
          );
        });
      }
    }

    if (value == 'prevInMerge') {
      if (this.sortedList[0]?.length != 0) {
        let sortedLength = this.sortedList[0]?.length;
        let sortedCheckedLength = this.sortedCheckedList.length;
        this.sortedCheckedList.splice(
          sortedCheckedLength - sortedLength,
          this.unCheckedListAddToMergeList.length
        );
      }
    }

    this.tabs.forEach((obj: any) => {
      if (item.id == obj.id) obj.isActive = true;
      else obj.isActive = false;
    });

    this.filesList.forEach((obj: any) => {
      obj.checkedSheetList = obj.sheetList.filter((x: any) => x.isSelected);
    });
  }



  isAllSelected(e: any, item: any, i: number, j: number) {
    this.submitted = false;
    this.submittedErrorMsg = '';
    this.hideCreateIdenticalBtnWithLength = true; //cndtn may req
    //this.sortedList[i][j].isSelected  = e.target.checked;
    this.sortedList.forEach((obj: any, index: number) => {
      if (index == i) {
        obj.forEach((item: any, index: any) => {
          if (index == j) {
            item.isSelected = e.target.checked;
          }
        });
      }
    });
  }

  createIdentical(index: number) {
    console.log('index: ', index);
    //intgChgs
    if (index == -1) {
      this.sortedList = this.sortedList.splice(1, 1);
      let list: any[] = [];
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
      this.sortedList.push(list);
    }

    if (index == 0) {

      let unCheckedList = this.sortedList[index].filter(
        (x: any) => x.isSelected == false
      );
      let checkedList = this.sortedList[index].filter(
        (x: any) => x.isSelected == true
      );
      console.log('checkedList: ', checkedList);
      let checkedSheetColumns: any[] = [];
      let k = 0;
      checkedList.forEach((obj: any) => {
        const fName = obj.fileName;
        const sName = obj.sheetName;
        console.log('sName: ', sName);
        if (checkedSheetColumns.length == 0) {
          checkedSheetColumns = obj[sName + 'columnList'];
        } else {
          let columnsList = obj[sName + 'columnList'];
          console.log('columnsList: ', columnsList);
          checkedSheetColumns.forEach((value: any) => {
            console.log('value: ',value)
            if (!columnsList.includes(value)) {
              k = 1;
              return;
            }
          });
        }
      });
      console.log('checkedSheetColumns: ', checkedSheetColumns);
      console.log("k==", k);
      if (k == 1) {
        this.submitted = true;
        this.submittedErrorMsg =
          'Ensure that the files with identical columns are selected for appending';
        return;
      }
      this.enableAppendNamePopup = true; //popup
      this.appendForm.get('appendNameControl')?.reset(); //popup
    }

    if (index == 2) {
      //?
      this.appendUnchechedList.forEach((obj: any) => {
        obj.isSelected = false;
      });
      this.sortedCheckedList = this.appendUnchechedList;
    }
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
    this.enableMergeNamePopup = true;
    this.joinForm.get('appendNameControl')?.reset();
  }

  mergeSet() {
    this.submit = true;
    this.addMergeJoin();
    console.log(this.joinForm);
    let mergedTableListt: any[] = [];
    let primaryTableList: any = [];
    console.log('this.sortedCheckedList: ', this.sortedCheckedList);
    let checkedSortedList = this.sortedCheckedList.filter(
      (x) => x.isSelected == true
    );
    console.log('checkedSortedList: ', checkedSortedList);
    // return;

    let mergeName: any[] = [];

    let showMergeNamee: any[] = [];
    const columnListt: any[] = [];

    checkedSortedList.forEach((obj: any) => {
      obj.fileName_SheetName.forEach((s: any) => {
        mergeName.push(s);
      });

      obj.tableList.forEach((obj1: any) => {
        mergedTableListt.push(obj1);
      });

      obj.showAppendName.forEach((arrVal: any) => {
        showMergeNamee.push(arrVal);
      });
      // mergedTableListt.forEach((fileObj: any) => {
      //   primaryTableList.push({ value: fileObj.fileName+ ' - '+fileObj.sheetName, templateId: fileObj.templateId })

      // })

      //const sheetName = obj.sheetName;
      //const columnData = obj[sheetName + 'columnList'];

      //
      obj.columnList.forEach((cLObj: any) => {
        cLObj = JSON.parse(JSON.stringify(cLObj));
        cLObj.fs_A_JcolName =
          this.joinForm.get('appendNameControl')?.value.trim() +
          '[' +
          cLObj.columnName +
          ']';
        columnListt.push({
          ...cLObj,
          joinName: this.joinForm.get('appendNameControl')?.value.trim(),
        });
      });

      //intg changes
    });

    mergedTableListt.forEach((fileObj: any) => {
      primaryTableList.push({
        value: fileObj.fileName + ' - ' + fileObj.sheetName,
        templateId: fileObj.templateId,
        sheet: fileObj.sheet,
        isSelected: false,
      });
    });
    primaryTableList.primaryKeyList = [];

    const pkFKs: any[] = [
      {
        type: null,
        primaryTableList: showMergeNamee,
        selectedPrimaryTable: '',
        optionValue: 'select Primary Table',
        order: 1,
      },
      {
        type: null,
        primaryKeyList: [],
        selectedPrimaryKey: '',
        optionValue: 'select Primary Key',
        order: 1,
      },
      {
        type: null,
        mergeType: '',
        optionValue: 'select Join Type',
        selectedMergeType: '',
        order: 1,
      },
    ];
    let fKsObj: any = {};
    fKsObj.type = null;
    fKsObj.foreignTableList = [];
    fKsObj.selectedForeignTable = '';
    fKsObj.optionValue = 'select Foreign Table';
    fKsObj.order = 1;
    pkFKs.push(fKsObj);

    fKsObj = {};
    fKsObj.type = null;
    fKsObj.foreignKeyList = [];
    fKsObj.selectedForeignKey = '';
    fKsObj.optionValue = 'select Foreign Key';
    fKsObj.order = 1;
    pkFKs.push(fKsObj);
    let foreignTableList: any = [];
    foreignTableList.foreignKeyList = [];
    // foreignTableList=[]
    // any<Custom> = { foreignKeyList: [],}
    // let foreignKeyList:any = [];
    let objMerge = {
      // dropDownList: { primaryTableList },
      dropDownList: [{ primaryTableList, foreignTableList }],
      columnList: columnListt,
      mergeList: checkedSortedList,
      mergeName: this.joinForm.get('appendNameControl')?.value.trim(),
      mergedTableList: mergedTableListt,
      showMergeSheetNames: showMergeNamee,
      pkFkMergeTypeList: pkFKs,
      templatesMergeList: [
        {
          order: 1,
          mergeName: this.joinForm.get('appendNameControl')?.value.trim(),
        },
      ],
    };

    this.mergeCheckedList.push(objMerge);
    this.enableMergeNamePopup = false;
    this.sortedCheckedList.forEach((appAndFilesObj: any) => {
      appAndFilesObj.isSelected = false;
    });

    console.log('joinSetForm after merge: ', this.joinSetForm)
  }

  resetMerge() {
    this.mergeCheckedList = []; //x
    const appendList = this.appendUnchechedList.filter(
      (x: any) => x.isAppend == true
    );
    const unAppendList = this.appendUnchechedList.filter(
      (x: any) => x.isAppend == undefined
    ); //add false
    if (appendList.length > 0) {
      this.sortedCheckedList = JSON.parse(JSON.stringify(appendList));
    }
    if (appendList.length == 0) {
      // added for reset
      this.sortedCheckedList = JSON.parse(JSON.stringify(appendList));
    }
    if (unAppendList.length > 0) {
      const filteredList = unAppendList.map((x) => x.tableList[0]);
      this.sortedList[0] = JSON.parse(JSON.stringify(filteredList));
    }
    this.changeTabs({ id: 3 }, 'unChedkedList');
    this.MergeArr().clear();
  }

  addAppendName() {
    //this.mergeCheckedList = [];
    let checkedList = this.sortedList[0].filter(
      (x: any) => x.isSelected == true
    );
    if (checkedList.length < 2) {
      this.submitted = true;
      this.submittedErrorMsg = 'please select atleast 2 checkboxes';
      return;
    }

    this.createIdentical(0);
    //this.enableAppendNamePopup = false;
  }

  async createAppendSet() {
    this.submited = true;
    console.log(this.appendForm);
    console.log('sortedCheckedList: ', this.sortedCheckedList);
    if (this.appendForm.invalid) {
      return;
    }
    console.log('form validated!')
    //let unCheckedList = this.sortedList[0].filter((x: any) => x.isSelected == false) //above list shd remain same(new changes
    let checkedList = this.sortedList[0].filter((x: any) => x.isSelected);
    this.sortedList[0].forEach(
      (sheetObj: any) => (sheetObj.isSelected = false)
    );

    //this.sortedList = []; //above list shd remain same(new changes)
    //this.sortedList.push(unCheckedList)

    const fileName_SheetNamee = checkedList.map((x: any) =>
      [x.fileName, x.sheetName].join('-')
    );

    const sheetName = checkedList[0].sheetName;
    // const columnData = checkedList[0][sheetName + 'columnList'];
    const columnListt: any[] = [];

    checkedList[0].sheet.forEach((colObj: any) => {
      colObj = JSON.parse(JSON.stringify(colObj));
      colObj.fs_A_JcolName =
        this.appendForm.get('appendNameControl')?.value.trim() +
        '[' +
        colObj.columnName +
        ']';
      const cObj = {
        ...colObj,
        isChecked: false,
        dataType: 'Select Data Type',
        newColumnName: '',
        isRowEdit: false,
        fileSheet: [this.appendForm.get('appendNameControl')?.value.trim()],
        appendName: this.appendForm.get('appendNameControl')?.value.trim(),
      };
      columnListt.push(cObj);
    });

    // const hOverf_SNamee = fileName_SheetNamee.join('/n') //x
    const identicalSet = {
      columnList: columnListt,
      showAppendName: [this.appendForm.get('appendNameControl')?.value.trim()],
      fileName_SheetName: fileName_SheetNamee,
      tableList: checkedList,
      isSelected: false,
      isAppend: true,
    };
    this.sortedCheckedList.push(identicalSet);
    console.log('sortedCheckedList after: ', this.sortedCheckedList);
    //this.targetFilesCheckedList.push(identicalSet) //shd x
    await this.saveAppendAPI(this.sortedCheckedList);
    // this.enableAppendNamePopup = false;
  }

  showTargetFilesColumnss: any[] = [];
  showTargetFileTableColumns(
    obj: any,
    value: any,
    listName: string,
    mergeObj: any
  ) {
    this.showTargetFilesColumnss = [];
    this.selectedM_A_S = [];
    this.selected_filename = value;
    this.sortedCheckedList.forEach((obj: any) => {
      obj.tabActiveInTargetFiles = false;
    });
    this.mergeCheckedList.forEach((object: any) => {
      object.mergeList.forEach((obj: any) => {
        obj.tabActiveInTargetFiles = false;
      });
    });
    if (listName == 'sortedCheckedList') {
      this.sortedCheckedList.forEach((obj: any) => {
        if (obj.showAppendName == value) obj.tabActiveInTargetFiles = true;
        else obj.tabActiveInTargetFiles = false;
      });
      if (value.join().includes('-')) {
        const sName = value.join().split('-')[1]; //this.showTargetFilesColumns shd x
        this.selectedM_A_S = obj.tableList[0][sName];
      } else {
        let filteredList = this.appendUnchechedList.filter(
          (x) => x.showAppendName == value.join()
        );
        filteredList[0].tableList.forEach((ele: any) => {
          let sName = ele.sheetName;
          ele[sName].forEach((obj: any) => {
            this.selectedM_A_S.push(obj);
          });
        });
      }
      this.showTargetFilesColumnss = obj.columnList;
    }

    if (listName == 'mergeCheckedList') {
      obj.mergeList.forEach((obj: any) => {
        if (obj.showAppendName == value) {
          obj.tabActiveInTargetFiles = true;
        } else obj.tabActiveInTargetFiles = false;
      });
      if (value.join().includes('-')) {
        const filteredList = obj.mergeList.filter(
          (x: any) => x.fileName_SheetName == value
        );
        filteredList[0].tableList.forEach((ele: any) => {
          let sName = ele.sheetName;
          ele[sName].forEach((obj: any) => {
            this.selectedM_A_S.push(obj);
          });
        });
      } else {
        let filteredList = obj.mergeList.filter(
          (x: any) => x.showAppendName == value
        );

        filteredList[0].tableList.forEach((ele: any) => {
          let sName = ele.sheetName;
          ele[sName].forEach((obj: any) => {
            this.selectedM_A_S.push(obj);
          });
        });
      }
      this.showTargetFilesColumnss = mergeObj.columnList;
    }

    this.preview();
  }

  rowEdit(index: number, value: string, obj: any) {
    //x
    const fileSheet = obj.fileSheet;
    const clickedSortedList = this.sortedCheckedList.filter(
      (x) =>
        x.showAppendName == fileSheet ||
        this.sortedCheckedList.filter(
          (x) => x.showAppendName == fileSheet.join()
        )
    );
    const particularArr = clickedSortedList[0].columnList[index];
    if (value == 'edit') {
      particularArr.isRowEdit = true;
      obj.isRowEdit = true;
    }
    if (value == 'checkMark') {
      particularArr.isRowEdit = false;
      obj.isRowEdit = false;
      particularArr.newColumnName = particularArr.temporaryColumnName;
      obj.newColumnName = obj.temporaryColumnName;
    }
    if (value == 'cancel') {
      particularArr.temporaryColumnName = particularArr.newColumnName;
      obj.temporaryColumnName = obj.newColumnName;
      obj.isRowEdit = false;
    }
  }

  checkedInJoin(e: any, obj: any, i: number) {
    this.submitted = false;
    this.submittedErrorMsg = '';
    obj.isSelected = e.target.checked;
  }

  changeDataTypeTF(e: any, obj: any, index: number) {
    const fileSheet = obj.fileSheet;
    const clickedSortedList = this.sortedCheckedList.filter(
      (x) =>
        x.showAppendName == fileSheet ||
        this.sortedCheckedList.filter(
          (x) => x.showAppendName == fileSheet.join()
        )
    );
    const particularArr = clickedSortedList[0].columnList[index];
    particularArr.dataType = e.target.value;
    obj.dataType = e.target.value;
  }

  createSecondaryDropdown(i: number, obj: any) {
    const pkFkLength = obj.pkFkMergeTypeList.length;
    if (obj.pkFkMergeTypeList[pkFkLength - 2].foreignTableList.length < 2) {
      return;
    }
    let orderNumber: number = pkFkLength / 5 + 1;
    obj.templatesMergeList.push({
      order: orderNumber,
      mergeName: obj.mergeName,
    });

    let selectedPT = obj.pkFkMergeTypeList
      .filter((x: any) => x.selectedPrimaryTable)
      .map((y: any) => y.selectedPrimaryTable);
    let selectedFT = obj.pkFkMergeTypeList
      .filter((x: any) => x.selectedForeignTable)
      .map((y: any) => y.selectedForeignTable);
    let secondaryTableListt = [...selectedPT, ...selectedFT];

    let pkList = obj.pkFkMergeTypeList[0].primaryTableList;
    pkList = pkList.filter((x: any) => !secondaryTableListt.includes(x));

    let dropDownArrList = [
      {
        type: null,
        secondaryTableList: secondaryTableListt,
        selectedSecondaryTable: '',
        optionValue: 'select Secondary Table',
        order: orderNumber,
      },
      {
        type: null,
        secondaryKeyList: [],
        selectedSecondaryKey: '',
        optionValue: 'select Secondary Key',
        order: orderNumber,
      },
      {
        type: null,
        mergeType: '',
        optionValue: 'select Join Type',
        selectedMergeType: '',
        order: orderNumber,
      },
      {
        type: null,
        foreignTableList: pkList,
        selectedForeignTable: '',
        optionValue: 'select Foreign Table',
        order: orderNumber,
      },
      {
        type: null,
        foreignKeyList: [],
        selectedForeignKey: '',
        optionValue: 'select Foreign Key',
        order: orderNumber,
      },
    ];

    dropDownArrList.forEach((element: any) => {
      obj.pkFkMergeTypeList.push(element);
    });
  }

  viewScriptFromApi: string = '';
  saveDataSetApi() {
    this.loader.show();
    let datasetObj: any = {};
    datasetObj.processId = this.process.processId;
    if (this.enableUploadSQLPopup) {
      datasetObj.datasetName = this.sqlScriptForm.value.datasetName;
      datasetObj.sqlScript = this.sqlScriptForm.value.sqlScript;
      this.solService.addDataset(datasetObj).subscribe(
        (res: any) => {
          //copy
          this.getAllDataSetNameAPI();
          this.loader.hide();
        },
        (err: any) => {
          this.loader.hide();
        }
      ); //
    } else {
      const colList: any[] = [];
      const expandTableTrue = this.datasetDetailsList.filter(
        (x: any) => x.isDatasetTableExpand
      );
      expandTableTrue[0].datasetFieldDTOList.forEach((datasetField: any) => {
        // defination: datasetField.expression, //shd check
        colList.push({
          tableName: datasetField.tableName,
          columnFormat: datasetField.columnFormat,
          fieldName: datasetField.fieldName,
          expression: datasetField.expressionToDB,
          dataType: datasetField.selectedDataType,
          where: datasetField.where,
          or: datasetField.or,
          groupBy: '',
          sourceFieldName: datasetField.sourceFieldName,
        });
      });
      datasetObj.datasetFieldDTOList = colList;
      datasetObj.dataSetMergeListDTOs = expandTableTrue[0].dataSetMergeListDTOs;
      datasetObj.datasetName = expandTableTrue[0].datasetName;
      //orderby,groupby,having = undefined
      datasetObj.groupBy = expandTableTrue[0].groupBytoDB;
      datasetObj.orderBy = expandTableTrue[0].orderBytoDB;
      datasetObj.having = expandTableTrue[0].having;

      this.solService.addDataset(datasetObj).subscribe(
        (res: any) => {
          this.getAllDataSetNameAPI();
          this.loader.hide();
        },
        (err: any) => {
          this.loader.hide();
        }
      );
      expandTableTrue[0].isDatasetTableExpand = false;
      this.saveDataSetPopup = false;
    }
  }
  callGetViewscript(datasetObj: any) {
    this.loader.show();
    const datasetId = { datasetId: datasetObj.datasetId };
    this.solService.getViewScript(datasetId).subscribe(
      (res: any) => {
        this.viewscriptForm
          .get('sqlScript')
          ?.patchValue(res?.responseData.sqlScript);
        this.viewscriptForm
          .get('datasetId')
          ?.patchValue(res?.responseData.datasetId);
        this.enableViewScriptPopup = true;
        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  updateScriptByDatasetId(viewscriptForm: any) {
    //underconstruction
    this.loader.show();
    const data = {
      datasetId: viewscriptForm.value.datasetId,
      newScript: viewscriptForm.value.sqlScript.trim(),
    };
    this.solService.updateScriptByDatasetId(data).subscribe(
      (res: any) => {
        this.viewscriptForm
          .get('sqlScript')
          ?.patchValue(res?.responseData.newScript);
        this.viewscriptForm
          .get('datasetId')
          ?.patchValue(res?.responseData.datasetId);
        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  editDatasetFile(datasetObj: any) {
    this.createExpressionList = [
      {
        sourceFieldName: '',
        expression: '',
        isEdit: false,
        selectedDataType: '',
        where: '',
        or: '',
        groupBy: '',
        orderBy: '',
        value: '',
        signOperator: '',
        whereList: [],
      },
    ];
    datasetObj.isDatasetTableExpand = true;

    this.datasetDetailsList[0] = datasetObj;
  }

  enableViewScriptPopup: boolean = false;
  appendAPIResp: any = {};

  async saveAppendAPI(sortedCheckedList: any) {
    const appendSheetList: any[] = [];
    sortedCheckedList.forEach((appendObj: any) => {
      const appendDtos: any[] = [];
      appendObj.tableList.forEach((tableObj: any) => {
        appendDtos.push({ sheetId: tableObj.templateId, fileName: tableObj.fileName });
      });
      appendSheetList.push({
        appendDtos,
        appendName: appendObj.showAppendName.join(),
      });
    });

    const appendObj: any = {
      processId: this.process.processId,
      appendSheetList: appendSheetList,
    };

    this.solService.addAppendFiles(appendObj).subscribe(
      async (res: any) => {
        this.appendAPIResp = res.responseData;
        sortedCheckedList.forEach((appendObj: any) => {
          appendObj.isPreviewEnable = true;
        });
        this.toast.success({
          title: 'Success',
          message: 'Saved Successfully !',
        });
        this.loader.hide();
        this.enableAppendNamePopup = false;
        await this.getAppendFiles()
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  async getAppendFiles(){
    this.solService.getAppendFiles(this.process.processId).subscribe((res:any)=>{
      console.log(res);
      this.appendFiles = res.responseData.appendSheetList;
      // this.sortedCheckedList = res.responseData.appendSheetList;
    })
  }

  applyFilter(event: any) {
    //shd implement with fx
    this.fx = this.fx.filter((user: any) =>
      this.containsValue(user, event.target.value.trim().toLowerCase())
    );
    // this.fx= []
    //console.log("msg",this.messagesSearch);
    // this.fx = of(this.messagesSearch);
  }
  containsValue(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
        // console.log(cur);
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false);
  }
  selectuser(e: any, item: any) {
    const value = e.value;
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
    // const selectedPT = this.mergeCheckedList[i].dropDownList[0].primaryTableList.filter((x: any) => x.value == value) // 0 for 1st object
    // this.mergeCheckedList[i].dropDownList.primaryKeyList = selectedPT[0].sheet;
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
      // selectedPTFT.primaryTableList.forEach((obj: any) => obj.isSelected = false)
      this.mergeCheckedList[i].dropDownList[j + 1] = {
        primaryTableList: ptl,
        foreignTableList: ftlUnduplicate,
      };
      // this.mergeCheckedList[i].dropDownList[j + 1].primaryTableList.push(pt)
      // this.mergeCheckedList[i].dropDownList[j + 1].primaryTableList.push(ft)
      console.log(this.mergeCheckedList);
      if (
        this.mergeCheckedList[i].dropDownList[j + 1].foreignTableList.length ==
        0
      ) {
        this.mergeCheckedList[i].allTablesSelected = true;
      }
    } else {
      // const pt = this.mergeCheckedList[i].dropDownList[j].primaryTableList
      // ptl=pt
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
      // this.mergeCheckedList[i].dropDownList[j + 1].primaryTableList.push(ft)
      console.log(this.mergeCheckedList);
      if (
        this.mergeCheckedList[i].dropDownList[j + 1].foreignTableList.length ==
        0
      ) {
        this.mergeCheckedList[i].allTablesSelected = true;
      }
    }

    console.log(this.mergeCheckedList[i].dropDownList[j + 1]);

    // const selectedPT = this.mergeCheckedList[i].dropDownList[0].foreignTableList.filter((x: any) => x.value == value) // o for 1st object
    // this.mergeCheckedList[i].dropDownList.ForeignKeyList = selectedPT[0].sheet;
    // this.mergeCheckedList[i].dropDownList.secondaryKeyList = item.value;
    // console.log(this.mergeCheckedList[i]?.dropDownList?.primaryTableList);
  }

  selectPrimarykey(e: any, j: number) {
    const value = e.value;
  }
  selectForeignKey(e: any, j: number) {
    const value = e.value;
  }

  previewPopup(j: any, item: any, i: any, obj: any, name: string) {
    //filtered files,
    if (name != '' || name?.length != 0) {
      this.loader.show();
      this.solService.viewTableDetails(name).subscribe(
        (res: any) => {
          this.selectedM_A_S = res.responseData;
          this.preview();
          this.showTargetFilePopup = true;
          this.loader.hide();
        },
        (err: any) => {
          this.loader.hide();
        }
      );
    } else {
      this.showTargetFilePopup = true;
      this.selectedM_A_S = item.sheetData;
      this.showTargetFilePopup = true;
      this.preview();
    }
  }

  preview() {
    this.columnsArr = [];
    //identify unique keys in the array
    for (var key in this.selectedM_A_S[0]) {
      if (this.selectedM_A_S[0].hasOwnProperty(key)) {
        this.columnsArr.push(key);
      }
    }
  }

  selectgroupByOrderByInDM(e: any, item: any, i: number, type: any) {
    const selectedList = e.value;
    let allFiles = e.value.map((x: any) => x.dbtableColumnName).join();
    if (type == 'groupby')
      this.datasetDetailsList.filter(
        (x: any) => x.isDatasetTableExpand == true
      )[0].groupBytoDB = allFiles;
    if (type == 'orderby')
      this.datasetDetailsList.filter(
        (x: any) => x.isDatasetTableExpand == true
      )[0].orderBytoDB = allFiles;
  }

  executeProject() {
    this.loader.show();
    this.solService.executeProject(this.process.processId).subscribe(
      (res: any) => {
        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  deleteTables(e: Event, item:any, index:number){
    console.log('e: ', e)
    console.log('item: ', item)
    // this.solService.deleteTables({id:item.appendID, type:'append', operation:'check'}).subscribe((res:any)=>{
    //   console.log(res);
        this.solService.deleteTables({id:item.appendID, type:'append', operation:'delete'}).subscribe((res:any)=>{
          console.log(res);
          this.appendFiles.splice(this.appendFiles.findIndex(ele => ele.id === item.id), 1)
        })
    // })
  }
}
