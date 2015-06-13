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
	FPCSV=new CSVFile('./futurepartydata/fp.csv');
}



function LoadCSVData(){
	CreateAECVectors();
	CreateFPVectors();
	CreateFuzzyArrays();
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
	// var _nonWordRe = /[^\w, ]+/;
	// var simplified = '-' + value.toLowerCase().replace(_nonWordRe, '')
}

// Simplify names
function SimplifyNames(){
	
}
// http://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely

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





function DisplayResults(Results){
	var Ele=document.getElementById("SearchResults");
	Ele.innerHTML="Prob (%), ID, Name, Address<br>";
	
	for (var Count in Results){
	
		var PercentageMatch=Math.round(Results[Count][0] * 10000) / 100
	
		Ele.innerHTML+=""+PercentageMatch+"%         "+Results[Count][1]+"<br>";
	}
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