var RunningNodeJS=true;
var AECCSV;
var FPCSV; 
var AEC;
var FP;

var AECFuzzy;

function Initialise(){
	console.log("Running initialisation.");
	console.log("Opening AEC CSV");
	AECCSV=new CSVFile('./aecdata/aec.csv')
	console.log("Opening FP CSV");
	FPCSV=new CSVFile('./futurepartydata/fporiginal.csv');
}

function LoadOriginalAndFPFiles(){
	AECCSV=new CSVFile('./futurepartydata/fporiginal.csv')
	console.log("Opening FP CSV");
	FPCSV=new CSVFile('./futurepartydata/fpnb.csv');
}

function LoadCSVData(){
	CreateAECVectors();
	CreateFPVectors();
	CreateFuzzyArrays();
	
	
	SimplifyNames(AEC);
	SimplifyNames(FP);
	
}



function CreateAECVectors(){
	AEC={};
	AEC.ID=AECCSV.GetEntriesColumn(0, 1, AECCSV.FileLength()-1);
	AEC.FirstName=AECCSV.GetEntriesColumn(2, 1, AECCSV.FileLength()-1);
	AEC.LastName=AECCSV.GetEntriesColumn(3, 1, AECCSV.FileLength()-1);
	AEC.DOB=AECCSV.GetEntriesColumn(4, 1, AECCSV.FileLength()-1);
	AEC.Address=AECCSV.GetEntriesColumn(8, 1, AECCSV.FileLength()-1);
	AEC.Suburb=AECCSV.GetEntriesColumn(9, 1, AECCSV.FileLength()-1);
	AEC.State=AECCSV.GetEntriesColumn(10, 1, AECCSV.FileLength()-1);
	AEC.Postcode=AECCSV.GetEntriesColumn(11, 1, AECCSV.FileLength()-1);
}

function CreateFPVectors(){
	FP={};
	FP.ID=FPCSV.GetEntriesColumn(0, 1, FPCSV.FileLength()-1);
	FP.FirstName=FPCSV.GetEntriesColumn(2, 1, FPCSV.FileLength()-1);
	FP.LastName=FPCSV.GetEntriesColumn(3, 1, FPCSV.FileLength()-1);
	FP.DOB=FPCSV.GetEntriesColumn(4, 1, FPCSV.FileLength()-1);
	FP.Address=FPCSV.GetEntriesColumn(8, 1, FPCSV.FileLength()-1);
	FP.Suburb=FPCSV.GetEntriesColumn(9, 1, FPCSV.FileLength()-1);
	FP.State=FPCSV.GetEntriesColumn(10, 1, FPCSV.FileLength()-1);
	FP.Postcode=FPCSV.GetEntriesColumn(11, 1, FPCSV.FileLength()-1);
	
	FP.Phone=FPCSV.GetEntriesColumn(5, 1, FPCSV.FileLength()-1);
	FP.Mobile=FPCSV.GetEntriesColumn(6, 1, FPCSV.FileLength()-1);
	FP.Email=FPCSV.GetEntriesColumn(7, 1, FPCSV.FileLength()-1);
}

// Simplify names
function SimplifyNames(Group){
	Group.FirstNameSimp=[];
	Group.LastNameSimp=[];
	Group.AddressSimp=[];
	Group.SuburbSimp=[];
	Group.StateSimp=[];
	for (var i in Group.ID){
		Group.FirstNameSimp[i]=Simplify(Group.FirstName[i]);
		Group.LastNameSimp[i]=Simplify(Group.LastName[i]);
		Group.AddressSimp[i]=Simplify(Group.Address[i]);
		Group.SuburbSimp[i]=Simplify(Group.Suburb[i]);
		Group.StateSimp[i]=Simplify(Group.State[i]);
	}
}

function Simplify(StringInput){
	
	StringInput=StringInput.toString();
	
	var _nonWordRe = /[^\w, ]+/;
	
	var temp=StringInput.toLowerCase();
	
	var simplified = temp.replace(_nonWordRe, '');
	return simplified;
}

