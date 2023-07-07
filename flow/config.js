import { config } from '@onflow/fcl';

config()
	.put('accessNode.api', 'http://localhost:8888') // This connects us to Flow TestNet
	// .put('accessNode.api', 'https://rest-testnet.onflow.org') // This connects us to Flow TestNet
	// .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn/') // Allows us to connect to Blocto & Lilico Wallet
	.put('discovery.wallet', 'http://localhost:8701/fcl/authn') // Allows us to connect to Blocto & Lilico Wallet
	.put('app.detail.title', 'Event Hub') // Will be the title when user clicks on wallet
	.put('app.detail.icon', 'https://i.imgur.com/ux3lYB9.png'); // Will be the icon when user clicks on wallet