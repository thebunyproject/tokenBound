import { useState, useEffect } from 'react'
import { Button, Image, Text, Tooltip } from '@chakra-ui/react'
import { useMetaMask } from '../../hooks/useMetamask'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'

const NetworkSwitcherIconOnly = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('') // State to keep track of the selected network
  const { wallet } = useMetaMask() // Use the MetaMask context to get the current wallet details
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State to keep track of whether the menu is open

  const switchNetwork = async (chainId) => {
    try {
      // First, check if the ethereum object is available in the window
      if (!window.ethereum) {
        throw new Error('Metamask not installed or not accessible.')
      }

      // Get the current chain ID
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })

      // If the current chain ID is the same as the desired chain ID, no need to switch
      if (currentChainId === chainId) {
        console.log('Already on the desired network.')
        return
      }

      // Check if the network is supported by Metamask
      const isSupportedNetwork = await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x' + chainId.toString(16), // Use the chainId directly here
            chainName: chainId === 43114 ? 'Avalanche Mainnet' : 'Avalanche Testnet', // Use the appropriate chain name
            nativeCurrency: {
              name: 'Avalanche',
              symbol: 'AVAX',
              decimals: 18,
            },
            rpcUrls: [
              'https://api.avax.network/ext/bc/C/rpc', // RPC URL for Avalanche Mainnet (Chain ID 43114)
              'https://api.avax-test.network/ext/bc/C/rpc', // RPC URL for Avalanche Testnet (Chain ID 43113)
            ],
            blockExplorerUrls: [
              'https://snowtrace.io/', // Block explorer URL for Avalanche Mainnet
              'https://testnet.snowtrace.io', // Block explorer URL for Avalanche Testnet
            ],
          },
        ],
      })

      if (!isSupportedNetwork) {
        throw new Error('The network you are trying to switch to is not supported by Metamask.')
      }

      // Switch to the desired network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + chainId.toString(16) }], // Use the chainId directly here
      })

      console.log('Network switched successfully.')
    } catch (error) {
      console.error('Failed to switch network:', error)
    }
  }

  const handleMenuOpen = () => {
    setIsMenuOpen(true)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleNetworkSwitch = async () => {
      if (selectedNetwork === 'Avalanche Mainnet') {
        await switchNetwork(43114) // Call 'switchNetwork' with the chain ID for Avalanche Mainnet (43114)
      } else if (selectedNetwork === 'Avalanche Testnet') {
        await switchNetwork(43113) // Call 'switchNetwork' with the chain ID for Avalanche Testnet (43113)
      }
    }

    if (selectedNetwork !== '') {
      handleNetworkSwitch()
    }
  }, [selectedNetwork])

  const handleNetworkChange = async (value) => {
    setSelectedNetwork(value) // Update the selected network on change
  }

  return (
    <Menu onOpen={handleMenuOpen} onClose={handleMenuClose}>
      <Tooltip hasArrow label="Switch Network" bg="#c1cfd8" color="black">
        <MenuButton size={'auto'} bg={'transparent'} as={Button} __css={{ _hover: { boxShadow: 'none' } }}>
          {/*
      <Image boxSize='33px' bg='transparent' src='/telos.png' mr='-2px'  />
        */}
          <model-viewer
            style={{
              width: '33px',
              height: '33px',
              marginTop: '-3px',
              backgroundColor: 'transparent',
            }}
            src="/avax.glb"
            poster="/avaxLogo.png"
            //                 ar
            //                   ar-modes="scene-viewer webxr quick-look"
            //camera-controls
            shadow-intensity="0.99"
            auto-rotate={isMenuOpen ? true : false} // Conditionally enable auto-rotate based on the menu state
            shadow-softness="0.57"></model-viewer>
        </MenuButton>
      </Tooltip>
      <MenuList>
        <MenuItem minH="48px" onClick={() => handleNetworkChange('Avalanche Testnet')}>
          <Image boxSize="2rem" borderRadius="full" src="/avaxLogo.png" mr="6px" />
          <Text>Avalanche Testnet</Text>
        </MenuItem>
        <MenuItem minH="40px" onClick={() => handleNetworkChange('Avalanche Mainnet')}>
          <Image boxSize="2rem" borderRadius="full" src="/avaxLogo.png" mr="6px" />
          <Text>Avalanche Mainnet</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default NetworkSwitcherIconOnly
