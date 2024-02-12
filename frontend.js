async function submitForm() {
    console.log("indside script");
    const username = document.getElementById('username').value;
    const password = md5(document.getElementById('password').value);

    if(!username || !password){
      alert("Please enter username and password");
      return;
    }
  
    await fetch('https://ocs-recuitment-project.onrender.com/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(async(response) => await response.json())
    .then(data => {

      const resultBody = document.getElementById('result-body');
      const form = document.getElementById('form');
      const result = document.getElementById('result');
      const button = document.getElementById('fetch_again');
      

      data.forEach(user => {
        const row = resultBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
  
        cell1.textContent = user.userid;
        cell2.textContent = user.password_hash;
        cell3.textContent = user.role;
      });
      
      button.style.display = 'flex';
      result.style.display = 'flex';
      form.style.display = 'none';
    })
    .catch(error => console.error('Fetch error:', error));
  }
