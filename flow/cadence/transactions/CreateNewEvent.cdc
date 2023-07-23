// Create new Tweet

// import EventHub from 0xf8d6e0586b0a20c7
import EventHub from 0x92e7bdd682b677ee

// This transaction creates a new tweet with an argument
transaction (title: String, limit: UInt64, startTime: UInt128, description: String, imagePath: String) {
    // Let's check that the account has a collection
    prepare(acct: AuthAccount) {
        if acct.borrow<&EventHub.Collection>(from: EventHub.privatePath) != nil {
            log("Collection exists!")
        } else {
            // let's create the collection if it doesn't exist
            acct.save<@EventHub.Collection>(<-EventHub.createEmptyCollection(), to: EventHub.privatePath)
            // publish a reference to the Collection in storage
            acct.link<&{EventHub.CollectionPublic}>(EventHub.publicPath, target: EventHub.privatePath)
        }

        // borrow the collection
        let collection = acct.borrow<&EventHub.Collection>(from: EventHub.privatePath)

        // call the collection's saveTweet method and pass in a Tweet resource
        collection?.saveEvent(theEvent: <-EventHub.createEvent(title, limit, startTime, description, imagePath))
        log("Event created successfully, with message ".concat(title))
    }
}