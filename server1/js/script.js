const API_URL = 'https://fonsecanguyenlab4.onrender.com'; 

function insertData() {
    fetch(API_URL + '/insert', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('responseArea').innerText = JSON.stringify(data, null, 2);
    })
    .catch(err => {
        document.getElementById('responseArea').innerText = "Error: " + err;
    });
}

function runQuery() {
    const query = document.getElementById('sqlQuery').value;
    // Send query via GET request
    const encodedQuery = encodeURIComponent(query);
    
    fetch(API_URL + '/sql?query=' + encodedQuery, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('responseArea').innerText = JSON.stringify(data, null, 2);
    })
    .catch(err => {
        document.getElementById('responseArea').innerText = "Error: " + err;
    });
}