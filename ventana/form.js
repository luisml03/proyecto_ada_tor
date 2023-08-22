
const formA = document.getElementById('formT');

formA.addEventListener("submit", async function(event){
  event.preventDefault();
  
  const vs = formA.querySelector('#version').value;
  const sf = formA.querySelector('#sfversion').value;
  const ms = formA.querySelector('#message').value;

 
  // Crear un objeto con los datos a enviar
  const data = {
    version: vs,
    sfversion: sf,
    message: ms
   
  };

  try {
    const response = await fetch('http://localhost:3000/insertData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    console.log(responseData); // Respuesta desde el backend
    
  } catch (error) {
    console.error('Error al enviar datos al backend:', error);
  }

  formA.reset()
 

});

const search = document.querySelector('.search');
const bar = document.querySelector('.search-bar');
const btn = document.querySelector('.search-btn');

function activate() {
  search.classList.toggle('active');
  bar.value = '';
  setTimeout(() => bar.focus(),750)
}

btn.addEventListener('click',activate,false);
