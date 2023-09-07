import { Button, Center, HStack } from '@chakra-ui/react'
import { useMetaMask } from '../../hooks/useMetamask'

export const Navigation = () => {
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask()

  return (
    <div>

          <Center>
            <HStack>
              <div>
                {!hasProvider && (
                  <a href="https://metamask.io" target="_blank" rel="noreferrer">
                    Install MetaMask
                  </a>
                )}
                {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (
                  <Button w={'auto'} colorScheme="twitter" color="white" disabled={isConnecting} onClick={connectMetaMask}>
                    Connect MetaMask
                  </Button>
                )}
          
              </div>
            </HStack>
          </Center>
   
    </div>
  )
}
