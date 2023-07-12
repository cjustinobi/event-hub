pub contract EventHub {
  pub let publicPath: PublicPath
  pub let privatePath: StoragePath

  pub resource TheEvent {
    // The unique ID that differentiates each Tweet
    pub let id: UInt64

    // String mapping to hold metadata
    // pub var detail: {String: String}
    pub let details: Details

    // Initialize both fields in the init function
    init(title: String, limit: UInt64) {
      self.id = self.uuid
      self.details = Details(title: title, limit: limit)
  
    }
  }

    pub struct Details {
        pub let title: String
        pub let limit: UInt64

        init(title: String, limit: UInt64) {
            self.title = title
            self.limit = limit
        }
    }

   // Function to create a new Tweet
    pub fun createEvent(_ title: String, _ limit: UInt64): @TheEvent {
        return <-create TheEvent(title: title, limit: limit)
    }

    pub resource interface CollectionPublic {
        pub fun getIDs(): [UInt64]
        pub fun borrowTheEvent(id: UInt64): &TheEvent? 
    }

    // NEW! 
    // Declare a Collection resource that contains Tweets.
    // it does so via `saveTweet()`, 
    // and stores them in `self.tweets`
    pub resource Collection: CollectionPublic {
        // an object containing the tweets
        pub var theEvents: @{UInt64: TheEvent}

        // a method to save a tweet in the collection
        pub fun saveEvent(theEvent: @TheEvent) {
            // add the new tweet to the dictionary with 
            // a force assignment (check glossary!)
            // If there were to be a value at that key, 
            // it would fail/revert. 
            self.theEvents[theEvent.id] <-! theEvent
        }

        // get all the id's of the tweets in the collection
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
            // we need to explicitly destroy the tweets too.
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