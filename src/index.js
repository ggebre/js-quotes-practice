document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.querySelector("#quote-list")
    const newQuoteForm = document.querySelector("#new-quote-form")
    const inputs = document.querySelectorAll(".form-control")
    // const sortButton = document.querySelector("#sort-button")

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
            renderAllQuotes()
        }
        if(event.target.className == "btn-success"){
            likeQuoteById(id)
            .then(resp => resp.json())
            // .then(renderAllQuotes())
            renderAllQuotes()
        }
        
        if(event.target.className == "btn-warning"){
            // display a hidden form below each
            
            const editForm = document.querySelector(`#form-${id}`)
            fetchQueteById(id)
            .then(quoteObj => {
                editForm.innerHTML = renderEditFormInputsOfAQuote(quoteObj)
            })

            editForm.addEventListener('submit', event => {
                const quote = event.target.quote.value
                const author = event.target.author.value

                updateQueteById(id, {quote, author})
                .then(resp => resp.json())
                .then(quoteObj => console.log(quoteObj))

                editForm.innerHTML = ""
                event.preventDefault()
            },false)
            
            
        }
        // renderAllQuotes()
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
        <button class='btn-warning'data-id=${id}>Edit</button> <br>
        <form id=form-${id} action=# method=POST>
            
        </form>
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
    function fetchQueteById(id){
        return fetch(`http://localhost:3000/quotes/${id}`)
        .then(resp => resp.json())
    }

    function updateQueteById(id, updatedQuete){
        return fetch(`http://localhost:3000/quotes/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
              },
              body: JSON.stringify(updatedQuete)
        })
    }
    function renderEditFormInputsOfAQuote({quote, author}){
        
        return `<div class="form-group">
                <label for="new-quote">Quote</label>
                <textarea name="quote"  class="form-control" id="new-quote" > ${quote} </textarea>
            </div>
            <div class="form-group">
                <label for="Author">Author</label>
                <textarea name="author"  class="form-control" id="author" > ${author} </textarea>
            </div>
    <button type="submit" class="btn btn-primary">Edit</button>`
    }


    
})