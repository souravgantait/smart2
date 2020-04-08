function getA1Cdata() {
  ////////////////
  //render current patient
  fetchPatientData()
  .then(
    function (pt) {
      // var patientInfo = [];
      // var patientInfo = [];
      var given = pt.name[0].given[0];
      var family = pt.name[0].family;
      var birthDate = pt.birthDate;
      var addressLine = pt.address[0].line[0];
      var table = document.getElementById("patientInfoTable");

      var header = table.createTHead();
      var header_row = header.insertRow(0);
      var header_cell1 = header_row.insertCell(0);
      var header_cell2 = header_row.insertCell(1);
      var header_cell3 = header_row.insertCell(2);
      var header_cell4 = header_row.insertCell(3);
      header_cell1.innerHTML = "<b>Name</b>";
      header_cell2.innerHTML = "<b>Family Name</b>";
      header_cell3.innerHTML = "<b>Birth Date</b>";
      header_cell4.innerHTML = "<b>Address Line</b>";

      var row = table.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      cell1.innerHTML = given;
      cell2.innerHTML = family;
      cell3.innerHTML = birthDate;
      cell4.innerHTML = addressLine;
    },
    function (error) {
      document.getElementById("patientFN").innerText = error.stack;
    }
  );
  let container = document.getElementById('containerId'); let tblRow=null; let tblCell=null;tblRow = document.createElement('div');tblRow.classList.add('row'); tblCell = document.createElement('div');tblCell.className='col-sm-6';tblCell.setAttribute('style', 'padding: 40px;');tblRow.appendChild(tblCell);displayLine(tblCell,'Observation','VITAL SIGN (BMI)');; tblCell = document.createElement('div');tblCell.className='col-sm-6';tblCell.setAttribute('style', 'padding: 40px;');tblRow.appendChild(tblCell);displayBarChart(tblCell,'Observation','LAB (Createnine)');;container.appendChild(tblRow);tblRow = document.createElement('div');tblRow.classList.add('row'); tblCell = document.createElement('div');tblCell.className='col-sm-6';tblCell.setAttribute('style', 'padding: 40px;');tblRow.appendChild(tblCell);displayTable(tblCell,'Procedure','Text|Status|PerformedPeriodEnd|PerformedPeriodstart');; tblCell = document.createElement('div');tblCell.className='col-sm-6';tblCell.setAttribute('style', 'padding: 40px;');tblRow.appendChild(tblCell);displayTreeView(tblCell,'MedicationRequest','Text|Status|Intent');;container.appendChild(tblRow);
}

function displayBarChart(container, type, params) {
var paramList = params.split("|");

var loincCode = "29463-7";
if (paramList[0] == 'LAB (Createnine)') {
  loincCode = '38483-4'
}
if (paramList[0] == 'Vital Sign (Weight)') {
  loincCode = "29463-7";
}

var maxCount = 10;
var graphType = "bar";
var chartTitle = type + "-" + paramList[0];

QueryPatientDataWithCode(type, loincCode, 10)
  .then(function (fhirObservations) {
    //  var procedureInfoChart = document.getElementById(container);
    var procedureInfoChartDiv = document.createElement("div");
    container.append(procedureInfoChartDiv);
    var statusHeading = document.createElement("h1");
    statusHeading.setAttribute("id", "status");

    procedureInfoChartDiv.appendChild(statusHeading);
    var chartDiv = document.createElement("div");
    chartDiv.setAttribute("id", "chart");
    chartDiv.setAttribute("style", "width:600px;height:400px; padding-left:30px;");
    procedureInfoChartDiv.appendChild(chartDiv);
    var dates = [];
    var values = [];

    (fhirObservations.data.entry || []).forEach(function (a1c) {
      var date = a1c.resource.effectiveDateTime;
      var value =
        a1c.resource.valueQuantity && a1c.resource.valueQuantity.value;
      if (date && value && dates.indexOf(date) == -1) {
        dates.push(date);
        values.push(Math.round(value * 10) / 10);
      }
    });

    if (values.length === 0)
      return (statusHeading.innerHTML = "No observations found.");

    statusHeading.setAttribute("style", "display: none");

    Plotly.newPlot(chartDiv, {
      data: [
        {
          x: dates,
          y: values,
          type: graphType
        }
      ],
      layout: {
        title: chartTitle,
        xaxis: { type: "date", tickformat: "%m/%d/%y", tickangle:-90 },
        yaxis: { range: [0, 10] }
      },
      config: {
        displayModeBar: false
      }
    });
  });
}