function CreateFuzzyArrays(){
	// 	Two filter types:
	// LineNUM +" "+ Name +" "+ DOB
	// LineNUM +" "+ Name +" "+ DOB +" "+ Address
	AEC.NumNameDob=[];
	AEC.NumNameDobAdd=[];
	for (var i in AEC.ID){
		//AEC.NumNameDob[i]=""+AEC.ID[i]+" "+AEC.FirstName[i]+" "+AEC.LastName[i]+" "+AEC.DOB[i];
		//AEC.NumNameDobAdd[i]=AEC.NumNameDob[i]+" "+AEC.Address[i]+" "+AEC.Suburb[i]+" "+AEC.State[i]+" "+AEC.Postcode[i];

		AEC.NumNameDobAdd[i]=""+AEC.ID[i]+" "+AEC.FirstName[i]+" "+AEC.LastName[i]+" "+AEC.DOB[i]+" "+AEC.Address[i]+" "+AEC.Suburb[i]+" "+AEC.State[i]+" "+AEC.Postcode[i];
	}
	FP.NumNameDob=[];
	FP.NumNameDobAdd=[];
	for (var i in FP.ID){
		FP.NumNameDob[i]=""+FP.ID[i]+" "+FP.FirstName[i]+" "+FP.LastName[i]+" "+FP.DOB[i];
		FP.NumNameDobAdd[i]=FP.NumNameDob[i]+" "+FP.Address[i]+" "+FP.Suburb[i]+" "+FP.State[i]+" "+FP.Postcode[i];
	}
	
	// Start the fuzzy.js system
	
	//AECNumNameDobFuzzy = FuzzySet(AEC.NumNameDob);
	AECNumNameDobAddFuzzy = FuzzySet(AEC.NumNameDobAdd);
}

function SearchPersonNameDOB(){
	var IDNumber=Number(document.getElementById("FPIDBox").value);
	console.log("Person under inspection:");
	console.log(FP.NumNameDob[IDNumber]);
	var TheseResults=AECNumNameDobAddFuzzy.get(FP.NumNameDob[IDNumber]);
	console.log("Results:");
	console.log(TheseResults);
	DisplayResults(TheseResults);
}

function SearchPersonNameDOBAddress(){
	var IDNumber=Number(document.getElementById("FPIDBox").value);
	console.log("Person under inspection:");
	console.log(FP.NumNameDobAdd[IDNumber]);
	var TheseResults=AECNumNameDobAddFuzzy.get(FP.NumNameDobAdd[IDNumber]);
	console.log("Results:");
	console.log(TheseResults);
	DisplayResults(TheseResults);
}

//<div id="LoadDataButton" class="SolidButton" onClick="FindAndDisplayPeople(LastNameAndDOB);"> Last Name And DOB </div>



//<div id="LoadDataButton" class="SolidButton" onClick="SearchPersonNameDOBAddress();"> Name DOB Address </div>
//<div id="LoadDataButton" class="SolidButton" onClick="SearchPersonNameDOB();"> Name DOB only </div>



function DisplayResults(Results){
	var Ele=document.getElementById("SearchResults");
	Ele.innerHTML="Prob (%), ID, Name, Address<br>";
	
	for (var Count in Results){
	
		var PercentageMatch=Math.round(Results[Count][0] * 10000) / 100
	
		Ele.innerHTML+=""+PercentageMatch+"%         "+Results[Count][1]+"<br>";
	}
}



function SearchPeople(FPNum, SelectionFunction){
	
	var Results=[];
	for (var i in AEC.ID){
		
		if (SelectionFunction(FPNum, i)){
			Rtemp={};
			
			// Store the results
			Rtemp.Count=i;
			Rtemp.ID=AEC.ID[i];
			
			//Store information that matches the data on files
			Rtemp.FirstName=AEC.FirstName[i];
			Rtemp.LastName=AEC.LastName[i];
			Rtemp.DOB=AEC.DOB[i];
			Rtemp.Address=AEC.Address[i];
			Rtemp.Suburb=AEC.Suburb[i];
			Rtemp.State=AEC.State[i];
			Rtemp.Postcode=AEC.Postcode[i];
			
			Results.push(Rtemp);
			
		}
	}
	
	
	
	return Results;
}

function FindAndDisplayPeople(SelectionFunction){
	
	
	var FPNum=Number(document.getElementById("FPIDBox").value);
	
	var Results=SearchPeople(FPNum, SelectionFunction);
	
	console.log("Results for this search");
	console.log(Results);
	
	DisplayResults2(Results, FPNum);
	
	
}


