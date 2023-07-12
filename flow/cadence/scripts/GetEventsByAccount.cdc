import EventHub from 0xf8d6e0586b0a20c7

pub struct EventDetails {
    pub let id: UInt64
    pub let message: String 

    init(id: UInt64, message: String) {
        self.id = id
        self.message = message
    }
}

// Get tweets owned by an account
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
        let metadata = EventDetails(id: event.id, message: event.detail["message"]!)
        events.append(metadata)
    }

    return events
}