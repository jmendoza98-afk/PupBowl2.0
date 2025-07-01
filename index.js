const BASE_URL = "https://fsa-puppy-bowl.herokuapp.com/api";
const cohort = '/2503-example';
const ENDPOINT = BASE_URL + cohort;

let puppies = [];
let selectedPuppy;


async function getPuppies() { 
    try{
        const response = await fetch(ENDPOINT + '/players');
        const result = await response.json();
        puppies = result.data.players;
        render();
    } catch (error) {
        console.log(error);
    }
}

async function getSinglePuppy(id) {
    try {
        const response = await fetch(ENDPOINT + '/players/' + id);
        const result = await response.json()
        selectedPuppy = result.data.player;
        render();
    } catch(error) {
        console.log(error);
    }
}

async function removePlayer(id){
    try {
        await fetch(ENDPOINT + '/players/' + id, 
            {method: "DELETE"}
        );
        selectedPuppy = undefined
        getPuppies();
    } catch (error) {
        console.log(error)
    }
}

async function addPlayer(puppyData) {
    try {
        await fetch (ENDPOINT + '/players', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(puppyData),
        } )
        getPuppies();
    } catch (error) {
        console.log(error)
    }
}


function doggy(){
    const $ul = document.createElement('ul');
    $ul.classList.add('doggy');
    const $puppies = puppies.map((pup) => {
        const $li = document.createElement('li')
        $li.innerHTML =
        `
        <a href="#details">
            <figure class='avatar'>
                <img src="${pup.imageURL}" alt="Picture of ${pup.name}"/>
            </figure>
            <span>${pup.name}</span>
        </a>
        
        `;
        $li.addEventListener('click', ()=> getSinglePuppy(pup.id));
        return $li;
    });
    $ul.replaceChildren(...$puppies);
    console.log('ul', $ul)  
    return $ul;
}

function puppyDetails() {
    if (!selectedPuppy) {
        const $p = document.createElement('p');
        $p.textContent = 'Please select a pup for more details.';
        return $p;
    }

    const $details = document.createElement('section');
    $details.classList.add('details');

    $details.innerHTML = 
    `
    <figure>
    <img 
    src="${selectedPuppy.imageURL}"
    alt="Picture of ${selectedPuppy.name}"
    />
    </figure>
    <div>
        <dl>
            <div> <dt> Name: </dt> <dd>${selectedPuppy.name}</dd> </div>
            <div> <dt> Id: </dt> <dd>${selectedPuppy.id}</dd> </div>
            <div> <dt> Breed: </dt> <dd>${selectedPuppy.breed}</dd> </div>
            <div> <dt> Status: </dt> <dd>${selectedPuppy.status}</dd> </div>
            <button>Delete Player</button>
        </dl>
    </div>

    `;

    const $deleteBtn = $details.querySelector('button');
    $deleteBtn.addEventListener('click', () => removePlayer(selectedPuppy.id))
    return $details;
}

function newPupForm() {
    const $form = document.createElement('form');
    $form.innerHTML = `
    <label>
    Name
    <input name="name" required />
    </label>

    <label>
    Breed
    <input name="breed" required />
    </label>

    <label>
    Status
    <select name="status">
    <option value="bench">Bench</option>
    <option value="field">Field</option>
    </select>
    </label>

    <label>
    Image
    <input name="imageURL" required />
    </label>

    <button>Add a Player</button>
    
    `;

    $form.addEventListener('submit', (event) =>{
        event.preventDefault();
        const data = new FormData($form)
        const imageURL = data.get('imageURL');

        addPlayer({
            name: data.get('name'),
            breed: data.get('breed'),
            status: data.get('status'),
            imageURL: imageURL.length > 0 ? imageURL : undefined
        })
    })
    return $form;
}

function render(){
    const $app = document.querySelector('#app');
    $app.innerHTML = `
<h1>Puppy Bowl</h1>
<main >
    <section id='doggy'>
    <h2 Puppies</h2>
    <Puppies></Puppies>
    <h3>Invite Player</h3>
    <PlayerForm></PlayerForm>
    </section>

    <section id='details'>
    <h2>Selected Pup</h2>
    <ShowcasedPup></ShowcasedPup>
    </section>

</main>
    `;
    $app.querySelector('PlayerForm').replaceWith(newPupForm());
    $app.querySelector('Puppies').replaceWith(doggy());
    $app.querySelector('ShowcasedPup').replaceWith(puppyDetails())
}

async function init() {
    await getPuppies();
    render();
}

init();