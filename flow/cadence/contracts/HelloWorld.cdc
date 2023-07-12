pub contract HelloWorld {

    // Declare a resource that only includes one function.
    pub resource HelloAsset {

        pub var greeting: String

        pub fun hello(): String {
            return self.greeting
        }

        pub fun setHello(_txt: String) {
            self.greeting = _txt
        }

        init() {
            self.greeting = "Hello world"
        }
    }

    // We're going to use the built-in create function to create a new instance
    // of the HelloAsset resource
    pub fun createHelloAsset(): @HelloAsset {
        return <-create HelloAsset()
    }

    init() {
        log("Hello Asset")
    }
}       