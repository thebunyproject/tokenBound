import React, {  } from 'react'
import { Box, Center } from '@chakra-ui/react'
import AccountLogin from '../modals/AccountLogin'
import MintFormLayout from './MintFormLayout'
import TBADescription from './../text/TBADescription';

const ThreeColumns = ({ onNftDetails, onAccountAddressChange }) => {
  
  


  return (
    <Center w={'100%'} p={2} bg="white">
      <Box w='100%' maxWidth={600} mt={4}  borderTop="1px solid silver" style={{ overflowX: 'hidden' }}>
        <Box p={4} w="100%" mt={2}>
          <AccountLogin onNftDetails={onNftDetails} onAccountAddressChange={onAccountAddressChange} />
        </Box>

        <TBADescription />
      </Box>
    </Center>
  )
}

export default ThreeColumns
