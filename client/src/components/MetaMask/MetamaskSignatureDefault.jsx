import { Box, Button, Grid, GridItem, HStack, Text, VStack, useToast } from '@chakra-ui/react'
import { ethers, utils } from 'ethers'
import React, { useState, useEffect, useContext } from 'react'
import { CopyIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { AppContext } from '../../AppContext'
import BunyERC6551Registry from '../../contracts/BunyERC6551Registry.json'
import BunyERC6551Account from '../../contracts/BunyERC6551Account.json'

const MetamaskSignatureDefault = ({keysign}) => {
  const toast = useToast()

  const { account, setAccount,  accountAddress, setLogged, setAccountAddress, setSignature, signature, avatarImage, setAvatarImage, setAvatarName, logged } = useContext(AppContext)
  const [provider, setProvider] = useState('')
  const [_verified, setVerified] = useState('')
  const [verificationStatus, setVerificationStatus] = useState('')
  const [encryptionKey, setEncryptionKey] = useState('');

  


  const presig = '2XVL4AHzyttQop0e17e8x4buLml6Sibbmr2JPSx09GA='
  

  const handleLogin = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!')
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          console.log(result)
          setLogged(true);
          const address = utils.getAddress(result[0])
          setAccount(address)
          const newProvider = new ethers.providers.Web3Provider(window.ethereum)
          setProvider(newProvider)
        })
        .catch((error) => {
          console.log('Could not detect Account')
        })
    } else {
      console.log('Need to install MetaMask')
    }
  }

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    // Step 2: Show a toast notification when the copy action is successful
    toast({
      title: 'Copied to Clipboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

 

  useEffect(() => {
    if(signature){
    verify()
    }
  }, [signature])


  const handleSign = async () => {
    const ethereum = window.ethereum;
    const keysign = await ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [account],
    });
    setEncryptionKey(keysign);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const signature = await signer.signMessage(keysign)
    const address = await signer.getAddress()
    setSignature(signature)
    console.log('sig : ' + signature)
  }

  const verify = () => {
    const verifyThis = utils.verifyMessage(presig, signature)
    console.log(verifyThis)
    setVerified(verifyThis)
    if (signature) {
      console.log('valid signature')
      setVerificationStatus('Signature match found! Verification Successful')
    } else {
      console.log('wrong')
      setVerificationStatus('Invalid')
    }
  }
  return (
    <Box>
      {!logged ? (
        <VStack spacing={3}>
          <Text fontSize="12px">Log in with Metamask wallet</Text>
          <Button onClick={handleLogin} colorScheme="twitter">
            Connect
          </Button>
        </VStack>
      ) : (
        <VStack spacing={3}>
          {!signature && keysign && (
            <>
              <Button w="100%" onClick={() => handleSign()} size={'sm'} colorScheme="twitter">
                Sign
              </Button>
            </>
          )}
          {signature && (
            <>
    

              <Box bg="ghostwhite" textAlign={'left'} p={3} rounded="md" w={'100%'} border='1px solid silver'>
                <Text as='b' >Signature</Text>
                <Text noOfLines={4} overflow={'auto'} w={300} fontSize="14px" color="purple.500" bg="white" p={4} border='1px solid silver'>
                 {signature && <>{signature}</>}
                 <IconButton
                                  size='xs'
                                  variant={'outline'}
                                  aria-label="Copy to Clipboard"
                                  icon={<CopyIcon />}
                                  onClick={() => copyToClipboard(signature)}
                                />
                </Text>
                
              </Box>

     
              <Box bg="ghostwhite" p={3} rounded="md" w={'100%'} border='1px solid silver'>
<Box>
  {_verified}
</Box>
<Text fontSize="14px" color="purple.500" bg="white" p={4} border='1px solid silver'>
{verificationStatus}


<Button variant={'solid'} colorScheme='twitter' w='100%'>Decrypt Message</Button>
</Text>
</Box>
            </>
          )}
        </VStack>
      )}
    </Box>
  )
}

export default MetamaskSignatureDefault
