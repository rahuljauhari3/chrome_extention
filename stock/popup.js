document.getElementById('search').addEventListener('click', function() {  
    const ebita = document.getElementById('ebita').value;  
    const pat = document.getElementById('pat').value;  
    const cager = document.getElementById('cager').value;  
  
    // Here you can implement your logic to fetch and display stock data  
    const resultsDiv = document.getElementById('results');  
    resultsDiv.innerHTML = `  
        <p>EBITA: ${ebita}%</p>  
        <p>PAT: ${pat}%</p>  
        <p>CAGER: ${cager}%</p>  
        <p>Results will be displayed here.</p>  
    `;  
});  