function displayLine(container, type, params) {
var paramList = params.split("|");

var loincCode = "39156-5";
if (paramList[0] == 'LAB (Createnine)') {
  loincCode = '38483-4'
}
if (paramList[0] == 'Vital Sign (Weight)') {
  loincCode = "39156-5";
}

var maxCount = 10;

/////////////
var chartTitle = type + "-" + paramList[0];
  QueryPatientDataWithCode(type, loincCode, 10)
  .then(function (fhirObservations) {
    //var medInfoChart = document.getElementById("container");
    var medInfoChartDiv = document.createElement("div");
    // medInfoChartDiv.setAttribute("style", "border-style: groove;");
    container.append(medInfoChartDiv);
    var statusCHeading = document.createElement("h1");
    statusCHeading.setAttribute("id", "statusC");
    medInfoChartDiv.appendChild(statusCHeading);
    var chartCDiv = document.createElement("div");
    chartCDiv.setAttribute("id", "chartC");
    chartCDiv.setAttribute(
      "style",
      "width:600px;height:400px;padding-left:30px;"
    );
    medInfoChartDiv.appendChild(chartCDiv);

    var dates = [];
    var values = [];
    (fhirObservations.data.entry || []).forEach(function (a1c) {
      var date = a1c.resource.effectiveDateTime;
      var value =
        a1c.resource.valueQuantity && a1c.resource.valueQuantity.value;
      if (date && value && dates.indexOf(date) == -1) {
        dates.push(date);
        values.push(Math.round(value * 10) / 10);
      }
    });

    if (values.length === 0)
      return (statusCHeading.innerHTML =
        "No observations found.");

    statusCHeading.style.display = "none";

    Plotly.newPlot(chartCDiv, {
      data: [
        {
          x: dates,
          y: values,
          type: "line"
        }
      ],
      layout: {
        title: chartTitle,
         xaxis: { type: "date", tickformat: "%m/%d/%y", tickangle:-90 },
        yaxis: { range: [0, 100] }
      },
      config: {
        displayModeBar: false
      }
    });
  });
}

