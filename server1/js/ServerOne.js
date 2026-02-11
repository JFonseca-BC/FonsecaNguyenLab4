  const API_URL = "https://fonsecanguyenlab4.onrender.com"; 

        // 1. Fetch Text Definitions on Load
        document.addEventListener('DOMContentLoaded', () => {
            fetch(API_URL + '/definitions')
                .then(res => res.json())
                .then(data => {
                    document.getElementById('header').innerText = data.header;
                    document.getElementById('insertBtn').innerText = data.insertButton;
                    document.getElementById('queryTitle').innerText = data.queryTitle;
                    document.getElementById('submitBtn').innerText = data.submitQueryButton;
                    document.getElementById('responseTitle').innerText = data.responseTitle;
                    document.getElementById('sqlQuery').placeholder = data.queryPlaceholder;
                    document.title = data.title;
                })
                .catch(err => console.error("Error loading definitions:", err));
        });

        // 2. Button Functions
        function insertData() {
            fetch(API_URL + '/insert', { method: 'POST' })
            .then(res => res.json())
            .then(data => displayResponse(data))
            .catch(err => displayError("Error: " + err));
        }

        function runQuery() {
            const query = document.getElementById('sqlQuery').value;
            const encodedQuery = encodeURIComponent(query);
            
            fetch(API_URL + '/sql?query=' + encodedQuery, { method: 'GET' })
            .then(res => res.json())
            .then(data => displayResponse(data))
            .catch(err => displayError("Error: " + err));
        }

        //Display Response as Table or Message
        function displayResponse(data) {
            const responseArea = document.getElementById('responseArea');
            
            if (data.error) {
                responseArea.innerHTML = `<div class="error-message">${data.error}</div>`;
                return;
            }
            
            if (data.success && data.message) {
                responseArea.innerHTML = `<div class="success-message">${data.message}</div>`;
                return;
            }
            
            if (data.success && data.data && Array.isArray(data.data)) {
                if (data.data.length === 0) {
                    responseArea.innerHTML = '<div class="info-message">No results found.</div>';
                    return;
                }
                
                let tableHTML = '<table class="result-table"><thead><tr>';
                
                const headers = Object.keys(data.data[0]);
                for (let i = 0; i < headers.length; i++) {
                    tableHTML += `<th>${headers[i]}</th>`;
                }
                tableHTML += '</tr></thead><tbody>';
                
                for (let i = 0; i < data.data.length; i++) {
                    tableHTML += '<tr>';
                    for (let j = 0; j < headers.length; j++) {
                        let val = data.data[i][headers[j]];
                        if (val instanceof Date || (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/))) {
                            val = new Date(val).toLocaleDateString();
                        }
                        tableHTML += `<td>${val !== null ? val : 'NULL'}</td>`;
                    }
                    tableHTML += '</tr>';
                }
                
                tableHTML += '</tbody></table>';
                responseArea.innerHTML = tableHTML;
                return;
            }
            
            responseArea.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }

        function displayError(message) {
            document.getElementById('responseArea').innerHTML = 
                `<div class="error-message">${message}</div>`;
        }