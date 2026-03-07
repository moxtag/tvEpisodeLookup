document.querySelector('button').addEventListener('click', getShow)
document.querySelector('.reset').addEventListener('click', reset)

function getShow() {

    document.querySelector('h1').classList.toggle('hidden')
    document.querySelector('h2').classList.toggle('hidden')
    document.querySelector('button').classList.toggle('hidden')
    document.querySelector('input').classList.toggle('hidden')
    document.querySelector('.reset').classList.toggle('hidden')

    let show = document.querySelector('input').value
    let url = `https://api.tvmaze.com/search/shows?q=${show}`

    fetch (url) 
    .then(res => res.json())
    .then (data => {
        // input image and summary of show
        document.querySelector('img').src = data[0].show.image.medium
        document.querySelector('.summary').innerHTML = data[0].show.summary
        
        // get seasons for show
        let showID = data[0].show.id
        let seasonsRef = `https://api.tvmaze.com/shows/${showID}/seasons`
        fetch(seasonsRef)
            .then(seasonsRes => seasonsRes.json())
            .then(seasonsData => { 

                 // used to make fetch call for episodes, each element = seasonID
                 let seasonIDs = []

                 // make season headings, make ordered lists to add episodes to
                 for (let season in seasonsData) {
                    let seasonNumber = seasonsData[season].number
                    let seasonHeading = document.createElement('h3')
                    let seasonList = document.createElement('ol')
                    seasonList.classList.add(`s${seasonNumber}`)

                    seasonHeading.innerText = `Season ${seasonNumber}`
                    document.querySelector('section').append(seasonHeading)
                    document.querySelector('section').append(seasonList)

                    // get seasonIDs for next fetch
                    seasonIDs.push(seasonsData[season].id)
                 }

                // get episodes for each season
                let season = 0;
                seasonIDs.forEach(id => {
                    season++;
                     let episodesRef = `https://api.tvmaze.com/seasons/${id}/episodes`
                     let addToList = document.querySelector(`.s${season}`)
                     fetch (episodesRef)
                        .then(episodesRes => episodesRes.json())
                        .then(episodesData => {
                            for (let episode in episodesData) {
                                let listItem = document.createElement('li')
                                listItem.innerText = episodesData[episode].name 
                                addToList.append(listItem)
                            }
                        })
                        .catch(err => `error ${err}`)
                })
                
            })
        .catch(err => console.log(`error ${err}`))
    })

    .catch(err => console.log(`err ${err}`))

}


function reset() {
    document.querySelector('input').value = ''
    document.querySelector('section').innerText = ''
    document.querySelector('img').src = ''
    document.querySelector('.summary').innerText = ''
    document.querySelector('h1').classList.toggle('hidden')
    document.querySelector('h2').classList.toggle('hidden')
    document.querySelector('button').classList.toggle('hidden')
    document.querySelector('input').classList.toggle('hidden')
    document.querySelector('.reset').classList.toggle('hidden')
}