function DisplayResults2(Results, FPNum){
	var ElementToChange=document.getElementById("SearchResults");
	
	
	HTMLString="<p>Phone Number: "+ FP.Phone[FPNum]+ "</p>";
	HTMLString+="<table style='width:100%'>\n";
	
	
	
	HTMLString+="<tr style='background-color: #99f;'>";
		
		HTMLString+="<td> Score </td>";
		HTMLString+="<td> ID </td>";
		HTMLString+="<td> First name</td>";
		HTMLString+="<td> Last name </td>";
		HTMLString+="<td> DOB </td>";
		HTMLString+="<td> Phone </td>";
		HTMLString+="<td> Mobile </td>";
		HTMLString+="<td> Email </td>";
		HTMLString+="<td> Address </td>";
		HTMLString+="<td> Suburb </td>";
		HTMLString+="<td> Post code </td>";
		
		
		
	HTMLString+="</tr>";
	
	
	
	
	
	HTMLString+="<tr  style='background-color: #ddf;'>";
		
		HTMLString+="<td>  </td>";
		HTMLString+="<td>"+ FP.ID[FPNum] +"</td>";
		HTMLString+="<td>"+ FP.FirstName[FPNum] +"</td>";
		HTMLString+="<td>"+ FP.LastName[FPNum] +"</td>";
		HTMLString+="<td>"+ FP.DOB[FPNum] +"</td>";
		HTMLString+="<td>"+ FP.Phone[FPNum] +"</td>";
		HTMLString+="<td>"+ FP.Mobile[FPNum] +"</td>";
		HTMLString+="<td>"+ FP.Email[FPNum] +"</td>";
		HTMLString+="<td>"+ FP.Address[FPNum] +"</td>";
		HTMLString+="<td>"+ FP.Suburb[FPNum] +"</td>";
		HTMLString+="<td>"+ FP.Postcode[FPNum] +"</td>";
		
		
		
	HTMLString+="</tr>";
	
	
	for (var i in Results){
		HTMLString+="<tr>";
		
		HTMLString+="<td>"+ Math.round(100*Results[i].Score)/100 +"</td>";
		HTMLString+="<td>"+ Results[i].ID +"</td>";
		HTMLString+="<td>"+ Results[i].FirstName +"</td>";
		HTMLString+="<td>"+ Results[i].LastName +"</td>";
		HTMLString+="<td>"+ Results[i].DOB +"</td>";
		
		
		HTMLString+="<td style='background-color: #ddf;'>"+ FP.Phone[FPNum] +"</td>";
		HTMLString+="<td style='background-color: #ddf;'>"+ FP.Mobile[FPNum] +"</td>";
		HTMLString+="<td style='background-color: #ddf;'>"+ FP.Email[FPNum] +"</td>";
		
		
		
		HTMLString+="<td>"+ Results[i].Address +"</td>";
		HTMLString+="<td>"+ Results[i].Suburb +"</td>";
		HTMLString+="<td>"+ Results[i].Postcode +"</td>";
		
		
		
		HTMLString+="</tr>";
	}
	
	HTMLString+="</table>\n";
	
	
	ElementToChange.innerHTML=HTMLString;
}



var LastNameAndDOB= function(FPNum, AECCount){
	if (FP.LastNameSimp[FPNum]===AEC.LastNameSimp[AECCount] &&  FP.DOB[FPNum]===AEC.DOB[AECCount] ){
		return true;
	}
	return false;
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function FindScoreAndDisplayPeople(SelectionFunction){
	
	
	var FPNum=Number(document.getElementById("FPIDBox").value);
	
	var Results=SearchPeopleScore(FPNum, SelectionFunction);
	
	console.log("Results for this search");
	console.log(Results);
	
	
	
	DisplayResults2(Results, FPNum);
	
	
}

function SearchPeopleScore(FPNum, SelectionFunction){
	
	var Results=[];
	for (var i in AEC.ID){
		var Score=SelectionFunction(FPNum, i);
		if (Score>0.00001){
			Rtemp={};
			
			// Store the results
			Rtemp.Count=i;
			Rtemp.ID=AEC.ID[i];
			
			//Store information that matches the data on files
			Rtemp.FirstName=AEC.FirstName[i];
			Rtemp.LastName=AEC.LastName[i];
			Rtemp.DOB=AEC.DOB[i];
			Rtemp.Address=AEC.Address[i];
			Rtemp.Suburb=AEC.Suburb[i];
			Rtemp.State=AEC.State[i];
			Rtemp.Postcode=AEC.Postcode[i];
			
			Rtemp.Score=Score;
			
			Results.push(Rtemp);
			
		}
	}
	
	
	var SortedResults=Results.sort(function(Resultsa, Resultsb) {return -Resultsa.Score + Resultsb.Score;});// descending score count
	
	return SortedResults;
}



var LastNameAndDOBScore= function(FPNum, AECCount){
	if (FP.LastNameSimp[FPNum]===AEC.LastNameSimp[AECCount] &&  FP.DOB[FPNum]===AEC.DOB[AECCount] ){
		Score=0;
		Score+=10*(FP.FirstName[FPNum].score(AEC.FirstName[AECCount], 0.5));
		Score+=FP.Address[FPNum].score(AEC.Address[AECCount], 0.5);
		Score+=FP.Suburb[FPNum].score(AEC.Suburb[AECCount], 0.5);
		Score+=FP.Postcode[FPNum].score(AEC.Postcode[AECCount], 0.5);
		Score+=FP.State[FPNum].score(AEC.State[AECCount], 0.5);
		
		return Score;
	}
	return 0;
}






function IncrementID(){
	var IDNumber=Number(document.getElementById("FPIDBox").value);
	console.log("Current ID value is: "+IDNumber);
	if (isNaN(IDNumber)){
	console.log("ID was NaN");
		document.getElementById("FPIDBox").value=0;
	}
	else{
		document.getElementById("FPIDBox").value=Math.floor(IDNumber+1);
	}
}