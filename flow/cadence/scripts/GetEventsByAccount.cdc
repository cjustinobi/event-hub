import EventHub from 0xf8d6e0586b0a20c7
// import EventHub from 0x92e7bdd682b677ee

pub struct EventDetails {
    pub let id: UInt64
    pub let title: String
    pub let limit: UInt64

    init(id: UInt64, title: String, limit:  UInt64) {
        self.id = id
        self.title = title
        self.limit = limit
    }
}

// Get events owned by an account
pub fun main(account: Address): [EventDetails] {
    // Get the public account object for account
    let eventOwner = getAccount(account)

    // Find the public capability for their Collection
    let capability = eventOwner.getCapability<&{EventHub.CollectionPublic}>(EventHub.publicPath)

    // borrow a reference from the capability
    let publicRef = capability.borrow()
            ?? panic("Could not borrow public reference")

    // get list of tweet IDs
    let eventIDs = publicRef.getIDs()

    let events: [EventDetails] = []

    for eventID in eventIDs {
        let event = publicRef.borrowTheEvent(id: eventID) ?? panic("this tweet does not exist")
        let details = EventDetails(id: event.id, title: event.details.title, limit: event.details.limit!)
        events.append(details)
    }

    return events
}