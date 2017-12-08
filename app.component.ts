import { Component } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, AbstractControl} from '@angular/forms';
import { DateModel, DatePickerOptions } from '../ng2-datepicker/ng2-datepicker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})


export class AppComponent {
  appTitle = 'Repayment Calculator';

  InterestRateSlider = '8';
  LoanTermSlider = '12';
  minValue = 8;
  maxValue = 16;
  minValue1 = 12;
  maxValue1 = 300;
  HideEMIAmount=true;
  Hidetable=true;
  paymentSchedule=true;
  CalculateBtn =false;
  EditedHidden = true;
  EMIerror = true;
  formattedEmi="";
  minLoan = 210000;
  maxLoan = 100000000;  
  CalculatedData=[];
  emi=0;

  LoanAmount = null;
  public minMaxError = false;    
  //txt=null;

  date: DateModel;
  options: DatePickerOptions;

  constructor() {
    this.options = new DatePickerOptions(); 
    this.options.format='MMM-YYYY';    
  }

   ResetLoan() { 
    this.LoanAmount = '0';
    this.InterestRateSlider = '8';
    this.LoanTermSlider = '12';
    if(this.date != null){
      this.date.formatted=null;
      this.date = null;
    }
    this.CalculatedData=[];
    this.HideEMIAmount=true;
    this.Hidetable=true;
    this.paymentSchedule=true;
    this.CalculateBtn =false;
    this.formattedEmi="";
    this.EditedHidden = true;
  }

LoanValidate(newValue){
  this.LoanAmount = newValue;
  if(this.LoanAmount < this.minLoan || this.LoanAmount > this.maxLoan || this.LoanAmount == null){
      this.minMaxError = true;      
   }
   else{
     this.minMaxError = false;   
   }
}
  calculateLoan(){
        
        if(this.LoanAmount != null && this.LoanAmount != "" && this.LoanAmount !="0" && this.date != null  && this.date.formatted!=null && (this.LoanAmount >= this.minLoan && this.LoanAmount <= this.maxLoan) ){
       this.emi = parseInt((this.calculateEmi(this.LoanAmount, this.InterestRateSlider,this.LoanTermSlider)).toFixed(0));
        this.formattedEmi=this.addSeparator(this.emi)
        this.generateTable();
      }
      else if(this.LoanAmount < this.minLoan || this.LoanAmount > this.maxLoan || this.LoanAmount == null){
        this.minMaxError = true;
      }
      else if(this.date == null || this.date.formatted==null){
        this.EMIerror = false;
       }
      else{
        this.minMaxError = true;
        this.EMIerror = false;
      }
  }
  generateTable(){
		this.CalculatedData=[];
        var opening_balance =parseInt(this.LoanAmount);
        var interest = 0;
        var principal = 0;
        var closing_balance = 0;
        var mon = this.date.month;
        var yr=this.date.year;
        		
        var startDate = mon + "/"+yr ;
        var dueDate = "01-" + mon + "-" + yr;
        for ( var i:number= 1; i <= parseInt(this.LoanTermSlider); i++) {
            interest = parseInt((opening_balance * (parseInt(this.InterestRateSlider) / 100) / 12).toFixed(0));
            principal = parseInt((this.emi - interest).toFixed(0));
            if (parseInt(mon) == 4) {
                closing_balance = Math.round(opening_balance - principal);

            } else {
                closing_balance = (opening_balance - principal);
            }
            closing_balance = (closing_balance < 10) ? 0 : closing_balance;
            var tmp =  closing_balance.toFixed(0);
            var newRowContent;
            var tmp1 = Number(opening_balance).toFixed(0);
			var d={};
			d["startDate"]=startDate;
			d["OB"]=tmp1;
			d["emi"]=this.emi;
			d["interest"]=interest;
			d["principal"]=principal;
			d["tmp"]=tmp;
			d["dueDate"]=dueDate;			
      this.CalculatedData.push(d);            
      mon = (parseInt(mon)+1).toFixed(0);
      yr = (parseInt(mon) > 12) ? (parseInt(yr) + 1).toFixed(0) : yr;
      mon = (parseInt(mon) > 12) ? "01" : mon; 
      mon=("0"+mon).slice(-2);     
      dueDate = "01 -" + mon  + "-" + yr;      
      startDate = mon + "/" + yr;
      opening_balance = closing_balance;
      }
    this.HideEMIAmount=false;
    this.paymentSchedule=false;
    this.CalculateBtn=true;
    this.EditedHidden=false;
    this.EMIerror = true;
    }
    CalculatedTable(){
      this.Hidetable=false;      
      this.paymentSchedule=true;
    }

    calculateEmi=function(p, i, m) {
    //EMI Formula = [P x I x (1+I)^N]/[(1+I)^N-1]
      var emi = 0;
      
      if (i >= 1.0) {
          i = i / 100;
      }
     var mi = i / 12;
      var pw = 1;
      /*for (var j = 0; j < m; j++) {
          pw = pw * (1 + mi);
      }*/
      pw = Math.pow((1+mi),m);
      emi = (p * pw * mi) / (pw - 1);
      return emi;
  }
addSeparator=function(str) {
      return (str.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
  }

  removeSeparator=function(str) {
      return (str.toString().replace(/,/g, ''));
  }

}
