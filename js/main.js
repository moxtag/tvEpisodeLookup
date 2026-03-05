document.querySelector('button').addEventListener('click', getShow)

function getShow() {

    // reset()

    let show = document.querySelector('input').value
    // let show = 'Last of Us'
    let url = `https://api.tvmaze.com/search/shows?q=${show}`

    fetch (url) 
    .then(res => res.json())
    .then (data => {
        // input image and summary of show
        document.querySelector('img').src = data[0].show.image.medium
        document.querySelector('.summary').innerText = replaceTags(data[0].show.summary)
        
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
                    seasonHeading.append(seasonList)

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
                            console.log(episodesData, 'episodes')
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

// get rid of HTML tags passed in with API, but mainting styling

/***
 * TODO
 * fix so html tags in data returned is integerated w/ site
 */

function reset() {
    document.querySelector('h3').remove()
}

function replaceTags(str) {
    let newString = str.replaceAll('<p>', '\n')
    return newString.replaceAll('</p>', '\n')
}