import React from 'react';
import { TabBar } from 'antd-mobile';
import { Route, Switch, useHistory, useLocation, MemoryRouter as Router } from 'react-router-dom';
import { AppOutline, MessageOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import AccountAppearance from '../Account/AccountAppearance';
import CalendarSelector from '../Calendar/CalendarSelector';
import CreateCalendarForm from '../forms/CreateCalendarForm';
import { Box } from '@chakra-ui/react';
import GoogleCalendar from '../GoogleApi/GoogleCalendar';

const SettingsTabBar = () => {
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;
  const setRouteActive = (value) => {
    history.push(value);
  };
  const tabs = [
    {
      key: '/import-export',
      title: 'ImportExport',
      icon: <AppOutline />,
    },
    {
      key: '/profile',
      title: 'Profile',
      icon: <UnorderedListOutline />,
    },
    {
      key: '/calendar',
      title: 'Calendar',
      icon: <MessageOutline />,
    },
    {
      key: '/appearance',
      title: 'Appearance',
      icon: <UserOutline />,
    },
  ];
  return (
    <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)}>
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};

export default () => {
  return (
    <Router initialEntries={['/home']}>
       <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh" // Ensure the container fills the whole screen height
        overflow="hidden" // Disable vertical scrolling
      >
        <div style={{ flexGrow: 1 }}>
          <Switch>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/calendar">
              <Calendar />
            </Route>
            <Route exact path="/appearance">
              <Appearance />
            </Route>
            <Route exact path="/import-export">
              <ImportExport />
            </Route>
          </Switch>
        </div>
        <div
          style={{
            borderTop: '1px solid silver',
            position: 'fixed', // Position the footer at the bottom of the screen
            bottom: 0, // Stick the footer to the bottom
            marginBottom: 6,
            left: 0, // Align the footer to the left
            right: 0, // Align the footer to the right
            background: 'white', // Set a background color for the footer
            zIndex: 999, // Ensure the footer is above other content
          }}
        >
          <SettingsTabBar />
        </div>
      </Box>
    </Router>
  );
};

function ImportExport() {
  return <div>
    <GoogleCalendar />
  </div>;
}

function Profile() {
  return <div>Profile</div>;
}

function Calendar() {
  return (
    <div>
      <CalendarSelector />
      <>
      <Box mt={2}>
        <CreateCalendarForm />
        </Box>
      </>
    </div>
  );
}

function Appearance() {
  return (
    <div>
      <AccountAppearance />
    </div>
  );
}
