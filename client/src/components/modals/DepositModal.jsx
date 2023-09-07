import React from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Text, Center } from '@chakra-ui/react'
import DepositForm from '../forms/DepositForm'
import { Button } from 'antd'

const DepositModal = ({ accountAddress, account, accountBalance, accountName }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button size='small' type="default" onClick={onOpen}>
        <div style={{ fontSize: '12px' }}>Deposit</div>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={'xs'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Deposit </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2}>
          <Center>
            <DepositForm accountBalance={accountBalance} accountAddress={accountAddress} account={account} accountName={accountName} />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DepositModal
