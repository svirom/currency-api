// get a list of currencies via API
document.addEventListener('DOMContentLoaded', getData);

function getData() {
  
  const date = new Date();
  date.setDate(date.getDate()-1); // to prevent disability of currencies
  const dateYesterday = date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2);
  const currencyAPI = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dateYesterday}&json`;

  const xhr = new XMLHttpRequest();

  xhr.open('GET', currencyAPI, true);

  xhr.onload = function() {
    if (this.status === 200) {
      const response = JSON.parse(this.responseText);
      let currArr = [];
        
      for (let obj in response) {
        let option = document.createElement('option');

        currArr.push(response[obj]['txt']);
                
        document.getElementById('currSelect').append(option);
        option.setAttribute('value', response[obj]['cc']);
        option.innerHTML = `${response[obj]['txt']}`;
        document.getElementById('currSelect').append(option);
      }
      
      // get currency rate on required date (new request on click button)      
      document.getElementById('currSubmit').addEventListener('click', getCurrency);

      function getCurrency(e) {
        const currSelect = document.getElementById('currSelect');
        const currDate = document.getElementById('currDate');
        const selectValue = currSelect.options[currSelect.selectedIndex].value;
        const selectDate = currDate.value.replace(/-/g, '');
        const date = new Date();
        const dateToday = date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2);

        if (!selectValue) {
          document.getElementById('error-currency').classList.add('error');
        } else {
          document.getElementById('error-currency').classList.remove('error');
        }

        if (!selectDate || (selectDate > dateToday.replace(/-/g, ''))) {
          document.getElementById('error-date').classList.add('error');
        } else {
          document.getElementById('error-date').classList.remove('error');
        }

        const currencyAPI2 = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${selectDate}&json`;
                
        const xhr2 = new XMLHttpRequest();

        xhr2.open('GET', currencyAPI2, true);

        xhr2.onload = function() {
          if (this.status === 200) {
            const response = JSON.parse(this.responseText);
            
            document.getElementById('currName').innerHTML = '';
            document.getElementById('currValue').innerHTML = '';

            for (let obj in response) {
              if ( response[obj]['cc'] == selectValue ) {
                document.getElementById('currName').innerHTML = response[obj]['cc'];
                document.getElementById('currValue').innerHTML = response[obj]['rate'];
              }
            }

          }
        }

        xhr2.send();

        e.preventDefault();
      }
    
    }
  }

  xhr.send();

}

