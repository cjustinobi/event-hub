pub contract EventHub {
  pub let publicPath: PublicPath
  pub let privatePath: StoragePath

  pub resource interface Public {
    pub fun getName(): String
    pub fun getAvatar(): String
    pub fun getColor(): String
    pub fun getInfo(): String
    pub fun asReadOnly(): EventHub.ReadOnly
  }
  
  pub resource interface Owner {
    pub fun getName(): String
    pub fun getAvatar(): String
    pub fun getColor(): String
    pub fun getInfo(): String
    
    pub fun setName(_ name: String) {
      pre {
        name.length <= 15: "Names must be under 15 characters long."
      }
    }
    pub fun setAvatar(_ src: String)
    pub fun setColor(_ color: String)
    pub fun setInfo(_ info: String) {
      pre {
        info.length <= 280: "EventHub Info can at max be 280 characters long."
      }
    }
  }
  
  pub resource Base: Owner, Public {
    access(self) var name: String
    access(self) var avatar: String
    access(self) var color: String
    access(self) var info: String
    
    init() {
      self.name = "Anon"
      self.avatar = ""
      self.color = "#232323"
      self.info = ""
    }
    
    pub fun getName(): String { return self.name }
    pub fun getAvatar(): String { return self.avatar }
    pub fun getColor(): String {return self.color }
    pub fun getInfo(): String { return self.info }
    
    pub fun setName(_ name: String) { self.name = name }
    pub fun setAvatar(_ src: String) { self.avatar = src }
    pub fun setColor(_ color: String) { self.color = color }
    pub fun setInfo(_ info: String) { self.info = info }
    
    pub fun asReadOnly(): EventHub.ReadOnly {
      return EventHub.ReadOnly(
        address: self.owner?.address,
        name: self.getName(),
        avatar: self.getAvatar(),
        color: self.getColor(),
        info: self.getInfo()
      )
    }
  }

  pub struct ReadOnly {
    pub let address: Address?
    pub let name: String
    pub let avatar: String
    pub let color: String
    pub let info: String
    
    init(address: Address?, name: String, avatar: String, color: String, info: String) {
      self.address = address
      self.name = name
      self.avatar = avatar
      self.color = color
      self.info = info
    }
  }
  
  pub fun new(): @EventHub.Base {
    return <- create Base()
  }
  
  pub fun check(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&{EventHub.Public}>(EventHub.publicPath)
      .check()
  }
  
  pub fun fetch(_ address: Address): &{EventHub.Public} {
    return getAccount(address)
      .getCapability<&{EventHub.Public}>(EventHub.publicPath)
      .borrow()!
  }
  
  pub fun read(_ address: Address): EventHub.ReadOnly? {
    if let EventHub = getAccount(address).getCapability<&{EventHub.Public}>(EventHub.publicPath).borrow() {
      return EventHub.asReadOnly()
    } else {
      return nil
    }
  }
  
  pub fun readMultiple(_ addresses: [Address]): {Address: EventHub.ReadOnly} {
    let EventHubs: {Address: EventHub.ReadOnly} = {}
    for address in addresses {
      let EventHub = EventHub.read(address)
      if EventHub != nil {
        EventHubs[address] = EventHub!
      }
    }
    return EventHubs
  }

    
  init() {
    self.publicPath = /public/EventHub
    self.privatePath = /storage/EventHub
    
    self.account.save(<- self.new(), to: self.privatePath)
    self.account.link<&Base{Public}>(self.publicPath, target: self.privatePath)
    
    self.account
      .borrow<&Base{Owner}>(from: self.privatePath)!
      .setName("qvvg")
  }
}

// 2d39f0c52f51af47c557614b8107ce884e34cf432bc693b1fa9f02b10c216143