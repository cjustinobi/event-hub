pub contract EventHub {
  pub let publicPath: PublicPath
  pub let privatePath: StoragePath

  pub resource TheEvent {
    // The unique ID that differentiates each Event
    pub let id: UInt64

    pub let details: Details

    // Initialize both fields in the init function
    init(title: String, limit: UInt64, startTime: UInt128, description: String, imagePath: String) {
      self.id = self.uuid
      self.details = Details(title: title, limit: limit, startTime: startTime, description: description, imagePath: imagePath)
  
    }
  }

    pub struct Details {
        pub let title: String
        pub let limit: UInt64
        pub let startTime: UInt128
        pub let description: String
        pub let imagePath: String

        init(title: String, limit: UInt64, startTime: UInt128, description: String, imagePath: String) {
            self.title = title
            self.limit = limit
            self.startTime = startTime
            self.description = description
            self.imagePath = imagePath
        }
    }

   // Function to create a new Event
    pub fun createEvent(_ title: String, _ limit: UInt64, _ startTime: UInt128, _ description: String, _ imagePath: String): @TheEvent {
        return <-create TheEvent(title: title, limit: limit, startTime: startTime, description: description, imagePath: imagePath)
    }

    pub resource interface CollectionPublic {
        pub fun getIDs(): [UInt64]
        pub fun borrowTheEvent(id: UInt64): &TheEvent? 
    }

    // NEW! 
    // Declare a Collection resource that contains events.
    // it does so via `saveEvent()`, 
    // and stores them in `self.events`
    pub resource Collection: CollectionPublic {
        // an object containing the events
        pub(set) var theEvents: @{UInt64: TheEvent}

        // a method to save a event in the collection
        pub fun saveEvent(theEvent: @TheEvent) {
            // add the new event to the dictionary with 
            // a force assignment (check glossary!)
            // If there were to be a value at that key, 
            // it would fail/revert. 
            self.theEvents[theEvent.id] <-! theEvent
        }

        // get all the id's of the events in the collection
        pub fun getIDs(): [UInt64] {
            return self.theEvents.keys
        }

        pub fun borrowTheEvent(id: UInt64): &TheEvent? {
            if self.theEvents[id] != nil {
                let ref = (&self.theEvents[id] as &EventHub.TheEvent?)!
                return ref
            }
            return nil
        }

        init() {
            self.theEvents <- {}
        }

        destroy() {
            // when the Colletion resource is destroyed, 
            // we need to explicitly destroy the events too.
            destroy self.theEvents
        }
    }

    // create a new collection
    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    init() {
        // assign the storage path to /storage/TweetCollection
        self.privatePath = /storage/TheEventCollection
        self.publicPath = /public/TheEventCollection
        // save the empty collection to the storage path
        self.account.save(<-self.createEmptyCollection(), to: self.privatePath)
        // publish a reference to the Collection in storage
        self.account.link<&{CollectionPublic}>(self.publicPath, target: self.privatePath)
    }

}