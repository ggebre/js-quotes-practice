document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.querySelector("#quote-list")
    const newQuoteForm = document.querySelector("#new-quote-form")
    const inputs = document.querySelectorAll(".form-control")
    let newQuote = {likes: "0"}

    renderAllQuotes()
    newQuoteForm.addEventListener('submit', (event) => {
        for(const input of inputs){
            newQuote[input.name] = input.value 
        }
        // create New quote 
        
        createNewQuote(newQuote)
        .then(resp => resp.json())
        .then(newQuoteObj => {
            // render all quotes 
            quoteList.innerHTML += displayQuete(newQuoteObj)
        })

        event.preventDefault();
    }, false)

    quoteList.addEventListener('click', (event)=>{
        const id = event.target.dataset.id 
        if (event.target.className == "btn-danger") {
            
            deleteQuoteById(id)
            // .then(renderAllQuotes())
        }
        if(event.target.className == "btn-success"){
            likeQuoteById(id)
            .then(resp => resp.json())
            // .then(renderAllQuotes())
        }
        renderAllQuotes()
    })
    function deleteQuoteById(id){
        return fetch(`http://localhost:3000/quotes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
              }
        })
    } 
    function likeQuoteById(id){
        return fetch(`http://localhost:3000/likes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
              },
              body: JSON.stringify({
                  quoteId: parseInt(id),
                  createdAt: Date.now()
              })
        })
    }
    function renderAllQuotes() {
        quoteList.innerHTML = ""
        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(resp => resp.json())
        .then(quoteObjs => {
            quoteObjs.forEach(quoteObj => {
                quoteList.innerHTML += displayQuete(quoteObj)
            }) 

        })
    
    }
    
    function displayQuete({author, quote, likes, id}) {
        return `
        <li class='quote-card'>
      <blockquote class="blockquote">
        <p class="mb-0">${quote}</p>
        <footer class="blockquote-footer">${author}</footer>
        <br>
        <button class='btn-success' data-id=${id}>Likes: <span>${likes.length}</span></button>
        <button class='btn-danger'data-id=${id}>Delete</button>
      </blockquote>
    </li> 
        `
    } 

    function createNewQuote(quoteObj){
        return fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
              },
              body: JSON.stringify(quoteObj)
        })
    }
    
})