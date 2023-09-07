import React, { useContext } from 'react';
import { HStack, Center, Wrap, WrapItem } from '@chakra-ui/react';

import SettingsDrawer from '../drawers/SettingsDrawer';
import CreateEventDrawer from '../drawers/CreateEventDrawer';
import InvitationsDrawer from '../drawers/InvitationsDrawer';
import FetchMembersDrawer from '../drawers/FetchMembersDrawer';
import { AppContext } from '../../AppContext';

const IconDashboard = ({
    
  fetchInvitations,
}) => {
  const { account, logged, accountAddress } = useContext(AppContext);

  return (
    <Center >
      <HStack >
      <Wrap >
      <WrapItem>
        {/* CreateEventDrawer component */}
        <CreateEventDrawer account={account} accountAddress={accountAddress} />
</WrapItem>
<WrapItem>
        {/* InvitationsDrawer component */}
        <InvitationsDrawer fetchInvitations={fetchInvitations} />
</WrapItem>
<WrapItem>
        {/* FetchMembersDrawer component */}
        <FetchMembersDrawer />
</WrapItem>
<WrapItem>
        {/* SettingsDrawer component */}
        <SettingsDrawer
        />
        </WrapItem>
        </Wrap>
      </HStack>
    </Center>
  );
};

export default IconDashboard;
