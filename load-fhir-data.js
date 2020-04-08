var _client = null;

function showError(error) {
  var statusDivC = document.getElementById("statusC");
  return (statusDivC.innerHTML = "An error occurred connecting to the EHR");
}

function QueryPatientData(type, maxcount) {
  return _client.patient.api
    .search({
      type: [type], //MedicationRequest   in SMART app  , MedicationStatement in Cerner app
      query: {
        "_sort:desc": "date",
        _count: [maxcount]
      }
    });
}

function QueryPatientDataWithCode(type, loincCode, maxcount) {
  return _client.patient.api
    .search({
      type: [type],
      query: {
        code: [loincCode],
        "_sort:desc": "date",
        _count: [maxcount]
      }
    });
}

function fetchPatientData() {
  return _client.patient.read();
}

function onReady(client) {
  _client = client;
  getA1Cdata();
}

FHIR.oauth2.ready(onReady, showError);