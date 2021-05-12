import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

interface contactType {
  type: string;
  number: number;
}

interface data {
  name: String;
  designation: String;
  contact?: contactType[];
  skills?: string[];
  dob?: String;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  DisplayData: data[] = [];
  submitted = false;
  formData: any;
  Date: Date = new Date();

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.formData = this.fb.group({
      EmpData: this.fb.array([this.fb.group({
        name: [],
        designation: [],
        contact: this.fb.array([this.fb.group({ type: '', number: ['', Validators.length == 10] })]),
        skills: this.fb.array([this.fb.group({ skill: '' })]),
        dob: []
      })
      ])
    })
  }

  addemp() {
    this.getEmployees.push(this.fb.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      contact: this.fb.array([this.fb.group({ type: '', number: ['', Validators.length == 10] })]),
      skills: this.fb.array([this.fb.group({ skill: '' })]),
      dob: []
    }));
  }

  counter(i: number) {
    return new Array(i);
  }

  get formCount() { return this.formData.controls; }
  get getEmployees() { return this.formData.get('EmpData') as FormArray; }

  getskill(pIndex: number) {
    return this.formCount.EmpData.controls[pIndex].get("skills") as FormArray;
  }

  getcontacts(pIndex: number) {
    return this.formCount.EmpData.controls[pIndex].get("contact") as FormArray;
  }

  addContact(pIndex: number) {
    if (this.formCount.EmpData.controls[pIndex].get("contact").length < 4)
      this.formCount.EmpData.controls[pIndex].get("contact").push(this.fb.group({ type: '', number: ['', Validators.length == 10] }));
    else
      this.openSnackBar("Max 4 contacts allowed", "OK");
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  addSkill(pIndex: number) {
    this.formCount.EmpData.controls[pIndex].get("skills").push(this.fb.group({ skill: '' }));
  }

  view() {
    this.submitted = true;
    let correctContact = 0;
    let isContact = false;
    let EmployeeDetails = this.formData.value.EmpData;
    for (let i = 0; i < EmployeeDetails.length; i++) {
      for (let j = 0; j < EmployeeDetails[i].contact.length; j++) {
        console.log(EmployeeDetails[i].contact[j].number + " data " + EmployeeDetails[i].contact[j].number.toString().length);
        if (EmployeeDetails[i].contact[j].type != '' && correctContact == i && EmployeeDetails[i].contact[j].number != null && EmployeeDetails[i].contact[j].number.toString().length == 10)
          isContact = true;
        else {
          this.DisplayData = [];
          isContact = false;
          this.openSnackBar("Contact detail missing or Invalid", "OK");
          return;
        }
      }
    }

    if (this.formData.invalid) {
      return;
    }

    this.DisplayData = [];

    for (let i = 0; i < EmployeeDetails.length; i++) {
      let data1: data = {
        name: "",
        designation: "",
        contact: [],
        skills: [],
        dob: ""
      };

      data1.name = EmployeeDetails[i].name;
      data1.designation = EmployeeDetails[i].designation;
      data1.contact = EmployeeDetails[i].contact;
      for (let j = 0; j < EmployeeDetails[i].skills.length; j++)
        data1.skills?.push(EmployeeDetails[i].skills[j].skill);
      data1.dob = moment(new Date(EmployeeDetails[i].dob)).format("DD-MMM-YYYY");
      // data1.dob = EmployeeDetails[i].dob;
      this.DisplayData.push(data1);
    }
  }


  downloadJson() {

    const element = document.createElement('a');
    element.setAttribute('href', `data:'text/json';charset=utf-8,${encodeURIComponent(JSON.stringify(this.DisplayData))}`);
    element.setAttribute('download', 'Employee.json');

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

}

// referrence on how to download json data
  //https://stackblitz.com/edit/httpsstackoverflowcomquestions51806464how-to-create-and-downloa?file=src%2Fapp%2Fapp.component.ts

//https://blog.karmacomputing.co.uk/angular-6-dynamically-add-rows-reactive-forms-how-to/
//Used to take a referrence on how to create Reactive Form

//fetch data from nested form group
//https://forum.ionicframework.com/t/formarray-not-working-cannot-read-property-controls-of-undefined/113112