function displayTable(container, type, params) {
var paramList = params.split("|");
// get medication information
QueryPatientData(type, 10)
  .then(function (fhirmed) {

    if (type == 'MedicationRequest') {
      var values = [];
      var arrStatus = [];
      var intents = [];

      (fhirmed.data.entry || []).forEach(function (med) {
        var value = med.resource.medicationCodeableConcept.text;
        var status = med.resource.status;
        var intent = med.resource.intent;
        values.push(value);
        arrStatus.push(status);
        intents.push(intent);
      });
      var count = 1;
      // var valuesStringify = JSON.stringify(values, null, 4);

      //var medInfoTable = document.getElementById("container");
      var medInfoTableDiv = document.createElement("div");
      medInfoTableDiv.setAttribute("class", "row");
      container.appendChild(medInfoTableDiv);
      var medInfoHeading = document.createElement("h4");

      medInfoHeading.setAttribute(
        "style",
        "padding-left:30px; color: black;"
      );
      medInfoHeading.textContent = "Medication Information: ";
      medInfoTableDiv.appendChild(medInfoHeading);
      container.appendChild(medInfoTableDiv);

      var innerDiv = document.createElement("div");
      innerDiv.setAttribute("id", "medicationInformationTable");
      innerDiv.setAttribute("class", "row");
      // innerDiv.setAttribute("style", "padding-left:30px");
      container.appendChild(innerDiv);
      var table = document.createElement("table");
      var row1 = table.insertRow(-1);
      var header = table.createTHead();
      var header_row = header.insertRow(0);
      var header_cell1 = header_row.insertCell(0);
      var header_cell2 = header_row.insertCell(1);
      var header_cell3 = header_row.insertCell(2);
      var header_cell4 = header_row.insertCell(3);
      header_cell1.innerHTML = "<b>SL No.</b>";
      header_cell2.innerHTML = "<b>Text</b>";
      header_cell3.innerHTML = "<b>Status</b>";
      header_cell4.innerHTML = "<b>Intent</b>";

      for (var i = 0; i < values.length; i++) {
        var row = table.insertRow(-1);
        var firstCell = row.insertCell(-1);
        firstCell.appendChild(document.createTextNode(count));
        count++;
        var secondCell = row.insertCell(-1);
        secondCell.appendChild(document.createTextNode(values[i]));
        var thirdCell = row.insertCell(-1);
        thirdCell.appendChild(document.createTextNode(arrStatus[i]));
        var fourthCell = row.insertCell(-1);
        fourthCell.appendChild(document.createTextNode(intents[i]));
      }
      innerDiv.appendChild(table);
    }
    if (type == 'Procedure') {
      var texts = [];
      var multipleStatus = [];
      var startPerformedPeriods = [];
      var endPerformedPeriods = [];

      (fhirmed.data.entry || []).forEach(function (med) {

        var text = med.resource.code.text;
        var status = med.resource.status;
        var startPerformedPeriod = med.resource.performedPeriod.start;
        var endPerformedPeriod = med.resource.performedPeriod.end;

        texts.push(text);
        multipleStatus.push(status);
        startPerformedPeriods.push(startPerformedPeriod);
        endPerformedPeriods.push(endPerformedPeriod);
      });

      var count = 1;
      // var valuesStringify = JSON.stringify(values, null, 4);

      //var medInfoTable = document.getElementById("container");
      var medInfoTableDiv = document.createElement("div");
      medInfoTableDiv.setAttribute("class", "row");
      container.appendChild(medInfoTableDiv);
      var medInfoHeading = document.createElement("h4");

      medInfoHeading.setAttribute(
        "style",
        "padding-left:30px; color: black;"
      );
      medInfoHeading.textContent = "Procedure Information: ";
      medInfoTableDiv.appendChild(medInfoHeading);
      container.appendChild(medInfoTableDiv);

      var innerDiv = document.createElement("div");
      innerDiv.setAttribute("id", "medicationInformationTable");
      innerDiv.setAttribute("class", "row");
      // innerDiv.setAttribute("style", "padding-left:30px");
      container.appendChild(innerDiv);
      var table = document.createElement("table");
      var row1 = table.insertRow(-1);
      var header = table.createTHead();
      var header_row = header.insertRow(0);
      var header_cell1 = header_row.insertCell(0);
      var header_cell2 = header_row.insertCell(1);
      var header_cell3 = header_row.insertCell(2);
      var header_cell4 = header_row.insertCell(3);
      var header_cell5 = header_row.insertCell(4);
      header_cell1.innerHTML = "<b>SL No.</b>";
      header_cell2.innerHTML = "<b>Text</b>";
      header_cell3.innerHTML = "<b>Status</b>";
      header_cell4.innerHTML = "<b>Performed Period Start</b>";
      header_cell5.innerHTML = "<b>Performed Period End</b>";

      for (var i = 0; i < multipleStatus.length; i++) {
        var row = table.insertRow(-1);
        var firstCell = row.insertCell(-1);
        firstCell.appendChild(document.createTextNode(count));
        count++;
        var secondCell = row.insertCell(-1);
        secondCell.appendChild(document.createTextNode(texts[i]));
        var thirdCell = row.insertCell(-1);
        thirdCell.appendChild(document.createTextNode(multipleStatus[i]));
        var fourthCell = row.insertCell(-1);
        fourthCell.appendChild(document.createTextNode(startPerformedPeriods[i]));
        var fifthCell = row.insertCell(-1);
        fifthCell.appendChild(document.createTextNode(endPerformedPeriods[i]));
      }
      innerDiv.appendChild(table);;
    }
  });
}
function displayTreeView(container, type, params, maxCount) {
var paramList = params.split("|");
QueryPatientData(type, 10)
  .then(function (fhirmed) {
    //var treeViewDiv = document.getElementById("container");
    var treeViewHeadingDiv = document.createElement("div");
    treeViewHeadingDiv.setAttribute("class", "row");
    var treeViewHeading = document.createElement("h4");
    treeViewHeading.setAttribute(
      "style",
      "color:black; padding-left:60px;"
    );
    treeViewHeading.textContent = "Medication Information: ";
    treeViewHeadingDiv.appendChild(treeViewHeading);
    container.appendChild(treeViewHeadingDiv);

    var ulElement = document.createElement("ul");
    container.appendChild(ulElement);

    (fhirmed.data.entry || []).forEach(function (med) {
      var value = med.resource.medicationCodeableConcept.text;
      var status = med.resource.status;
      var intent = med.resource.intent;
      var liElement = document.createElement("li");
      ulElement.appendChild(liElement);
      var liSpan = document.createElement("span");
      liSpan.setAttribute("class", "caret");
      liSpan.textContent = value;
      liSpan.addEventListener("click", function () {
        this.parentElement
          .querySelector(".nested")
          .classList.toggle("active");
        this.classList.toggle("caret-down");
      });

      liElement.appendChild(liSpan);

      var nestedUlElement = document.createElement("ul");
      nestedUlElement.setAttribute("class", "nested");
      liElement.appendChild(nestedUlElement);

      var statusLi = document.createElement("li");
      var intentLi = document.createElement("li");
      var statusText = document.createTextNode(status);
      var intentText = document.createTextNode(intent);
      nestedUlElement.appendChild(statusLi);
      nestedUlElement.appendChild(intentLi);
      var statustextnode = document.createTextNode("Status: ");
      statusLi.appendChild(statustextnode);
      statusLi.appendChild(statusText);
      var intenttextnode = document.createTextNode("Intent: ");
      intentLi.appendChild(intenttextnode);
      intentLi.appendChild(intentText);
    });
  });
}